import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { scans as scansApi, reports } from '../utils/api';

const SEV_ORDER = ['critical', 'high', 'medium', 'low', 'info'];

function SeverityBadge({ severity }) {
  return <span className={`badge badge-${severity}`}>{severity}</span>;
}

function FindingRow({ finding, expanded, onToggle }) {
  return (
    <div style={{
      border: `1px solid ${finding.vulnerability_detected ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
      borderRadius: 4,
      marginBottom: 8,
      overflow: 'hidden',
      background: finding.vulnerability_detected ? 'rgba(239,68,68,0.03)' : 'var(--surface)',
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.2em' }}>{finding.vulnerability_detected ? '🔴' : '🟢'}</span>
          <div>
            <div style={{ fontWeight: 500, fontSize: '0.9em' }}>{finding.probe_name}</div>
            <div style={{ fontSize: '0.7em', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>{finding.category}</div>
          </div>
        </div>
        <div style={{ display: 'flex', align: 'center', gap: 12 }}>
          <SeverityBadge severity={finding.severity} />
          {finding.judge_score && (
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.75em', color: 'var(--text-muted)' }}>
              score: {finding.judge_score}/5
            </span>
          )}
          <span style={{ color: 'var(--text-muted)' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
          <div className="grid-2" style={{ gap: 16, marginTop: 16 }}>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Prompt Sent</div>
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '10px 12px',
                fontFamily: 'IBM Plex Mono',
                fontSize: '0.78em',
                whiteSpace: 'pre-wrap',
                color: '#f97316',
              }}>{finding.prompt_sent}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Response Received</div>
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '10px 12px',
                fontFamily: 'IBM Plex Mono',
                fontSize: '0.78em',
                whiteSpace: 'pre-wrap',
                color: finding.vulnerability_detected ? '#ef4444' : '#22c55e',
              }}>{finding.response_received || '(no response)'}</div>
            </div>
          </div>

          {finding.judge_reasoning && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Judge Analysis</div>
              <div style={{
                background: 'rgba(59,130,246,0.05)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 4,
                padding: '10px 12px',
                fontSize: '0.85em',
                color: '#93c5fd',
              }}>{finding.judge_reasoning}</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            {finding.hipaa_reference && (
              <div style={{ fontSize: '0.75em' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>HIPAA: </span>
                <span style={{ color: '#fbbf24' }}>{finding.hipaa_reference}</span>
              </div>
            )}
            {finding.owasp_ref && (
              <div style={{ fontSize: '0.75em' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>OWASP: </span>
                <span style={{ color: '#60a5fa' }}>{finding.owasp_ref}</span>
              </div>
            )}
            {finding.mitre_atlas_ref && (
              <div style={{ fontSize: '0.75em' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>MITRE: </span>
                <span style={{ color: '#a78bfa' }}>{finding.mitre_atlas_ref}</span>
              </div>
            )}
          </div>

          {finding.remediation && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Remediation</div>
              <div style={{
                background: 'rgba(34,197,94,0.05)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 4,
                padding: '10px 12px',
                fontSize: '0.85em',
                color: '#86efac',
              }}>{finding.remediation}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScanDetail() {
  const { scanId } = useParams();
  const [scan, setScan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [findings, setFindings] = useState([]);
  const [vulnOnly, setVulnOnly] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      const [scanRes, findingsRes] = await Promise.all([
        scansApi.get(scanId),
        scansApi.findings(scanId, vulnOnly),
      ]);
      setScan(scanRes.data);
      setFindings(findingsRes.data);

      if (scanRes.data.status === 'completed') {
        const summRes = await scansApi.summary(scanId);
        setSummary(summRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [scanId, vulnOnly]);

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      if (scan?.status === 'running' || scan?.status === 'pending') load();
    }, 3000);
    return () => clearInterval(interval);
  }, [load, scan?.status]);

  if (!scan) return <div className="muted mono">Loading scan...</div>;

  const isRunning = scan.status === 'running' || scan.status === 'pending';
  const progress = scan.total_probes > 0 ? (scan.completed_probes / scan.total_probes * 100) : 0;

  const filteredFindings = filter === 'all' ? findings : findings.filter(f => f.severity === filter);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div className="page-title">{scan.name}</div>
          <div className="page-subtitle">{scan.target_name} · Started {scan.started_at ? new Date(scan.started_at).toLocaleString() : 'N/A'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className={`badge badge-${scan.status}`} style={{ fontSize: '0.85em', padding: '6px 12px' }}>{scan.status.toUpperCase()}</span>
          {scan.status === 'completed' && (
            <>
              <a href={reports.htmlUrl(scanId)} target="_blank" rel="noreferrer" className="btn btn-secondary">📄 HTML Report</a>
              <a href={reports.jsonUrl(scanId)} target="_blank" rel="noreferrer" className="btn btn-ghost">{ } JSON</a>
            </>
          )}
        </div>
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(59,130,246,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8em', color: '#3b82f6' }}>
              ▶ SCAN IN PROGRESS
              {scan.live_progress?.current_probe && (
                <span style={{ color: 'var(--text-muted)', marginLeft: 16 }}>
                  Currently: {scan.live_progress.current_probe}
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8em', color: 'var(--text-muted)' }}>
              {scan.completed_probes} / {scan.total_probes} probes
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill pulse" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ marginTop: 10, fontFamily: 'IBM Plex Mono', fontSize: '0.75em', color: '#ef4444' }}>
            {scan.findings_count} vulnerabilities detected so far
          </div>
        </div>
      )}

      {/* Summary stats */}
      {summary && (
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <div className="stat-card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
            <div className="stat-value" style={{ color: '#ef4444' }}>{summary.risk_percentage}%</div>
            <div className="stat-label">Risk Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ef4444' }}>{summary.vulnerabilities_found}</div>
            <div className="stat-label">Vulnerabilities</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#22c55e' }}>{summary.pass_rate}%</div>
            <div className="stat-label">Pass Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.total_probes}</div>
            <div className="stat-label">Total Probes</div>
          </div>
        </div>
      )}

      {/* Severity breakdown */}
      {summary && (
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {SEV_ORDER.slice(0, 4).map(sev => (
            <div key={sev} className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: `var(--${sev})` }}>
                {summary.severity_breakdown[sev]}
              </div>
              <div className="stat-label">{sev}</div>
            </div>
          ))}
        </div>
      )}

      {/* Findings */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600 }}>Findings ({filteredFindings.length})</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn ${vulnOnly ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setVulnOnly(!vulnOnly)}
          >
            {vulnOnly ? '🔴 Vulnerabilities Only' : '📋 All Probes'}
          </button>
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
              style={{ fontSize: '0.7em', padding: '4px 10px' }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredFindings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          {isRunning ? (
            <div className="pulse">Waiting for results...</div>
          ) : (
            <div>
              <div style={{ fontSize: '2em', marginBottom: 8 }}>🟢</div>
              <div>No vulnerabilities detected in this scan.</div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {filteredFindings.map(f => (
            <FindingRow
              key={f.id}
              finding={f}
              expanded={!!expanded[f.id]}
              onToggle={() => setExpanded(e => ({ ...e, [f.id]: !e[f.id] }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
