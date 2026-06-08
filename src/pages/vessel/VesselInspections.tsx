import React, { useState } from 'react';
import { mockInspections, mockVessels } from '../../mockData';

export default function VesselInspections({ currentUser }: { currentUser?: any }) {
  const [selected, setSelected] = useState<string | null>(null);
  const ownerVesselIds = currentUser?.role === 'Vessel Owner'
    ? mockVessels.filter(v => v.owner_id === currentUser.id).map(v => v.id)
    : null;
  const visibleInspections = ownerVesselIds
    ? mockInspections.filter(i => ownerVesselIds.includes(i.vessel_id))
    : mockInspections;
  const sel = visibleInspections.find(i => i.id === selected);
  const canRequestInspection = ['Vessel Owner', 'System Administrator'].includes(currentUser?.role);
  const canApproveInspection = currentUser?.role === 'System Administrator';

  return (
    <div className="page">
      <div className="flex-between page-header">
        <div><div className="page-title">Vessel Inspections</div><div className="page-subtitle">Manage vessel inspection records and findings</div></div>
        {canRequestInspection && <button className="btn btn-primary">+ Schedule Inspection</button>}
      </div>

      <div className="workflow" style={{ marginBottom: 20 }}>
        {['Inspection Request', 'Assign Inspector', 'Conduct Inspection', 'Record Findings', 'Approve / Reject'].map((s, i, arr) => (
          <React.Fragment key={s}>
            <div className={`workflow-step ${i === 2 ? 'active' : i < 2 ? 'done' : ''}`}>{s}</div>
            {i < arr.length - 1 && <span className="workflow-arrow">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Inspections', value: visibleInspections.length, color: 'blue' },
          { label: 'Passed', value: visibleInspections.filter(i => i.result === 'Passed').length, color: 'green' },
          { label: 'Pending', value: visibleInspections.filter(i => i.result === 'Pending').length, color: 'yellow' },
          { label: 'Failed', value: visibleInspections.filter(i => i.result === 'Failed').length, color: 'red' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>🔍</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      {!selected ? (
        <div className="card">
          <div className="card-header"><div className="card-title">Inspection Records</div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Inspection ID</th><th>Vessel</th><th>Type</th><th>Date</th><th>Location</th><th>Inspector</th><th>Hull</th><th>Engine</th><th>Safety</th><th>Result</th><th>Actions</th></tr></thead>
              <tbody>
                {visibleInspections.map(ins => (
                  <tr key={ins.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{ins.id}</span></td>
                    <td><div style={{ fontWeight: 500 }}>{ins.vessel}</div></td>
                    <td>{ins.type}</td>
                    <td>{ins.date}</td>
                    <td>{ins.location}</td>
                    <td>{ins.inspector}</td>
                    <td><span className={`badge badge-${ins.hull === 'Good' ? 'green' : ins.hull === 'Fair' ? 'yellow' : 'red'}`}>{ins.hull}</span></td>
                    <td><span className={`badge badge-${ins.engine === 'Good' ? 'green' : ins.engine === 'Fair' ? 'yellow' : 'red'}`}>{ins.engine}</span></td>
                    <td><span className={`badge badge-${ins.safety === 'Good' ? 'green' : ins.safety === 'Fair' ? 'yellow' : 'red'}`}>{ins.safety}</span></td>
                    <td><span className={`badge badge-${ins.result === 'Passed' ? 'green' : ins.result === 'Pending' ? 'yellow' : ins.result.includes('Conditions') ? 'orange' : 'red'}`}>{ins.result}</span></td>
                    <td><button className="btn btn-secondary btn-xs" onClick={() => setSelected(ins.id)}>View Report</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : sel && (
        <div>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>← Back</button>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Inspection Report — {sel.vessel}</div>
              <span className={`badge badge-${sel.result === 'Passed' ? 'green' : sel.result === 'Pending' ? 'yellow' : 'red'}`}>{sel.result}</span>
            </div>
            <div className="card-body">
              <div className="card-grid">
                <div>
                  <div className="form-section-title">Inspection Details</div>
                  <div className="info-grid">
                    {[['ID', sel.id], ['Type', sel.type], ['Date', sel.date], ['Location', sel.location], ['Inspector', sel.inspector], ['Status', sel.status]].map(([k, v]) => (
                      <div className="info-item" key={k}><label>{k}</label><div className="info-value">{v}</div></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="form-section-title">Condition Assessment</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[['Hull Condition', sel.hull], ['Engine Condition', sel.engine], ['Safety Equipment', sel.safety], ['Navigation Equipment', sel.nav]].map(([label, val]) => (
                      <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 6 }}>
                        <span style={{ fontSize: 13.5 }}>{label}</span>
                        <span className={`badge badge-${val === 'Good' ? 'green' : val === 'Fair' ? 'yellow' : 'red'}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {sel.deficiencies !== 'None' && (
                <div className="alert alert-warning" style={{ marginTop: 16 }}>⚠ Deficiencies: {sel.deficiencies}</div>
              )}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                {canApproveInspection && <button className="btn btn-success btn-sm">Approve</button>}
                {canApproveInspection && <button className="btn btn-danger btn-sm">Reject</button>}
                <button className="btn btn-secondary btn-sm">🖨 Print Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
