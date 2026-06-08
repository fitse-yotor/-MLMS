import React from 'react';
import { mockPermits, mockVessels } from '../../mockData';

export default function VesselPermits({ currentUser }: { currentUser?: any }) {
  const ownerVesselIds = currentUser?.role === 'Vessel Owner'
    ? mockVessels.filter(v => v.owner_id === currentUser.id).map(v => v.id)
    : null;
  const visiblePermits = ownerVesselIds
    ? mockPermits.filter(p => ownerVesselIds.includes(p.vessel_id))
    : mockPermits;
  const canManagePermits = currentUser?.role === 'System Administrator';
  const canRequestVesselService = ['Vessel Owner', 'System Administrator'].includes(currentUser?.role);
  const canApproveTransfer = currentUser?.role === 'System Administrator';

  return (
    <div className="page">
      <div className="flex-between page-header">
        <div><div className="page-title">Permits & Licenses</div><div className="page-subtitle">Manage vessel permits and operating licenses</div></div>
        {canManagePermits && <button className="btn btn-primary">+ Issue Permit</button>}
      </div>

      <div className="workflow" style={{ marginBottom: 20 }}>
        {['Permit Application', 'Review Requirements', 'Approve / Reject', 'Generate Permit', 'Issue License'].map((s, i, arr) => (
          <React.Fragment key={s}>
            <div className={`workflow-step ${i === 2 ? 'active' : i < 2 ? 'done' : ''}`}>{s}</div>
            {i < arr.length - 1 && <span className="workflow-arrow">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header"><div className="card-title">Permits ({visiblePermits.length})</div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Permit No.</th><th>Vessel</th><th>Type</th><th>Issue Date</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {visiblePermits.map(p => (
                  <tr key={p.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.permit_no}</span></td>
                    <td style={{ fontWeight: 500 }}>{p.vessel}</td>
                    <td>{p.type}</td>
                    <td>{p.issue}</td>
                    <td>{p.expiry}</td>
                    <td><span className={`badge badge-${p.status === 'Active' ? 'green' : p.status === 'Expiring Soon' ? 'yellow' : 'red'}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-xs">View</button>
                        {canManagePermits && <button className="btn btn-warning btn-xs">Renew</button>}
                        {canManagePermits && <button className="btn btn-danger btn-xs">Revoke</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Ownership Transfer Requests</div>{canRequestVesselService && <button className="btn btn-primary btn-sm">+ New Transfer</button>}</div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ id: 'OT-2024-001', vessel: 'MV Nile Ferry', from: 'Nile Transport Co.', to: 'New Horizon Shipping', date: '2024-03-20', status: 'Pending' }].map(t => (
                <div key={t.id} style={{ padding: '14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600 }}>{t.vessel}</div>
                    <span className="badge badge-yellow">{t.status}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748b', margin: '6px 0' }}>{t.id} · {t.date}</div>
                  <div style={{ fontSize: 13 }}>From: <strong>{t.from}</strong> → To: <strong>{t.to}</strong></div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    {canApproveTransfer && <button className="btn btn-success btn-sm">Approve</button>}
                    {canApproveTransfer && <button className="btn btn-danger btn-sm">Reject</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Service Requests</div>{canRequestVesselService && <button className="btn btn-primary btn-sm">+ New Request</button>}</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Request ID</th><th>Vessel</th><th>Service Type</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {[
                { id: 'SR-2024-001', vessel: 'MV Tana Star', type: 'Registration Amendment', date: '2024-03-01', status: 'Completed' },
                { id: 'SR-2024-002', vessel: 'MV Awash Cargo', type: 'Duplicate Registration Certificate', date: '2024-03-15', status: 'Pending' },
                { id: 'SR-2024-003', vessel: 'MV Nile Ferry', type: 'License Renewal', date: '2024-04-01', status: 'Under Review' },
              ].map(r => (
                <tr key={r.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{r.vessel}</td>
                  <td>{r.type}</td>
                  <td>{r.date}</td>
                  <td><span className={`badge badge-${r.status === 'Completed' ? 'green' : r.status === 'Pending' ? 'yellow' : 'blue'}`}>{r.status}</span></td>
                  <td><button className="btn btn-secondary btn-xs">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
