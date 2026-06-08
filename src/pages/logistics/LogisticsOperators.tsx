import React, { useState } from 'react';
import { mockLogisticsOperators } from '../../mockData';

export default function LogisticsOperators({ currentUser }: { currentUser?: any }) {
  const [tab, setTab] = useState('registry');
  const [filter, setFilter] = useState('');
  const canSubmitRegistration = currentUser?.role === 'Logistics Operator' || currentUser?.role === 'System Administrator';
  const canManageOperators = currentUser?.role === 'System Administrator';
  const visibleOperators = currentUser?.role === 'Logistics Operator'
    ? mockLogisticsOperators.filter(o => o.id === currentUser.id)
    : mockLogisticsOperators;
  const filtered = visibleOperators.filter(o =>
    o.name.toLowerCase().includes(filter.toLowerCase()) || o.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="page">
      <div className="flex-between page-header">
        <div><div className="page-title">Logistics Operator Management</div><div className="page-subtitle">Register and manage logistics operators</div></div>
        {canSubmitRegistration && <button className="btn btn-primary" onClick={() => setTab('register')}>+ New Registration</button>}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Operators', value: visibleOperators.length, color: 'blue' },
          { label: 'Active', value: visibleOperators.filter(o => o.status === 'Active').length, color: 'green' },
          { label: 'Expiring Soon', value: visibleOperators.filter(o => o.status === 'Expiring Soon').length, color: 'yellow' },
          { label: 'Expired', value: visibleOperators.filter(o => o.status === 'Expired').length, color: 'red' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>🚛</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="tabs">
        <div className={`tab${tab === 'registry' ? ' active' : ''}`} onClick={() => setTab('registry')}>📋 Operator Registry</div>
        {canManageOperators && <div className={`tab${tab === 'renewal' ? ' active' : ''}`} onClick={() => setTab('renewal')}>Renewal Applications</div>}
        {canSubmitRegistration && <div className={`tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>New Registration Form</div>}
      </div>

      {tab === 'registry' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Operator Registry ({filtered.length})</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Search operator..." value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 220, padding: '6px 12px' }} />
              <button className="btn btn-secondary btn-sm">⬇ Export</button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Operator ID</th><th>Name</th><th>Type</th><th>Region</th><th>Contact</th><th>License No.</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.id}</span></td>
                    <td><div style={{ fontWeight: 500 }}>{o.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{o.email}</div></td>
                    <td><span className="badge badge-blue">{o.type}</span></td>
                    <td>{o.region} / {o.city}</td>
                    <td style={{ fontSize: 12.5 }}>{o.mobile}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.license_no}</span></td>
                    <td>{o.license_expiry}</td>
                    <td><span className={`badge badge-${o.status === 'Active' ? 'green' : o.status === 'Expiring Soon' ? 'yellow' : 'red'}`}>{o.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-xs">View</button>
                        {canManageOperators && <button className="btn btn-secondary btn-xs">Edit</button>}
                        {canManageOperators && <button className="btn btn-danger btn-xs">Suspend</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'renewal' && (
        <div className="card">
          <div className="card-header"><div className="card-title">Renewal Applications</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { id: 'REN-2024-001', operator: 'Horn of Africa Customs Clearing', current_expiry: '2024-08-20', period: '1 Year', status: 'Pending', date: '2024-05-10' },
              ].map(r => (
                <div key={r.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.operator}</div>
                      <div style={{ fontSize: 12.5, color: '#64748b' }}>{r.id} · Current Expiry: {r.current_expiry} · Period: {r.period}</div>
                    </div>
                    <span className="badge badge-yellow">{r.status}</span>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    {canManageOperators && <button className="btn btn-success btn-sm">Approve Renewal</button>}
                    {canManageOperators && <button className="btn btn-danger btn-sm">Reject</button>}
                    <button className="btn btn-secondary btn-sm">View Documents</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'register' && (
        <div className="card">
          <div className="card-header"><div className="card-title">New Operator Registration</div></div>
          <div className="card-body">
            <div className="form-section">
              <div className="form-section-title">Operator Basic Information</div>
              <div className="form-grid">
                <div className="form-group"><label>Operator Name *</label><input placeholder="Legal business name" /></div>
                <div className="form-group"><label>Operator Type *</label>
                  <select>
                    <option>Freight Forwarder</option>
                    <option>Shipping Agent</option>
                    <option>Customs Clearing Agent</option>
                    <option>Cargo Transport Operator</option>
                    <option>Warehouse Operator</option>
                  </select>
                </div>
                <div className="form-group"><label>Business License Number *</label><input placeholder="BL-XXXX-XXXXX" /></div>
                <div className="form-group"><label>Tax Identification Number (TIN)</label><input placeholder="TIN-XXXXXXXXX" /></div>
                <div className="form-group"><label>Ownership Type</label><select><option>PLC</option><option>Sole Proprietor</option><option>Partnership</option><option>Cooperative</option><option>Government</option></select></div>
                <div className="form-group"><label>Year Established</label><input type="number" placeholder="YYYY" /></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Contact Information</div>
              <div className="form-grid">
                <div className="form-group"><label>Office Phone</label><input placeholder="+251 11X XXX XXX" /></div>
                <div className="form-group"><label>Mobile *</label><input placeholder="+251 9XX XXX XXX" /></div>
                <div className="form-group"><label>Email Address *</label><input placeholder="info@company.et" /></div>
                <div className="form-group"><label>Website</label><input placeholder="www.company.et" /></div>
                <div className="form-group"><label>Region *</label><select><option>Addis Ababa</option><option>Oromia</option><option>Amhara</option><option>Dire Dawa</option></select></div>
                <div className="form-group"><label>City *</label><input placeholder="City" /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary">Submit Registration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
