from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db, Scan, Finding
from app.api.scans import get_scan_summary

router = APIRouter()


def severity_color(severity: str) -> str:
    return {
        "critical": "#dc2626",
        "high": "#ea580c",
        "medium": "#ca8a04",
        "low": "#16a34a",
        "info": "#6b7280"
    }.get(severity, "#6b7280")


@router.get("/{scan_id}/html", response_class=HTMLResponse)
def generate_html_report(scan_id: str, db: Session = Depends(get_db)):
    """Generate a printable HTML report for a completed scan."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    findings = db.query(Finding).filter(Finding.scan_id == scan_id).order_by(
        Finding.judge_score.desc()
    ).all()

    vulnerabilities = [f for f in findings if f.vulnerability_detected]
    summary = get_scan_summary(scan_id, db)

    vuln_rows = ""
    for f in vulnerabilities:
        color = severity_color(f.severity)
        vuln_rows += f"""
        <tr>
            <td><span style="color:{color};font-weight:700">{f.severity.upper()}</span></td>
            <td><strong>{f.probe_name}</strong><br/><small>{f.category}</small></td>
            <td style="font-size:0.8em;color:#555">{f.prompt_sent[:200]}...</td>
            <td style="font-size:0.8em">{f.judge_reasoning or 'N/A'}</td>
            <td style="font-size:0.75em;color:#555">{f.hipaa_reference or 'N/A'}</td>
            <td style="font-size:0.75em;color:#555">{f.owasp_ref or 'N/A'}</td>
        </tr>
        """

    report_html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>HealthGuard AI - Red Team Report - {scan.name}</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: 'Georgia', serif; color: #1a1a1a; background: #fff; padding: 40px; }}
  .header {{ border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }}
  .header h1 {{ font-size: 2em; color: #dc2626; }}
  .header h2 {{ font-size: 1.1em; color: #555; font-weight: normal; margin-top: 5px; }}
  .meta {{ display: flex; gap: 40px; margin: 20px 0; }}
  .meta-item {{ }}
  .meta-item label {{ font-size: 0.75em; text-transform: uppercase; color: #888; }}
  .meta-item p {{ font-size: 1em; font-weight: 600; }}
  .risk-banner {{ background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }}
  .risk-score {{ font-size: 3em; font-weight: 900; color: #dc2626; }}
  .risk-label {{ font-size: 0.9em; color: #555; }}
  .severity-grid {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 20px 0; }}
  .sev-card {{ border-radius: 6px; padding: 15px; text-align: center; }}
  .sev-card .count {{ font-size: 2em; font-weight: 900; }}
  .sev-card .label {{ font-size: 0.75em; text-transform: uppercase; }}
  .section-title {{ font-size: 1.2em; font-weight: 700; border-left: 4px solid #dc2626; padding-left: 12px; margin: 30px 0 15px; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 0.85em; }}
  th {{ background: #1a1a1a; color: white; padding: 10px; text-align: left; }}
  td {{ padding: 10px; border-bottom: 1px solid #eee; vertical-align: top; }}
  tr:nth-child(even) {{ background: #f9f9f9; }}
  .compliance-list {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }}
  .badge {{ background: #fef3c7; border: 1px solid #d97706; color: #92400e; padding: 4px 10px; border-radius: 999px; font-size: 0.75em; }}
  .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888; }}
  @media print {{ body {{ padding: 20px; }} }}
</style>
</head>
<body>

<div class="header">
  <h1>🏥 HealthGuard AI — Red Team Assessment Report</h1>
  <h2>{scan.name} | {scan.target.name if scan.target else 'Unknown Target'}</h2>
</div>

<div class="meta">
  <div class="meta-item">
    <label>Report Generated</label>
    <p>{datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}</p>
  </div>
  <div class="meta-item">
    <label>Scan Status</label>
    <p>{scan.status.upper()}</p>
  </div>
  <div class="meta-item">
    <label>Total Probes Run</label>
    <p>{summary['total_probes']}</p>
  </div>
  <div class="meta-item">
    <label>Vulnerabilities Found</label>
    <p style="color:#dc2626">{summary['vulnerabilities_found']}</p>
  </div>
  <div class="meta-item">
    <label>Pass Rate</label>
    <p>{summary['pass_rate']}%</p>
  </div>
</div>

<div class="risk-banner">
  <div>
    <div class="risk-score">{summary['risk_percentage']}%</div>
    <div class="risk-label">Overall Risk Score</div>
  </div>
  <div style="max-width:400px;font-size:0.9em;color:#555">
    Risk score is a weighted calculation based on severity of detected vulnerabilities
    relative to the number of probes executed. Critical findings carry 10x weight.
  </div>
</div>

<div class="severity-grid">
  <div class="sev-card" style="background:#fef2f2;color:#dc2626">
    <div class="count">{summary['severity_breakdown']['critical']}</div>
    <div class="label">Critical</div>
  </div>
  <div class="sev-card" style="background:#fff7ed;color:#ea580c">
    <div class="count">{summary['severity_breakdown']['high']}</div>
    <div class="label">High</div>
  </div>
  <div class="sev-card" style="background:#fefce8;color:#ca8a04">
    <div class="count">{summary['severity_breakdown']['medium']}</div>
    <div class="label">Medium</div>
  </div>
  <div class="sev-card" style="background:#f0fdf4;color:#16a34a">
    <div class="count">{summary['severity_breakdown']['low']}</div>
    <div class="label">Low</div>
  </div>
  <div class="sev-card" style="background:#f9fafb;color:#6b7280">
    <div class="count">{summary['severity_breakdown']['info']}</div>
    <div class="label">Info</div>
  </div>
</div>

<div class="section-title">Compliance Framework References</div>
<div class="compliance-list">
  {''.join(f'<span class="badge">{ref}</span>' for ref in summary.get('hipaa_references', []))}
  {''.join(f'<span class="badge" style="background:#eff6ff;border-color:#3b82f6;color:#1d4ed8">{ref}</span>' for ref in summary.get('owasp_references', []))}
</div>

<div class="section-title">Vulnerability Findings</div>
{'<p style="color:#16a34a;font-size:1.1em">✅ No vulnerabilities detected in this scan.</p>' if not vulnerabilities else f'''
<table>
  <thead>
    <tr>
      <th>Severity</th>
      <th>Probe</th>
      <th>Prompt (preview)</th>
      <th>Judge Reasoning</th>
      <th>HIPAA Ref</th>
      <th>OWASP Ref</th>
    </tr>
  </thead>
  <tbody>
    {vuln_rows}
  </tbody>
</table>
'''}

<div class="section-title">Remediation Priority</div>
<p style="font-size:0.9em;color:#555;margin-bottom:15px">
  Address Critical and High findings immediately. Each finding includes specific remediation
  guidance mapped to HIPAA technical safeguards and OWASP LLM Top 10 controls.
</p>

<div class="footer">
  <p>Generated by HealthGuard AI Red Team Platform | For internal security use only</p>
  <p>This report contains sensitive security findings. Handle according to your organization's data classification policy.</p>
</div>

</body>
</html>
"""
    return HTMLResponse(content=report_html)


@router.get("/{scan_id}/json")
def generate_json_report(scan_id: str, db: Session = Depends(get_db)):
    """Generate a structured JSON report for programmatic consumption or SIEM ingestion."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    findings = db.query(Finding).filter(
        Finding.scan_id == scan_id,
        Finding.vulnerability_detected == True
    ).order_by(Finding.judge_score.desc()).all()

    summary = get_scan_summary(scan_id, db)

    return {
        "report_type": "healthguard_ai_red_team",
        "generated_at": datetime.utcnow().isoformat(),
        "scan": {
            "id": scan_id,
            "name": scan.name,
            "target": scan.target.name if scan.target else None,
            "status": scan.status,
            "completed_at": str(scan.completed_at) if scan.completed_at else None,
        },
        "summary": summary,
        "vulnerabilities": [
            {
                "id": f.id,
                "probe_id": f.probe_id,
                "probe_name": f.probe_name,
                "category": f.category,
                "severity": f.severity,
                "judge_score": f.judge_score,
                "judge_reasoning": f.judge_reasoning,
                "prompt_sent": f.prompt_sent,
                "response_received": f.response_received,
                "hipaa_reference": f.hipaa_reference,
                "mitre_atlas_ref": f.mitre_atlas_ref,
                "owasp_ref": f.owasp_ref,
                "remediation": f.remediation,
            }
            for f in findings
        ]
    }
