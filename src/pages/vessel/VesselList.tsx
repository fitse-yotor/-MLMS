import React, { useState } from 'react';
import { mockVessels } from '../../mockData';

export default function VesselList({ currentUser }: { currentUser?: any }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState('overview');
  const visibleVessels = currentUser?.role === 'Vessel Owner'
    ? mockVessels.filter(v => v.owner_id === currentUser.id)
    : mockVessels;
  const canRegisterVessel = currentUser?.role === 'Vessel Owner' || currentUser?.role === 'System Administrator';
  const sel = visibleVessels.find(v => v.id === selected);

  if (sel) {
    return (
      <div className="page">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>← Back</button>
        </div>
        <div className="profile-card">
          <div className="profile-avatar" style={{ background: '#0f766e', borderRadius: 12 }}>🚢</div>
          <div className="profile-info">
            <div className="profile-name">{sel.name}</div>
            <div className="profile-id">{sel.reg_no} · Registered Owner: {sel.owner}</div>
            <div className="profile-meta">
              <div className="profile-meta-item"><strong>Type:</strong> {sel.type}</div>
              <div className="profile-meta-item"><strong>Category:</strong> {sel.category}</div>
              <div className="profile-meta-item"><strong>Flag:</strong> {sel.flag}</div>
              <div className="profile-meta-item"><strong>Year Built:</strong> {sel.year}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <span className={`badge badge-${sel.reg_status === 'Active' ? 'green' : 'red'}`}>{sel.reg_status}</span>
            <span className={`badge badge-${sel.license_status === 'Valid' ? 'green' : sel.license_status === 'Expiring Soon' ? 'yellow' : 'red'}`}>{sel.license_status}</span>
          </div>
        </div>
        <div className="tabs">
          <div className={`tab${tab === 'overview' ? ' active' : ''}`} onClick={() => setTab('overview')}>📋 Overview</div>
          <div className={`tab${tab === 'inspections' ? ' active' : ''}`} onClick={() => setTab('inspections')}>🔍 Inspections</div>
          <div className={`tab${tab === 'permits' ? ' active' : ''}`} onClick={() => setTab('permits')}>📄 Permits</div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Vessel Technical Information</div></div>
          <div className="card-body">
            <div className="info-grid">
              {[['Vessel Name', sel.name], ['Registration No.', sel.reg_no], ['Vessel Type', sel.type], ['Flag State', sel.flag], ['Year Built', sel.year], ['Builder', sel.builder], ['Length', `${sel.length} m`], ['Gross Tonnage', `${sel.tonnage} GT`], ['Engine Type', sel.engine], ['Passenger Capacity', sel.capacity], ['Owner', sel.owner], ['Inspection', sel.inspection]].map(([k, v]) => (
                <div className="info-item" key={String(k)}><label>{k}</label><div className="info-value">{String(v)}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex-between page-header">
        <div><div className="page-title">Vessel Registry</div><div className="page-subtitle">Official registry of all registered vessels</div></div>
        {canRegisterVessel && <button className="btn btn-primary">+ Register Vessel</button>}
      </div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Vessels', value: visibleVessels.length, color: 'blue' },
          { label: 'Active', value: visibleVessels.filter(v => v.reg_status === 'Active').length, color: 'green' },
          { label: 'Pending Inspection', value: visibleVessels.filter(v => v.inspection === 'Pending').length, color: 'yellow' },
          { label: 'Suspended', value: visibleVessels.filter(v => v.reg_status === 'Suspended').length, color: 'red' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>🚢</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Vessel Registry</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Reg. No.</th><th>Vessel Name</th><th>Type</th><th>Owner</th><th>Year</th><th>Tonnage</th><th>Capacity</th><th>Reg. Status</th><th>License</th><th>Inspection</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleVessels.map(v => (
                <tr key={v.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.reg_no}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{v.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{v.flag} · {v.category}</div></td>
                  <td>{v.type}</td>
                  <td style={{ fontSize: 13 }}>{v.owner}</td>
                  <td>{v.year}</td>
                  <td>{v.tonnage} GT</td>
                  <td>{v.capacity}</td>
                  <td><span className={`badge badge-${v.reg_status === 'Active' ? 'green' : 'red'}`}>{v.reg_status}</span></td>
                  <td><span className={`badge badge-${v.license_status === 'Valid' ? 'green' : v.license_status === 'Expiring Soon' ? 'yellow' : 'red'}`}>{v.license_status}</span></td>
                  <td><span className={`badge badge-${v.inspection === 'Passed' ? 'green' : v.inspection === 'Pending' ? 'yellow' : 'red'}`}>{v.inspection}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => setSelected(v.id)}>View</button>
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
