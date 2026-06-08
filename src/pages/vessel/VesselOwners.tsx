import React from 'react';
import { mockVesselOwners } from '../../mockData';

export default function VesselOwners({ currentUser }: { currentUser?: any }) {
  const visibleOwners = currentUser?.role === 'Vessel Owner'
    ? mockVesselOwners.filter(o => o.id === currentUser.id)
    : mockVesselOwners;
  const canManageOwners = currentUser?.role === 'System Administrator';
  return (
    <div className="page">
      <div className="flex-between page-header">
        <div><div className="page-title">Vessel Owner Management</div><div className="page-subtitle">Manage vessel owner registrations</div></div>
        {canManageOwners && <button className="btn btn-primary">+ Register Owner</button>}
      </div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="stat-card"><div className="stat-icon blue">🏢</div><div><div className="stat-value">{visibleOwners.length}</div><div className="stat-label">Total Owners</div></div></div>
        <div className="stat-card"><div className="stat-icon green">✓</div><div><div className="stat-value">{visibleOwners.filter(o => o.status === 'Active').length}</div><div className="stat-label">Active</div></div></div>
        <div className="stat-card"><div className="stat-icon teal">🚢</div><div><div className="stat-value">{visibleOwners.reduce((s, o) => s + o.vessels, 0)}</div><div className="stat-label">Total Vessels Owned</div></div></div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Owner Registry</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Owner ID</th><th>Name</th><th>Type</th><th>Reg. No.</th><th>TIN</th><th>Mobile</th><th>Region</th><th>Vessels</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleOwners.map(o => (
                <tr key={o.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.id}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{o.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{o.email}</div></td>
                  <td><span className="badge badge-blue">{o.type}</span></td>
                  <td style={{ fontSize: 12 }}>{o.reg_no}</td>
                  <td style={{ fontSize: 12 }}>{o.tin}</td>
                  <td style={{ fontSize: 12.5 }}>{o.mobile}</td>
                  <td>{o.region}</td>
                  <td><strong>{o.vessels}</strong></td>
                  <td><span className={`badge badge-${o.status === 'Active' ? 'green' : 'red'}`}>{o.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-xs">View</button>
                      {canManageOwners && <button className="btn btn-secondary btn-xs">Edit</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
