import React, { useEffect, useState } from 'react';
import { targets as targetsApi } from '../utils/api';

const TEMPLATES = {
  openai: {
    name: 'OpenAI Compatible',
    endpoint_url: 'https://api.openai.com/v1/chat/completions',
    auth_type: 'bearer',
    model_name: 'gpt-4o',
    response_path: '$.choices[0].message.content',
  },
  azure: {
    name: 'Azure OpenAI',
    endpoint_url: 'https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2024-02-01',
    auth_type: 'api_key',
    auth_header: 'api-key',
    response_path: '$.choices[0].message.content',
  },
  custom: {
    name: 'Custom REST API',
    endpoint_url: 'https://your-chatbot.example.com/api/chat',
    auth_type: 'bearer',
    response_path: '$.response',
  },
};

export default function Targets() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', endpoint_url: '', auth_type: 'bearer',
    auth_header: 'Authorization', auth_value: '', model_name: '',
    vendor: '', response_path: '$.choices[0].message.content',
  });
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => targetsApi.list().then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  const applyTemplate = (key) => {
    const t = TEMPLATES[key];
    setForm(f => ({ ...f, ...t }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await targetsApi.create(form);
      setShowForm(false);
      setForm({ name: '', description: '', endpoint_url: '', auth_type: 'bearer', auth_header: 'Authorization', auth_value: '', model_name: '', vendor: '', response_path: '$.choices[0].message.content' });
      load();
    } catch (err) {
      alert('Error creating target: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (id) => {
    setTesting(id);
    setTestResult(null);
    try {
      const r = await targetsApi.test(id);
      setTestResult({ id, ...r.data });
    } catch (err) {
      setTestResult({ id, success: false, message: err.response?.data?.detail || err.message });
    } finally {
      setTesting(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this target?')) return;
    await targetsApi.delete(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div className="page-title">Target Chatbots</div>
          <div className="page-subtitle">Configure AI chatbot endpoints to red team</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Target'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>New Target Configuration</div>

          {/* Quick templates */}
          <div style={{ marginBottom: 20 }}>
            <label>Quick Templates</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <button key={key} className="btn btn-ghost" onClick={() => applyTemplate(key)}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Target Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Patient Portal Chatbot" />
              </div>
              <div className="form-group">
                <label>Vendor / Model</label>
                <input className="input" value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} placeholder="e.g. Azure OpenAI / GPT-4o" />
              </div>
            </div>

            <div className="form-group">
              <label>Endpoint URL *</label>
              <input className="input" required value={form.endpoint_url} onChange={e => setForm(f => ({ ...f, endpoint_url: e.target.value }))} placeholder="https://..." />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Auth Type</label>
                <select className="select" value={form.auth_type} onChange={e => setForm(f => ({ ...f, auth_type: e.target.value }))}>
                  <option value="bearer">Bearer Token</option>
                  <option value="api_key">API Key Header</option>
                  <option value="none">None</option>
                </select>
              </div>
              {form.auth_type === 'api_key' && (
                <div className="form-group">
                  <label>Auth Header Name</label>
                  <input className="input" value={form.auth_header} onChange={e => setForm(f => ({ ...f, auth_header: e.target.value }))} placeholder="api-key" />
                </div>
              )}
            </div>

            {form.auth_type !== 'none' && (
              <div className="form-group">
                <label>API Key / Token</label>
                <input className="input" type="password" value={form.auth_value} onChange={e => setForm(f => ({ ...f, auth_value: e.target.value }))} placeholder="sk-..." />
              </div>
            )}

            <div className="grid-2">
              <div className="form-group">
                <label>Model Name</label>
                <input className="input" value={form.model_name} onChange={e => setForm(f => ({ ...f, model_name: e.target.value }))} placeholder="gpt-4o" />
              </div>
              <div className="form-group">
                <label>Response JSONPath</label>
                <input className="input" value={form.response_path} onChange={e => setForm(f => ({ ...f, response_path: e.target.value }))} placeholder="$.choices[0].message.content" />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Patient-facing chatbot on the portal..." />
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Target'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '2em', marginBottom: 12 }}>◎</div>
          <div style={{ color: 'var(--text-muted)' }}>No targets configured yet.</div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-dim)', marginTop: 8 }}>Add a target chatbot endpoint above to get started.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(target => (
            <div key={target.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{target.name}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.75em', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {target.endpoint_url}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {target.vendor && <span className="badge badge-info">{target.vendor}</span>}
                    {target.model_name && <span className="badge badge-info">{target.model_name}</span>}
                    <span className="badge badge-info">auth: {target.auth_type}</span>
                  </div>
                  {testResult?.id === target.id && (
                    <div style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      background: testResult.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${testResult.success ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      borderRadius: 4,
                      fontSize: '0.8em',
                      fontFamily: 'IBM Plex Mono',
                      color: testResult.success ? '#22c55e' : '#ef4444',
                    }}>
                      {testResult.success ? '✓ ' : '✗ '}{testResult.message}
                      {testResult.response_preview && (
                        <div style={{ color: 'var(--text-muted)', marginTop: 4, wordBreak: 'break-all' }}>
                          Response: "{testResult.response_preview}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                  <button className="btn btn-secondary" onClick={() => handleTest(target.id)} disabled={testing === target.id}>
                    {testing === target.id ? 'Testing...' : 'Test'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => handleDelete(target.id)} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
