import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scans as scansApi } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SEV_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  info: '#6b7280',
};

export default function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scansApi.list().then(r => {
      setScans(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const completed = scans.filter(s => s.status === 'completed');
  const totalFindings = scans.reduce((a, s) => a + (s.findings_count || 0), 0);
  const totalProbes = scans.reduce((a, s) => a + (s.total_probes || 0), 0);

  const recentScans = scans.slice(0, 8);

  const chartData = [
    { name: 'Critical', value: 0, color: '#ef4444' },
    { name: 'High', value: 0, color: '#f97316' },
    { name: 'Medium', value: 0, color: '#eab308' },
    { name: 'Low', value: 0, color: '#22c55e' },
  ];

  return (
    <div>
      <div className="page-title">Security Dashboard</div>
      <div className="page-subtitle">AI Chatbot Red Team Assessment Overview</div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#e8e8ea' }}>{scans.length}</div>
          <div className="stat-label">Total Scans</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>{totalFindings}</div>
          <div className="stat-label">Vulnerabilities Found</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#3b82f6' }}>{totalProbes}</div>
          <div className="stat-label">Probes Executed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#22c55e' }}>{completed.length}</div>
          <div className="stat-label">Completed Scans</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        {/* Recent Scans */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600 }}>Recent Scans</div>
            <Link to="/scans/new" className="btn btn-primary">+ New Scan</Link>
          </div>
          {loading ? (
            <div className="muted mono" style={{ fontSize: '0.8em' }}>Loading...</div>
          ) : scans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2em', marginBottom: 8 }}>◈</div>
              <div>No scans yet.</div>
              <Link to="/scans/new" style={{ color: 'var(--accent)', fontSize: '0.9em' }}>Start your first scan →</Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Findings</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map(scan => (
                  <tr key={scan.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{scan.name}</div>
                      <div style={{ fontSize: '0.75em', color: 'var(--text-muted)' }}>{scan.target_name}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${scan.status}`}>{scan.status}</span>
                      {scan.status === 'running' && (
                        <div style={{ marginTop: 6 }}>
                          <div className="progress-bar">
                            <div
                              className="progress-bar-fill pulse"
                              style={{ width: `${scan.total_probes ? (scan.completed_probes / scan.total_probes * 100) : 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ color: scan.findings_count > 0 ? '#ef4444' : '#22c55e', fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>
                        {scan.findings_count || 0}
                      </span>
                    </td>
                    <td>
                      <Link to={`/scans/${scan.id}`} style={{ color: 'var(--text-muted)', fontSize: '0.8em' }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* HIPAA Risk info */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Probe Coverage</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'PHI / PII Exfiltration', ref: '45 CFR §164.502', color: '#ef4444' },
              { label: 'Clinical Safety Bypass', ref: 'Patient Safety', color: '#f97316' },
              { label: 'Emergency Routing', ref: '45 CFR §164.512(j)', color: '#ef4444' },
              { label: 'Prompt Injection', ref: 'OWASP LLM01:2025', color: '#8b5cf6' },
              { label: 'Drug Misinformation', ref: 'OWASP LLM09:2025', color: '#f97316' },
              { label: 'Clinical Bias', ref: '45 CFR §80', color: '#eab308' },
              { label: 'System Prompt Leakage', ref: 'OWASP LLM07:2025', color: '#3b82f6' },
              { label: 'Billing Manipulation', ref: 'False Claims Act', color: '#ef4444' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.85em', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '0.7em', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>{item.ref}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
