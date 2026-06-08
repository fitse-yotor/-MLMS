import React, { useState } from 'react';
import { mockBiometrics, mockSeafarers } from '../../mockData';

type CaptureStatus = 'Captured' | 'Partial' | 'Poor Quality' | 'Pending';

type Enrollment = {
  id: string;
  seafarer_id: string;
  seafarer: string;
  enroll_date: string;
  center: string;
  officer: string;
  facial: CaptureStatus;
  facial_template: CaptureStatus;
  left_thumb: CaptureStatus;
  right_thumb: CaptureStatus;
  additional_fingers: CaptureStatus;
  fingerprints: CaptureStatus;
  signature: CaptureStatus;
  signature_template: CaptureStatus;
  quality: number;
  verified_by: string;
  verification_date: string;
  verification_status: string;
  verification_remarks: string;
  status: string;
};

const centers = ['Addis Ababa Center', 'Hawassa Center', 'Dire Dawa Center', 'Bahir Dar Center'];

function normalizeEnrollment(item: any): Enrollment {
  const fingerprintStatus = item.fingerprints as CaptureStatus;
  return {
    ...item,
    facial_template: item.facial === 'Captured' ? 'Captured' : 'Pending',
    left_thumb: fingerprintStatus === 'Captured' ? 'Captured' : fingerprintStatus,
    right_thumb: fingerprintStatus === 'Captured' ? 'Captured' : fingerprintStatus,
    additional_fingers: fingerprintStatus,
    signature_template: item.signature === 'Captured' ? 'Captured' : 'Pending',
    quality: item.status === 'Approved' ? 96 : item.fingerprints === 'Partial' ? 68 : 42,
    verified_by: item.status === 'Approved' ? item.officer : '',
    verification_date: item.status === 'Approved' ? item.enroll_date : '',
    verification_status: item.status === 'Approved' ? 'Verified' : 'Pending Review',
    verification_remarks: item.status === 'Approved' ? 'Enrollment approved and linked to seafarer profile.' : 'Capture requires officer review.',
  };
}

function captureStatus(score: number): CaptureStatus {
  if (score >= 85) return 'Captured';
  if (score >= 65) return 'Partial';
  return 'Poor Quality';
}

function simulateScore(seed: string) {
  const total = seed.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return 62 + (total % 38);
}

function NewEnrollmentModal({ currentUser, onClose, onSave }: { currentUser?: any; onClose: () => void; onSave: (record: Enrollment) => void }) {
  const [form, setForm] = useState({
    seafarer_id: '',
    center: centers[0],
    officer: currentUser?.full_name || 'System Administrator',
    verification_status: 'Identity Verified',
    verification_remarks: '',
  });
  const [captures, setCaptures] = useState({
    facial: 'Pending' as CaptureStatus,
    facial_template: 'Pending' as CaptureStatus,
    left_thumb: 'Pending' as CaptureStatus,
    right_thumb: 'Pending' as CaptureStatus,
    additional_fingers: 'Pending' as CaptureStatus,
    signature: 'Pending' as CaptureStatus,
    signature_template: 'Pending' as CaptureStatus,
  });
  const [quality, setQuality] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function capture(key: keyof typeof captures, label: string) {
    const score = simulateScore(`${form.seafarer_id}-${label}-${Date.now()}`);
    setCaptures(prev => ({ ...prev, [key]: captureStatus(score) }));
    setQuality(prev => Math.max(prev, score));
  }

  function captureAll() {
    ([
      ['facial', 'face'],
      ['facial_template', 'face-template'],
      ['left_thumb', 'left-thumb'],
      ['right_thumb', 'right-thumb'],
      ['additional_fingers', 'fingers'],
      ['signature', 'signature'],
      ['signature_template', 'signature-template'],
    ] as Array<[keyof typeof captures, string]>).forEach(([key, label]) => capture(key, label));
  }

  function save() {
    const nextErrors: Record<string, string> = {};
    if (!form.seafarer_id) nextErrors.seafarer_id = 'Required';
    if (!form.center) nextErrors.center = 'Required';
    if (!form.officer) nextErrors.officer = 'Required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const sf = mockSeafarers.find(s => s.id === form.seafarer_id);
    const values = Object.values(captures);
    const capturedCount = values.filter(v => v === 'Captured').length;
    const today = new Date().toISOString().slice(0, 10);
    onSave({
      id: `BIO-${Date.now()}`,
      seafarer_id: form.seafarer_id,
      seafarer: sf?.name || 'Selected Seafarer',
      enroll_date: today,
      center: form.center,
      officer: form.officer,
      ...captures,
      fingerprints: captures.left_thumb === 'Captured' && captures.right_thumb === 'Captured' ? 'Captured' : capturedCount > 0 ? 'Partial' : 'Pending',
      quality,
      verified_by: '',
      verification_date: '',
      verification_status: form.verification_status,
      verification_remarks: form.verification_remarks || 'Enrollment captured and awaiting approval.',
      status: capturedCount >= 5 ? 'Pending Approval' : 'Pending Capture',
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal" style={{ width: 860 }}>
        <div className="modal-header">
          <div className="modal-title">New Biometric Enrollment</div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Seafarer</label>
              <select value={form.seafarer_id} onChange={e => set('seafarer_id', e.target.value)}>
                <option value="">Select seafarer</option>
                {mockSeafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
              {errors.seafarer_id && <span className="field-error">{errors.seafarer_id}</span>}
            </div>
            <div className="form-group">
              <label>Enrollment Center</label>
              <select value={form.center} onChange={e => set('center', e.target.value)}>
                {centers.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Enrollment Officer</label>
              <input value={form.officer} onChange={e => set('officer', e.target.value)} />
              {errors.officer && <span className="field-error">{errors.officer}</span>}
            </div>
            <div className="form-group">
              <label>Identity Verification Status</label>
              <select value={form.verification_status} onChange={e => set('verification_status', e.target.value)}>
                <option>Identity Verified</option>
                <option>Requires Review</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Verification Remarks</label>
            <textarea value={form.verification_remarks} onChange={e => set('verification_remarks', e.target.value)} placeholder="Record identity document checks or enrollment notes..." />
          </div>

          <div className="flex-between" style={{ margin: '14px 0 10px' }}>
            <div className="form-section-title" style={{ margin: 0, border: 0, padding: 0 }}>Simulated Capture</div>
            <button className="btn btn-secondary btn-sm" onClick={captureAll}>Capture All</button>
          </div>
          <div className="bio-capture-grid">
            {([
              ['facial', 'Facial Photograph'],
              ['facial_template', 'Facial Template'],
              ['left_thumb', 'Left Thumbprint'],
              ['right_thumb', 'Right Thumbprint'],
              ['additional_fingers', 'Additional Fingerprints'],
              ['signature', 'Signature Image'],
              ['signature_template', 'Signature Template'],
            ] as Array<[keyof typeof captures, string]>).map(([key, label]) => (
              <button key={key} type="button" className={`bio-capture-tile ${captures[key].toLowerCase().replace(' ', '-')}`} onClick={() => capture(key, label)}>
                <span>{label}</span>
                <strong>{captures[key]}</strong>
              </button>
            ))}
          </div>
          <div className="bio-quality">
            <span>Best Quality Score</span>
            <strong>{quality ? `${quality}%` : 'Not captured'}</strong>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save Biometric Record</button>
        </div>
      </div>
    </div>
  );
}

export default function BiometricEnrollment({ currentUser }: { currentUser?: any }) {
  const [records, setRecords] = useState<Enrollment[]>(mockBiometrics.map(normalizeEnrollment));
  const [selected, setSelected] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState('');
  const sel = records.find(b => b.id === selected);

  function saveEnrollment(record: Enrollment) {
    setRecords(prev => [record, ...prev]);
    setSelected(record.id);
    setShowNew(false);
    setMessage('Biometric enrollment saved for officer approval.');
    setTimeout(() => setMessage(''), 3000);
  }

  function approveEnrollment(id: string) {
    const today = new Date().toISOString().slice(0, 10);
    setRecords(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'Approved',
      verification_status: 'Verified',
      verified_by: currentUser?.full_name || 'System Administrator',
      verification_date: today,
      verification_remarks: 'Enrollment approved and linked to seafarer profile.',
    } : r));
    setMessage('Enrollment approved and linked to seafarer profile.');
    setTimeout(() => setMessage(''), 3000);
  }

  function recapture(id: string) {
    const score = simulateScore(`${id}-${Date.now()}`);
    const status = captureStatus(score);
    setRecords(prev => prev.map(r => r.id === id ? {
      ...r,
      facial: status,
      facial_template: status,
      left_thumb: status,
      right_thumb: status,
      additional_fingers: status,
      fingerprints: status === 'Captured' ? 'Captured' : 'Partial',
      signature: status,
      signature_template: status,
      quality: score,
      status: status === 'Captured' ? 'Pending Approval' : 'Pending Capture',
      verification_status: 'Pending Review',
      verification_remarks: 'Record re-captured and awaiting review.',
    } : r));
    setMessage('Biometrics re-captured for review.');
    setTimeout(() => setMessage(''), 3000);
  }

  const stats = {
    total: records.length,
    approved: records.filter(r => r.status === 'Approved').length,
    pending: records.filter(r => r.status !== 'Approved').length,
    poor: records.filter(r => r.quality < 70).length,
  };

  return (
    <div className="page">
      {showNew && <NewEnrollmentModal currentUser={currentUser} onClose={() => setShowNew(false)} onSave={saveEnrollment} />}
      <div className="flex-between page-header">
        <div><div className="page-title">Biometric Enrollment</div><div className="page-subtitle">Capture, validate, approve, and link seafarer biometric records</div></div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Enrollment</button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="workflow" style={{ marginBottom: 20 }}>
        {['Identity Verification', 'Biometric Capture', 'Quality Validation', 'Save Record', 'Approve Enrollment', 'Link Profile'].map((s, i, arr) => (
          <React.Fragment key={s}>
            <div className={`workflow-step ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`}>{s}</div>
            {i < arr.length - 1 && <span className="workflow-arrow">-&gt;</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          ['Total Enrollments', stats.total, 'blue'],
          ['Approved', stats.approved, 'green'],
          ['Pending Review', stats.pending, 'yellow'],
          ['Poor Quality', stats.poor, 'red'],
        ].map(([label, value, color]) => <div className="stat-card" key={String(label)}><div className={`stat-icon ${color}`}>B</div><div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div></div>)}
      </div>

      {!selected ? (
        <div className="card">
          <div className="card-header"><div className="card-title">Enrollment Records ({records.length})</div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Seafarer</th><th>Enrollment Date</th><th>Center</th><th>Officer</th><th>Facial</th><th>Fingerprints</th><th>Signature</th><th>Quality</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {records.map(b => (
                  <tr key={b.id}>
                    <td><div style={{ fontWeight: 500 }}>{b.seafarer}</div><div style={{ fontSize: 11, color: '#64748b' }}>{b.seafarer_id}</div></td>
                    <td>{b.enroll_date}</td>
                    <td>{b.center}</td>
                    <td>{b.officer}</td>
                    <td><span className={`badge badge-${b.facial === 'Captured' ? 'green' : b.facial === 'Poor Quality' ? 'red' : 'yellow'}`}>{b.facial}</span></td>
                    <td><span className={`badge badge-${b.fingerprints === 'Captured' ? 'green' : b.fingerprints === 'Poor Quality' ? 'red' : 'yellow'}`}>{b.fingerprints}</span></td>
                    <td><span className={`badge badge-${b.signature === 'Captured' ? 'green' : b.signature === 'Poor Quality' ? 'red' : 'yellow'}`}>{b.signature}</span></td>
                    <td><strong>{b.quality}%</strong></td>
                    <td><span className={`badge badge-${b.status === 'Approved' ? 'green' : b.status === 'Pending Capture' ? 'red' : 'yellow'}`}>{b.status}</span></td>
                    <td><button className="btn btn-secondary btn-xs" onClick={() => setSelected(b.id)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>&lt;- Back to List</button>
          {sel && (
            <div className="card-grid">
              <div className="card">
                <div className="card-header"><div className="card-title">Enrollment Details</div></div>
                <div className="card-body">
                  <div className="info-grid">
                    {[
                      ['Enrollment ID', sel.id],
                      ['Seafarer', sel.seafarer],
                      ['Seafarer ID', sel.seafarer_id],
                      ['Enrollment Date', sel.enroll_date],
                      ['Center', sel.center],
                      ['Officer', sel.officer],
                      ['Verified By', sel.verified_by || '-'],
                      ['Verification Date', sel.verification_date || '-'],
                      ['Status', sel.status],
                    ].map(([k, v]) => (
                      <div className="info-item" key={k}><label>{k}</label><div className="info-value">{v}</div></div>
                    ))}
                  </div>
                  <div className="alert alert-info" style={{ marginTop: 16 }}>{sel.verification_remarks}</div>
                </div>
              </div>
              <div className="card">
                <div className="card-header"><div className="card-title">Biometric Captures</div></div>
                <div className="card-body">
                  <div className="bio-capture-grid">
                    {[
                      ['Facial Photo', sel.facial],
                      ['Facial Template', sel.facial_template],
                      ['Left Thumbprint', sel.left_thumb],
                      ['Right Thumbprint', sel.right_thumb],
                      ['Additional Fingerprints', sel.additional_fingers],
                      ['Signature Image', sel.signature],
                      ['Signature Template', sel.signature_template],
                    ].map(([label, status]) => (
                      <div key={label} className={`bio-capture-tile ${String(status).toLowerCase().replace(' ', '-')}`}>
                        <span>{label}</span>
                        <strong>{status}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="bio-quality"><span>Quality Score</span><strong>{sel.quality}%</strong></div>
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    {sel.status !== 'Approved' && <button className="btn btn-success btn-sm" onClick={() => approveEnrollment(sel.id)}>Approve Enrollment</button>}
                    <button className="btn btn-warning btn-sm" onClick={() => recapture(sel.id)}>Re-capture</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
