import React, { useState } from 'react';
import { mockAppUsers, AppUser } from '../mockUsers';

interface LoginProps {
  onLogin: (user: AppUser) => void;
}

const roleColors: Record<string, string> = {
  'Seafarer': '#0f766e',
  'Vessel Owner': '#b45309',
  'Logistics Operator': '#0f766e',
  'System Administrator': '#1e293b',
};

const quickUsers = [
  { username: 'abebe.girma', label: 'Seafarer', sub: 'Abebe Girma' },
  { username: 'vessel.owner', label: 'Vessel Owner', sub: 'Lake Tana Transport' },
  { username: 'logistics.operator', label: 'Logistics Operator', sub: 'Ethiopian Freight' },
  { username: 'admin', label: 'System Admin', sub: 'System Administrator' },
];

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const user = mockAppUsers.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 600);
  }

  function quickLogin(uname: string) {
    const user = mockAppUsers.find(u => u.username === uname);
    if (user) onLogin(user);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 960, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

        {/* Left: branding + quick login */}
        <div style={{ color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: '#1e40af', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, border: '2px solid #3b82f6' }}>M</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>MLMS</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Maritime & Logistics Management System</div>
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>Welcome to the<br />Maritime Authority Portal</div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>Select a demo user to explore role-specific features</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {quickUsers.map(u => {
              const full = mockAppUsers.find(x => x.username === u.username)!;
              const color = roleColors[full.role] || '#1e40af';
              return (
                <div key={u.username} onClick={() => quickLogin(u.username)}
                  style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{full.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{u.sub}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{u.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Demo Credentials</div>
            <div style={{ fontSize: 12, color: '#cbd5e1' }}>Vessel Owner: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>owner123</code></div>
            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>Logistics Operator: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>operator123</code></div>
            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>Seafarer: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>seafarer123</code></div>
            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>Admin: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>admin123</code></div>
          </div>
        </div>

        {/* Right: login form */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 36, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Sign In</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Enter your credentials to access the portal</div>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#991b1b', fontSize: 13, marginBottom: 16 }}>
                ⚠ {error}
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#374151', marginBottom: 5 }}>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#374151', marginBottom: 5 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: loading ? '#93c5fd' : '#1e40af', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#374151', marginBottom: 8 }}>All Demo Users</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {mockAppUsers.map(u => (
                <div key={u.id} onClick={() => { setUsername(u.username); setPassword(u.password); }}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderRadius: 5, cursor: 'pointer', fontSize: 12 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#eff6ff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontWeight: 500 }}>{u.full_name}</span>
                  <span style={{ color: '#64748b' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
