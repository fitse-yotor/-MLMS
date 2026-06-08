import React, { useState } from 'react';
import { mockSeafarers, mockVessels, mockLogisticsOperators, mockCertifications, mockExamResults } from '../mockData';

export default function Reports() {
  const [module, setModule] = useState('seafarer');

  const modules = [
    { id: 'seafarer', label: '👥 Seafarer Reports' },
    { id: 'vessel', label: '🚢 Vessel Reports' },
    { id: 'logistics', label: '🚛 Logistics Reports' },
    { id: 'exam', label: '🏆 Exam Reports' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Reports & Analytics</div>
        <div className="page-subtitle">Generate operational and regulatory reports</div>
      </div>

      <div className="tabs">
        {modules.map(m => (
          <div key={m.id} className={`tab${module === m.id ? ' active' : ''}`} onClick={() => setModule(m.id)}>{m.label}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 240, flexShrink: 0 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Report Filters</div></div>
            <div className="card-body">
              <div className="form-group"><label>Date From</label><input type="date" defaultValue="2024-01-01" /></div>
              <div className="form-group"><label>Date To</label><input type="date" defaultValue="2024-03-31" /></div>
              {module === 'seafarer' && <>
                <div className="form-group"><label>Status</label><select><option value="">All</option><option>Active</option><option>Suspended</option></select></div>
                <div className="form-group"><label>Region</label><select><option value="">All Regions</option><option>Addis Ababa</option><option>Oromia</option><option>Amhara</option></select></div>
              </>}
              {module === 'vessel' && <>
                <div className="form-group"><label>Vessel Type</label><select><option value="">All Types</option><option>Passenger</option><option>Cargo</option><option>Ferry</option></select></div>
              </>}
              {module === 'exam' && <>
                <div className="form-group"><label>Exam Type</label><select><option value="">All Types</option><option>Deck Officer</option><option>Marine Engineer</option></select></div>
              </>}
              <div className="form-group"><label>Export Format</label>
                <select><option>PDF</option><option>Excel</option><option>CSV</option></select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>📊 Generate Report</button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {module === 'seafarer' && (
            <>
              <div className="stats-grid">
                {[
                  { label: 'Total Seafarers', value: mockSeafarers.length, color: 'blue' },
                  { label: 'Active', value: mockSeafarers.filter(s => s.status === 'Active').length, color: 'green' },
                  { label: 'Pending', value: mockSeafarers.filter(s => s.status === 'Pending').length, color: 'yellow' },
                  { label: 'Suspended', value: mockSeafarers.filter(s => s.status === 'Suspended').length, color: 'red' },
                  { label: 'Active Certificates', value: mockCertifications.filter(c => c.status === 'Active').length, color: 'purple' },
                  { label: 'Expiring Certs', value: mockCertifications.filter(c => c.status === 'Expiring Soon').length, color: 'yellow' },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className={`stat-icon ${s.color}`}>👥</div>
                    <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Seafarer Report — Jan–Mar 2024</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm">📄 Export PDF</button>
                    <button className="btn btn-secondary btn-sm">📊 Export Excel</button>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Seafarer ID</th><th>Name</th><th>Region</th><th>Reg. Date</th><th>Medical</th><th>Certifications</th><th>Status</th></tr></thead>
                    <tbody>
                      {mockSeafarers.map(s => (
                        <tr key={s.id}>
                          <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.id}</span></td>
                          <td style={{ fontWeight: 500 }}>{s.name}</td>
                          <td>{s.region}</td>
                          <td>{s.reg_date}</td>
                          <td><span className={`badge badge-${s.medical === 'Fit' ? 'green' : 'yellow'}`}>{s.medical}</span></td>
                          <td>{mockCertifications.filter(c => c.seafarer_id === s.id).length}</td>
                          <td><span className={`badge badge-${s.status === 'Active' ? 'green' : s.status === 'Pending' ? 'yellow' : 'red'}`}>{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {module === 'vessel' && (
            <>
              <div className="stats-grid">
                {[
                  { label: 'Total Vessels', value: mockVessels.length, color: 'teal' },
                  { label: 'Active', value: mockVessels.filter(v => v.reg_status === 'Active').length, color: 'green' },
                  { label: 'Inspections Passed', value: mockVessels.filter(v => v.inspection === 'Passed').length, color: 'blue' },
                  { label: 'License Issues', value: mockVessels.filter(v => v.license_status !== 'Valid').length, color: 'red' },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className={`stat-icon ${s.color}`}>🚢</div>
                    <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Vessel Report</div>
                  <button className="btn btn-secondary btn-sm">📄 Export</button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Reg. No.</th><th>Vessel</th><th>Type</th><th>Owner</th><th>Reg. Status</th><th>License</th><th>Inspection</th></tr></thead>
                    <tbody>
                      {mockVessels.map(v => (
                        <tr key={v.id}>
                          <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.reg_no}</span></td>
                          <td style={{ fontWeight: 500 }}>{v.name}</td>
                          <td>{v.type}</td>
                          <td>{v.owner}</td>
                          <td><span className={`badge badge-${v.reg_status === 'Active' ? 'green' : 'red'}`}>{v.reg_status}</span></td>
                          <td><span className={`badge badge-${v.license_status === 'Valid' ? 'green' : 'yellow'}`}>{v.license_status}</span></td>
                          <td><span className={`badge badge-${v.inspection === 'Passed' ? 'green' : 'yellow'}`}>{v.inspection}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {module === 'logistics' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Logistics Operator Report</div>
                <button className="btn btn-secondary btn-sm">📄 Export</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Operator</th><th>Type</th><th>Region</th><th>License No.</th><th>Expiry</th><th>Status</th></tr></thead>
                  <tbody>
                    {mockLogisticsOperators.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 500 }}>{o.name}</td>
                        <td>{o.type}</td>
                        <td>{o.region}</td>
                        <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.license_no}</span></td>
                        <td>{o.license_expiry}</td>
                        <td><span className={`badge badge-${o.status === 'Active' ? 'green' : o.status === 'Expiring Soon' ? 'yellow' : 'red'}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {module === 'exam' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Examination Results Report</div>
                <button className="btn btn-secondary btn-sm">📄 Export</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Candidate</th><th>Exam Type</th><th>Date</th><th>Score</th><th>Pass Mark</th><th>Result</th><th>Published</th></tr></thead>
                  <tbody>
                    {mockExamResults.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 500 }}>{r.candidate}</td>
                        <td>{r.exam_type}</td>
                        <td>{r.date}</td>
                        <td>{r.score || '-'}/100</td>
                        <td>{r.pass_mark}</td>
                        <td><span className={`badge badge-${r.result === 'Pass' ? 'green' : r.result === 'Fail' ? 'red' : 'yellow'}`}>{r.result}</span></td>
                        <td><span className={`badge badge-${r.published ? 'green' : 'gray'}`}>{r.published ? 'Yes' : 'No'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
