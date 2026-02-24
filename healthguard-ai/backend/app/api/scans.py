from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db, Scan, Finding, Target, ScanStatus
from app.core.celery_app import celery_app
from app.services.scan_runner import run_scan

router = APIRouter()


class ScanCreate(BaseModel):
    target_id: str
    name: str
    probe_categories: Optional[List[str]] = None  # None = all categories


@router.get("/")
def list_scans(db: Session = Depends(get_db)):
    scans = db.query(Scan).order_by(Scan.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "target_id": s.target_id,
            "target_name": s.target.name if s.target else None,
            "status": s.status,
            "total_probes": s.total_probes,
            "completed_probes": s.completed_probes,
            "findings_count": s.findings_count,
            "created_at": str(s.created_at),
            "completed_at": str(s.completed_at) if s.completed_at else None,
        }
        for s in scans
    ]


@router.post("/")
def create_scan(scan: ScanCreate, db: Session = Depends(get_db)):
    target = db.query(Target).filter(Target.id == scan.target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    db_scan = Scan(
        target_id=scan.target_id,
        name=scan.name,
        probe_categories=scan.probe_categories,
        status=ScanStatus.pending
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)

    # Kick off the async Celery task
    task = run_scan.delay(db_scan.id)
    db_scan.celery_task_id = task.id
    db.commit()

    return {
        "id": db_scan.id,
        "name": db_scan.name,
        "status": db_scan.status,
        "celery_task_id": task.id,
        "message": "Scan started"
    }


@router.get("/{scan_id}")
def get_scan(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    # Get progress from Celery if still running
    progress = None
    if scan.celery_task_id and scan.status == ScanStatus.running:
        task = celery_app.AsyncResult(scan.celery_task_id)
        if task.state == "PROGRESS":
            progress = task.info

    return {
        "id": scan.id,
        "name": scan.name,
        "target_id": scan.target_id,
        "target_name": scan.target.name if scan.target else None,
        "status": scan.status,
        "probe_categories": scan.probe_categories,
        "total_probes": scan.total_probes,
        "completed_probes": scan.completed_probes,
        "failed_probes": scan.failed_probes,
        "findings_count": scan.findings_count,
        "started_at": str(scan.started_at) if scan.started_at else None,
        "completed_at": str(scan.completed_at) if scan.completed_at else None,
        "created_at": str(scan.created_at),
        "live_progress": progress,
    }


@router.get("/{scan_id}/findings")
def get_scan_findings(
    scan_id: str,
    vulnerability_only: bool = False,
    db: Session = Depends(get_db)
):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    query = db.query(Finding).filter(Finding.scan_id == scan_id)
    if vulnerability_only:
        query = query.filter(Finding.vulnerability_detected == True)

    findings = query.order_by(Finding.judge_score.desc()).all()

    return [
        {
            "id": f.id,
            "probe_id": f.probe_id,
            "probe_name": f.probe_name,
            "category": f.category,
            "severity": f.severity,
            "vulnerability_detected": f.vulnerability_detected,
            "judge_score": f.judge_score,
            "judge_reasoning": f.judge_reasoning,
            "prompt_sent": f.prompt_sent,
            "response_received": f.response_received,
            "hipaa_reference": f.hipaa_reference,
            "mitre_atlas_ref": f.mitre_atlas_ref,
            "owasp_ref": f.owasp_ref,
            "remediation": f.remediation,
            "created_at": str(f.created_at),
        }
        for f in findings
    ]


@router.get("/{scan_id}/summary")
def get_scan_summary(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    findings = db.query(Finding).filter(Finding.scan_id == scan_id).all()
    vulnerabilities = [f for f in findings if f.vulnerability_detected]

    severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0}
    category_counts = {}

    for v in vulnerabilities:
        severity_counts[v.severity] = severity_counts.get(v.severity, 0) + 1
        category_counts[v.category] = category_counts.get(v.category, 0) + 1

    # Risk score: weighted sum of severities
    risk_score = (
        severity_counts["critical"] * 10 +
        severity_counts["high"] * 7 +
        severity_counts["medium"] * 4 +
        severity_counts["low"] * 1
    )
    max_possible = len(findings) * 10
    risk_percentage = round((risk_score / max_possible * 100) if max_possible > 0 else 0, 1)

    return {
        "scan_id": scan_id,
        "scan_name": scan.name,
        "target_name": scan.target.name if scan.target else None,
        "total_probes": scan.total_probes,
        "vulnerabilities_found": len(vulnerabilities),
        "pass_rate": round((1 - len(vulnerabilities) / max(scan.total_probes, 1)) * 100, 1),
        "risk_score": risk_score,
        "risk_percentage": risk_percentage,
        "severity_breakdown": severity_counts,
        "category_breakdown": category_counts,
        "hipaa_references": list(set(f.hipaa_reference for f in vulnerabilities if f.hipaa_reference)),
        "owasp_references": list(set(f.owasp_ref for f in vulnerabilities if f.owasp_ref)),
    }
