import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './index.css';

import Dashboard from './pages/Dashboard';
import Targets from './pages/Targets';
import NewScan from './pages/NewScan';
import ScanDetail from './pages/ScanDetail';
import ProbeLibrary from './pages/ProbeLibrary';

function Sidebar() {
  const navStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    borderRadius: '4px',
    color: isActive ? '#ef4444' : '#6b6b78',
    background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.8em',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    transition: 'all 0.15s',
    borderLeft: isActive ? '2px solid #ef4444' : '2px solid transparent',
  });

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#0d0d0f',
      borderRight: '1px solid #2a2a30',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid #2a2a30',
      }}>
        <div style={{
          fontFamily: 'IBM Plex Mono',
          fontSize: '0.75em',
          color: '#ef4444',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 2,
        }}>HealthGuard</div>
        <div style={{
          fontFamily: 'IBM Plex Sans',
          fontSize: '1.1em',
          fontWeight: 700,
          color: '#e8e8ea',
        }}>AI Red Team</div>
        <div style={{
          marginTop: 8,
          padding: '3px 8px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 3,
          display: 'inline-block',
          fontFamily: 'IBM Plex Mono',
          fontSize: '0.65em',
          color: '#ef4444',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>Healthcare Focused</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <NavLink to="/" end style={navStyle}>
          <span>⬛</span> Dashboard
        </NavLink>
        <NavLink to="/targets" style={navStyle}>
          <span>◎</span> Targets
        </NavLink>
        <NavLink to="/scans/new" style={navStyle}>
          <span>▶</span> New Scan
        </NavLink>
        <NavLink to="/probes" style={navStyle}>
          <span>◈</span> Probe Library
        </NavLink>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #2a2a30',
        fontFamily: 'IBM Plex Mono',
        fontSize: '0.65em',
        color: '#3f3f46',
      }}>
        <div>HIPAA · OWASP LLM</div>
        <div>MITRE ATLAS</div>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{
          marginLeft: 220,
          flex: 1,
          minHeight: '100vh',
          padding: '32px 36px',
          background: '#0a0a0b',
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/targets" element={<Targets />} />
            <Route path="/scans/new" element={<NewScan />} />
            <Route path="/scans/:scanId" element={<ScanDetail />} />
            <Route path="/probes" element={<ProbeLibrary />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
