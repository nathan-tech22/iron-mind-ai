import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { targets as targetsApi, probes as probesApi, scans as scansApi } from '../utils/api';

export default function NewScan() {
  const navigate = useNavigate();
  const [targets, setTargets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    target_id: '',
    name: '',
    probe_categories: [],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    targetsApi.list().then(r => setTargets(r.data));
    probesApi.categories().then(r => setCategories(r.data));
  }, []);

  const toggleCategory = (id) => {
    setForm(f => ({
      ...f,
      probe_categories: f.probe_categories.includes(id)
        ? f.probe_categories.filter(c => c !== id)
        : [...f.probe_categories, id]
    }));
  };

  const selectAll = () => setForm(f => ({ ...f, probe_categories: categories.map(c => c.id) }));
  const selectNone = () => setForm(f => ({ ...f, probe_categories: [] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.target_id) { alert('Please select a target'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        probe_categories: form.probe_categories.length > 0 ? form.probe_categories : null,
      };
      const r = await scansApi.create(payload);
      navigate(`/scans/${r.data.id}`);
    } catch (err) {
      alert('Error starting scan: ' + (err.response?.data?.detail || err.message));
      setSubmitting(false);
    }
  };

  const selectedProbeCount = form.probe_categories.length === 0
    ? categories.reduce((a, c) => a + c.count, 0)
    : categories.filter(c => form.probe_categories.includes(c.id)).reduce((a, c) => a + c.count, 0);

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

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-title">Launch New Scan</div>
      <div className="page-subtitle">Configure and execute a red team assessment against a target AI chatbot</div>

      <form onSubmit={handleSubmit}>
        {/* Target */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>1. Select Target</div>

          {targets.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>
              No targets configured. <a href="/targets">Add a target first →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {targets.map(t => (
                <div
                  key={t.id}
                  onClick={() => setForm(f => ({ ...f, target_id: t.id }))}
                  style={{
                    padding: '12px 16px',
                    border: `1px solid ${form.target_id === t.id ? '#ef4444' : 'var(--border)'}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: form.target_id === t.id ? 'rgba(239,68,68,0.05)' : 'var(--bg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7em', color: 'var(--text-muted)' }}>{t.endpoint_url}</div>
                  </div>
                  {form.target_id === t.id && (
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scan name */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>2. Scan Name</div>
          <div className="form-group">
            <label>Scan Name *</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder={`Red Team Assessment ${new Date().toLocaleDateString()}`}
            />
          </div>
        </div>

        {/* Probe selection */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600 }}>3. Select Probe Categories</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={selectAll}>All</button>
              <button type="button" className="btn btn-ghost" onClick={selectNone}>None</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {categories.map(cat => {
              const selected = form.probe_categories.length === 0 || form.probe_categories.includes(cat.id);
              const checked = form.probe_categories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  style={{
                    padding: '12px',
                    border: `1px solid ${checked ? '#ef4444' : 'var(--border)'}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: checked ? 'rgba(239,68,68,0.05)' : 'var(--bg)',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{CATEGORY_ICONS[cat.id] || '◈'}</span>
                      <span style={{ fontSize: '0.85em', fontWeight: 500 }}>{cat.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-info">{cat.count} probes</span>
                      {checked && <span style={{ color: '#ef4444' }}>✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 16,
            padding: '10px 14px',
            background: 'var(--surface2)',
            borderRadius: 4,
            fontFamily: 'IBM Plex Mono',
            fontSize: '0.8em',
            color: 'var(--text-muted)',
          }}>
            {selectedProbeCount} probes will be executed in this scan.
            {form.probe_categories.length === 0 && ' (All categories selected)'}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !form.target_id || !form.name}
          style={{ fontSize: '0.9em', padding: '12px 28px' }}
        >
          {submitting ? '▶ Launching...' : `▶ Launch Scan (${selectedProbeCount} probes)`}
        </button>
      </form>
    </div>
  );
}
