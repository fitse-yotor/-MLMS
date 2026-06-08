import React, { useState } from 'react';
import { mockUsers } from '../mockData';

const roleActivityMatrix = [
  {
    module: 'Seafarer',
    roles: [
      ['Seafarer', "Create account, login, manage profile, update personal information, upload supporting documents, submit training, medical, and sea service records, apply for examinations, view schedules, take examinations, view results, apply for certificates, view/download certificates, apply for seafarer's book issuance, renewal, and replacement, track application status, receive notifications, and submit correction requests."],
    ],
  },
  {
    module: 'Vessel Owner',
    roles: [
      ['Vessel Owner', 'Create account, manage owner profile, register vessels, update vessel information, upload vessel documents, request inspections, apply for permits and licenses, request ownership transfer, request vessel services, track application status, and receive notifications.'],
    ],
  },
  {
    module: 'Logistics Operator',
    roles: [
      ['Logistics Operator', 'Create account, manage operator profile, register logistics company, upload company documents, update company information, apply for registration approval, apply for license renewal, track application status, and receive notifications.'],
    ],
  },
  {
    module: 'Administrator',
    roles: [
      ['System Administrator', "Manage users, approve or reject registrations, verify documents, manage seafarer, vessel owner, logistics operator, biometric, exam, question bank, inspection, permit, license, certificate, seafarer's book, workflow, notification, master data, report, audit log, system setting, role, and permission records."],
    ],
  },
];

export default function UserManagement() {
  const [tab, setTab] = useState('users');
  return (
    <div className="page">
      <div className="flex-between page-header">
        <div><div className="page-title">User Management</div><div className="page-subtitle">Manage users, roles, and security settings</div></div>
        <button className="btn btn-primary">+ Create User</button>
      </div>

      <div className="tabs">
        <div className={`tab${tab === 'users' ? ' active' : ''}`} onClick={() => setTab('users')}>👤 Users</div>
        <div className={`tab${tab === 'roles' ? ' active' : ''}`} onClick={() => setTab('roles')}>🎭 Roles & Permissions</div>
        <div className={`tab${tab === 'security' ? ' active' : ''}`} onClick={() => setTab('security')}>🔒 Security</div>
      </div>

      {tab === 'users' && (
        <div className="card">
          <div className="card-header"><div className="card-title">System Users ({mockUsers.length})</div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>User ID</th><th>Full Name</th><th>Username</th><th>Role</th><th>Email</th><th>MFA</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {mockUsers.map(u => (
                  <tr key={u.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{u.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{u.full_name}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{u.username}</span></td>
                    <td><span className="badge badge-purple">{u.role}</span></td>
                    <td style={{ fontSize: 12.5 }}>{u.email}</td>
                    <td><span className={`badge badge-${u.mfa ? 'green' : 'gray'}`}>{u.mfa ? 'Enabled' : 'Disabled'}</span></td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{u.last_login}</td>
                    <td><span className={`badge badge-${u.status === 'Active' ? 'green' : 'red'}`}>{u.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-xs">Edit</button>
                        <button className="btn btn-warning btn-xs">🔑 Reset</button>
                        <button className="btn btn-danger btn-xs">Lock</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'roles' && (
        <div className="card-grid">
          <div className="card">
            <div className="card-header"><div className="card-title">System Roles</div></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['System Administrator', 'Seafarer', 'Vessel Owner', 'Logistics Operator'].map(role => (
                  <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 7, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{role}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className="badge badge-green" style={{ fontSize: 10 }}>{mockUsers.filter(u => u.role === role).length} users</span>
                      <button className="btn btn-secondary btn-xs">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Medical Approval Ownership</div></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Medical Records', ['System Administrator reviews medical submissions', 'System Administrator approves medical documents', 'System Administrator rejects medical documents']],
                  ['Medical Permissions', ['Medical approval buttons appear only for System Administrator users', 'Medical review access is restricted to System Administrator users']],
                  ['Audit Trail', ['Medical review events are recorded under Admin']],
                ].map(([module, perms]) => (
                  <div key={module as string} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', background: '#f1f5f9', fontWeight: 600, fontSize: 13 }}>{module}</div>
                    {(perms as string[]).map(p => (
                      <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderTop: '1px solid #f1f5f9', fontSize: 13 }}>
                        <span>{p}</span>
                        <span style={{ color: '#16a34a' }}>OK</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header"><div className="card-title">Role Activities by Module</div></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
                {roleActivityMatrix.map(group => (
                  <div key={group.module} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                    <div style={{ padding: '12px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 13.5 }}>{group.module}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {group.roles.map(([role, activity]) => (
                        <div key={`${group.module}-${role}`} style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: role === 'System Administrator' ? '#6d28d9' : '#0f172a' }}>{role}</div>
                          <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.45, marginTop: 3 }}>{activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === 'security' && (
        <div className="card-grid">
          <div className="card">
            <div className="card-header"><div className="card-title">Security Settings</div></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Multi-Factor Authentication', enabled: true, desc: 'Require MFA for all admin users' },
                  { label: 'Session Timeout', enabled: true, desc: 'Auto-logout after 30 minutes inactivity' },
                  { label: 'IP Whitelisting', enabled: false, desc: 'Restrict access to authorized IP ranges' },
                  { label: 'Password Complexity', enabled: true, desc: 'Minimum 8 chars, mixed case, numbers required' },
                  { label: 'Login Attempt Limit', enabled: true, desc: 'Lock account after 5 failed attempts' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13.5 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{s.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`badge badge-${s.enabled ? 'green' : 'gray'}`}>{s.enabled ? 'Enabled' : 'Disabled'}</span>
                      <button className="btn btn-secondary btn-xs">Configure</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Active Sessions</div></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>User</th><th>IP</th><th>Login Time</th><th>Action</th></tr></thead>
                <tbody>
                  {[
                    { user: 'admin', ip: '192.168.1.10', time: '2024-03-20 09:15' },
                    { user: 'reg.officer1', ip: '192.168.1.45', time: '2024-03-20 08:30' },
                    { user: 'cert.officer1', ip: '192.168.1.48', time: '2024-03-20 07:55' },
                  ].map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.user}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.ip}</td>
                      <td style={{ fontSize: 12.5 }}>{s.time}</td>
                      <td><button className="btn btn-danger btn-xs">Terminate</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
