"""
Scan Runner
===========
Celery task that orchestrates the full red team scan:
1. Loads target and selected probe categories
2. Sends each probe to the target chatbot
3. Evaluates responses using LLM judge
4. Persists findings to the database
"""

import asyncio
from datetime import datetime
from celery import Task
from sqlalchemy.orm import Session

from app.core.celery_app import celery_app
from app.core.database import SessionLocal, Scan, Finding, ScanStatus
from app.probes.healthcare_probes import get_probes_by_category, get_probe_by_id
from app.services.judge import judge_response
from app.services.target_connector import send_probe


class ScanTask(Task):
    abstract = True

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        scan_id = args[0] if args else kwargs.get("scan_id")
        if scan_id:
            db = SessionLocal()
            try:
                scan = db.query(Scan).filter(Scan.id == scan_id).first()
                if scan:
                    scan.status = ScanStatus.failed
                    scan.completed_at = datetime.utcnow()
                    db.commit()
            finally:
                db.close()


@celery_app.task(bind=True, base=ScanTask, name="run_scan")
def run_scan(self, scan_id: str):
    """Main Celery task to execute a full red team scan."""
    asyncio.run(_run_scan_async(self, scan_id))


async def _run_scan_async(task, scan_id: str):
    db = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            raise ValueError(f"Scan {scan_id} not found")

        # Mark as running
        scan.status = ScanStatus.running
        scan.started_at = datetime.utcnow()
        db.commit()

        target = scan.target
        probes = get_probes_by_category(scan.probe_categories or None)
        scan.total_probes = len(probes)
        db.commit()

        findings_count = 0

        for i, probe in enumerate(probes):
            try:
                # Send probe to target
                response_text = await send_probe(target, probe["prompt"])

                # Judge the response
                judgment = await judge_response(probe, probe["prompt"], response_text)

                # Map severity
                severity_map = {5: "critical", 4: "high", 3: "medium", 2: "low", 1: "info"}
                severity = severity_map.get(int(judgment["judge_score"]), probe["severity"])

                # Persist finding
                finding = Finding(
                    scan_id=scan_id,
                    probe_id=probe["id"],
                    probe_name=probe["name"],
                    category=probe["category"],
                    severity=severity,
                    prompt_sent=probe["prompt"],
                    response_received=response_text,
                    vulnerability_detected=judgment["vulnerability_detected"],
                    judge_score=judgment["judge_score"],
                    judge_reasoning=judgment["judge_reasoning"],
                    hipaa_reference=probe.get("hipaa_reference"),
                    mitre_atlas_ref=probe.get("mitre_atlas_ref"),
                    owasp_ref=probe.get("owasp_ref"),
                    remediation=probe.get("remediation")
                )
                db.add(finding)

                if judgment["vulnerability_detected"]:
                    findings_count += 1

                scan.completed_probes = i + 1
                scan.findings_count = findings_count
                db.commit()

                # Update Celery task state for progress tracking
                task.update_state(
                    state="PROGRESS",
                    meta={
                        "completed": i + 1,
                        "total": len(probes),
                        "current_probe": probe["name"],
                        "findings_so_far": findings_count
                    }
                )

            except Exception as probe_error:
                # Log probe failure but continue scan
                finding = Finding(
                    scan_id=scan_id,
                    probe_id=probe["id"],
                    probe_name=probe["name"],
                    category=probe["category"],
                    severity="info",
                    prompt_sent=probe["prompt"],
                    response_received=f"ERROR: {str(probe_error)}",
                    vulnerability_detected=False,
                    judge_score=0,
                    judge_reasoning=f"Probe execution failed: {str(probe_error)}",
                    hipaa_reference=probe.get("hipaa_reference"),
                    mitre_atlas_ref=probe.get("mitre_atlas_ref"),
                    owasp_ref=probe.get("owasp_ref"),
                    remediation=probe.get("remediation")
                )
                db.add(finding)
                scan.failed_probes = (scan.failed_probes or 0) + 1
                scan.completed_probes = i + 1
                db.commit()

        # Mark as complete
        scan.status = ScanStatus.completed
        scan.completed_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        db.rollback()
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if scan:
            scan.status = ScanStatus.failed
            scan.completed_at = datetime.utcnow()
            db.commit()
        raise e
    finally:
        db.close()
