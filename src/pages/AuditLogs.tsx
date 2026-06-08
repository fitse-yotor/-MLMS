import React, { useState } from 'react';
import { mockAuditLogs } from '../mockData';

export default function AuditLogs() {
  const [filter, setFilter] = useState('');
  const filtered = mockAuditLogs.filter(a =>
    a.user.toLowerCase().includes(filter.toLowerCase()) || a.module.toLowerCase().includes(filter.toLowerCase()) || a.action.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Audit Logs</div>
        <div className="page-subtitle">Track all user activities and system transactions</div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Activity Log ({filtered.length})</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Search logs..." value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 220, padding: '6px 12px' }} />
            <select style={{ width: 'auto', padding: '6px 12px' }}>
              <option value="">All Modules</option>
              <option>Seafarer</option>
              <option>Certification</option>
              <option>Medical</option>
              <option>Vessel</option>
              <option>User Management</option>
            </select>
            <button className="btn btn-secondary btn-sm">⬇ Export</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Audit ID</th><th>User</th><th>Module</th><th>Action</th><th>Record</th><th>IP Address</th><th>Timestamp</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{a.id}</span></td>
                  <td style={{ fontSize: 13 }}>{a.user}</td>
                  <td><span className="badge badge-blue">{a.module}</span></td>
                  <td style={{ fontWeight: 500 }}>{a.action}</td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{a.record}</span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{a.ip}</td>
                  <td style={{ fontSize: 12.5, color: '#64748b' }}>{a.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
