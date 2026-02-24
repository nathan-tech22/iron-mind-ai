import React, { useEffect, useState } from 'react';
import { probes as probesApi } from '../utils/api';

const CATEGORY_ICONS = {
  phi_exfiltration: '🔒',
  clinical_advice_bypass: '⚕️',
  roleplay_escalation: '🎭',
  emergency_routing_failure: '🚨',
  drug_misinformation: '💊',
  consent_bypass: '📋',
  insurance_manipulation: '💳',
  prompt_injection: '💉',
  data_extraction: '📤',
  bias_clinical: '⚖️',
};

export default function ProbeLibrary() {
  const [probes, setProbes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    probesApi.categories().then(r => setCategories(r.data));
    probesApi.list().then(r => setProbes(r.data));
  }, []);

  const filtered = activeCategory ? probes.filter(p => p.category === activeCategory) : probes;

  return (
    <div>
      <div className="page-title">Healthcare Probe Library</div>
      <div className="page-subtitle">{probes.length} probes across {categories.length} categories — all mapped to HIPAA, OWASP LLM Top 10, and MITRE ATLAS</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          className={`btn ${!activeCategory ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveCategory(null)}
        >
          All ({probes.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`btn ${activeCategory === cat.id ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
          >
            {CATEGORY_ICONS[cat.id]} {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(probe => (
          <div key={probe.id} className="card" style={{
            borderColor: probe.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'var(--border)',
          }}>
            <div
              onClick={() => setExpanded(e => ({ ...e, [probe.id]: !e[probe.id] }))}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.3em' }}>{CATEGORY_ICONS[probe.category]}</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{probe.name}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)' }}>
                    {probe.id} · {probe.category}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge badge-${probe.severity}`}>{probe.severity}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8em' }}>{expanded[probe.id] ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded[probe.id] && (
              <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Probe Prompt</div>
                  <div style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '10px 12px',
                    fontFamily: 'IBM Plex Mono',
                    fontSize: '0.8em',
                    color: '#f97316',
                    whiteSpace: 'pre-wrap',
                  }}>{probe.prompt}</div>
                </div>

                <div className="grid-2" style={{ gap: 16, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: '#ef4444', marginBottom: 6, textTransform: 'uppercase' }}>Vulnerability Indicators</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {probe.success_indicators?.map(i => (
                        <span key={i} style={{
                          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.2)',
                          padding: '2px 8px', borderRadius: 3,
                          fontFamily: 'IBM Plex Mono', fontSize: '0.75em',
                        }}>{i}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: '#22c55e', marginBottom: 6, textTransform: 'uppercase' }}>Safe Response Indicators</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {probe.fail_safe_indicators?.map(i => (
                        <span key={i} style={{
                          background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                          border: '1px solid rgba(34,197,94,0.2)',
                          padding: '2px 8px', borderRadius: 3,
                          fontFamily: 'IBM Plex Mono', fontSize: '0.75em',
                        }}>{i}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
                  {probe.hipaa_reference && (
                    <div style={{ fontSize: '0.75em' }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>HIPAA: </span>
                      <span style={{ color: '#fbbf24' }}>{probe.hipaa_reference}</span>
                    </div>
                  )}
                  {probe.owasp_ref && (
                    <div style={{ fontSize: '0.75em' }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>OWASP: </span>
                      <span style={{ color: '#60a5fa' }}>{probe.owasp_ref}</span>
                    </div>
                  )}
                  {probe.mitre_atlas_ref && (
                    <div style={{ fontSize: '0.75em' }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>MITRE: </span>
                      <span style={{ color: '#a78bfa' }}>{probe.mitre_atlas_ref}</span>
                    </div>
                  )}
                </div>

                {probe.remediation && (
                  <div>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Remediation</div>
                    <div style={{
                      background: 'rgba(34,197,94,0.05)',
                      border: '1px solid rgba(34,197,94,0.15)',
                      borderRadius: 4,
                      padding: '10px 12px',
                      fontSize: '0.85em',
                      color: '#86efac',
                    }}>{probe.remediation}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
