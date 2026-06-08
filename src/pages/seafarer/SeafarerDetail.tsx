import React, { useState } from 'react';
import { mockSeafarers, mockTrainingRecords, mockMedicalRecords, mockSeaService, mockCertifications } from '../../mockData';

export default function SeafarerDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [tab, setTab] = useState('overview');
  const s = mockSeafarers.find(x => x.id === id) || mockSeafarers[0];
  const training = mockTrainingRecords.filter(t => t.seafarer_id === id);
  const medical = mockMedicalRecords.filter(m => m.seafarer_id === id);
  const seaService = mockSeaService.filter(ss => ss.seafarer_id === id);
  const certs = mockCertifications.filter(c => c.seafarer_id === id);

  const tabs = ['overview', 'training', 'medical', 'sea-service', 'certifications', 'history'];

  return (
    <div className="page">
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
        <div style={{ fontSize: 13, color: '#64748b' }}>Seafarer Registry / {s.name}</div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{s.name.charAt(0)}</div>
        <div className="profile-info">
          <div className="profile-name">{s.name}</div>
          <div className="profile-id">{s.id} · Registered {s.reg_date}</div>
          <div className="profile-meta">
            <div className="profile-meta-item"><strong>Gender:</strong> {s.gender}</div>
            <div className="profile-meta-item"><strong>DOB:</strong> {s.dob}</div>
            <div className="profile-meta-item"><strong>Nationality:</strong> {s.nationality}</div>
            <div className="profile-meta-item"><strong>Mobile:</strong> {s.mobile}</div>
            <div className="profile-meta-item"><strong>Email:</strong> {s.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <span className={`badge badge-${s.status === 'Active' ? 'green' : s.status === 'Pending' ? 'yellow' : 'red'}`}>{s.status}</span>
          <button className="btn btn-secondary btn-sm">✏ Edit Profile</button>
          <button className="btn btn-secondary btn-sm">🖨 Print Profile</button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '📋 Overview' : t === 'training' ? '🎓 Training' : t === 'medical' ? '🏥 Medical' : t === 'sea-service' ? '⚓ Sea Service' : t === 'certifications' ? '📜 Certifications' : '🕐 History'}
          </div>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card-grid">
          <div className="card">
            <div className="card-header"><div className="card-title">Personal Information</div></div>
            <div className="card-body">
              <div className="info-grid">
                {[
                  ['Seafarer ID', s.id], ['First Name', s.name.split(' ')[0]], ['Last Name', s.name.split(' ')[1] || ''],
                  ['Gender', s.gender], ['Date of Birth', s.dob], ['Nationality', s.nationality],
                  ['National ID', s.national_id], ['Passport No.', s.passport],
                ].map(([label, value]) => (
                  <div className="info-item" key={label}><label>{label}</label><div className="info-value">{value}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Contact & Status</div></div>
            <div className="card-body">
              <div className="info-grid">
                {[
                  ['Mobile', s.mobile], ['Email', s.email], ['Region', s.region],
                  ['Reg. Status', s.status], ['Medical Status', s.medical],
                  ['Book Number', s.book_number], ['Book Status', s.book_status],
                ].map(([label, value]) => (
                  <div className="info-item" key={label}><label>{label}</label><div className="info-value">{value}</div></div>
                ))}
              </div>
              <hr className="divider" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm">✓ Approve</button>
                <button className="btn btn-danger btn-sm">✗ Suspend</button>
                <button className="btn btn-secondary btn-sm">📄 Documents</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'training' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Training Records</div>
            <button className="btn btn-primary btn-sm">+ Add Training</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Course</th><th>Institution</th><th>Cert. No.</th><th>Issue Date</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {training.length === 0 && <tr><td colSpan={7} className="text-center" style={{ padding: 24, color: '#64748b' }}>No training records found</td></tr>}
                {training.map(t => (
                  <tr key={t.id}>
                    <td><div style={{ fontWeight: 500 }}>{t.course}</div></td>
                    <td>{t.institution}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.cert_no}</span></td>
                    <td>{t.start}</td>
                    <td>{t.expiry}</td>
                    <td><span className={`badge badge-${t.status === 'Approved' ? 'green' : 'yellow'}`}>{t.status}</span></td>
                    <td><button className="btn btn-secondary btn-xs">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'medical' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Medical Records</div>
            <button className="btn btn-primary btn-sm">+ Add Medical Record</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Cert. No.</th><th>Facility</th><th>Doctor</th><th>Exam Date</th><th>Expiry</th><th>Fitness</th><th>Status</th></tr></thead>
              <tbody>
                {medical.length === 0 && <tr><td colSpan={7} className="text-center" style={{ padding: 24, color: '#64748b' }}>No medical records found</td></tr>}
                {medical.map(m => (
                  <tr key={m.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{m.cert_no}</span></td>
                    <td>{m.facility}</td>
                    <td>{m.doctor}</td>
                    <td>{m.exam_date}</td>
                    <td>{m.expiry}</td>
                    <td><span className={`badge badge-${m.status === 'Fit' ? 'green' : 'yellow'}`}>{m.status}</span></td>
                    <td><span className={`badge badge-${m.verified === 'Approved' ? 'green' : 'yellow'}`}>{m.verified}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sea-service' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Sea Service Records</div>
            <button className="btn btn-primary btn-sm">+ Add Sea Service</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Vessel</th><th>Type</th><th>Rank</th><th>Company</th><th>Sign-On</th><th>Sign-Off</th><th>Days</th><th>Status</th></tr></thead>
              <tbody>
                {seaService.length === 0 && <tr><td colSpan={8} className="text-center" style={{ padding: 24, color: '#64748b' }}>No sea service records found</td></tr>}
                {seaService.map(ss => (
                  <tr key={ss.id}>
                    <td><div style={{ fontWeight: 500 }}>{ss.vessel}</div><div style={{ fontSize: 11, color: '#64748b' }}>IMO: {ss.imo}</div></td>
                    <td>{ss.vessel_type}</td>
                    <td>{ss.rank}</td>
                    <td>{ss.company}</td>
                    <td>{ss.sign_on}</td>
                    <td>{ss.sign_off}</td>
                    <td><strong>{ss.days}</strong></td>
                    <td><span className={`badge badge-${ss.status === 'Approved' ? 'green' : 'yellow'}`}>{ss.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'certifications' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Certificates</div>
            <button className="btn btn-primary btn-sm">+ Apply for Certificate</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Certificate Type</th><th>Cert. Number</th><th>Issue Date</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {certs.length === 0 && <tr><td colSpan={6} className="text-center" style={{ padding: 24, color: '#64748b' }}>No certificates found</td></tr>}
                {certs.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.type}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.cert_no}</span></td>
                    <td>{c.issue}</td>
                    <td>{c.expiry}</td>
                    <td><span className={`badge badge-${c.status === 'Active' ? 'green' : c.status === 'Expiring Soon' ? 'yellow' : 'red'}`}>{c.status}</span></td>
                    <td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-secondary btn-xs">View</button><button className="btn btn-secondary btn-xs">Print</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <div className="card-header"><div className="card-title">Activity History</div></div>
          <div className="card-body">
            <div className="timeline">
              {[
                { color: 'green', title: 'Certificate Issued', time: '2024-02-15 10:30', desc: 'Able Seafarer Deck certificate CERT-001 issued' },
                { color: 'blue', title: 'Registration Approved', time: '2024-01-12 14:00', desc: 'Registration approved by Administrator' },
                { color: 'blue', title: 'Biometric Enrollment', time: '2024-01-12 09:15', desc: 'Biometric data captured and verified' },
                { color: 'yellow', title: 'Application Submitted', time: '2024-01-10 11:00', desc: 'Seafarer registration application submitted' },
              ].map((item, i) => (
                <div className="timeline-item" key={i}>
                  <div className={`timeline-dot ${item.color}`}>✓</div>
                  <div className="timeline-content">
                    <div className="tl-title">{item.title}</div>
                    <div className="tl-time">{item.time}</div>
                    <div className="tl-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
