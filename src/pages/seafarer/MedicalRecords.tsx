import React, { useState } from 'react';
import { mockMedicalRecords, mockSeafarers } from '../../mockData';

interface MedicalRecord {
  id: string; seafarer_id: string; seafarer: string;
  cert_no: string; facility: string; country: string;
  doctor: string; exam_date: string; issue_date: string;
  expiry: string; fitness: string; cert_file: boolean;
  status: string; remarks: string;
}

function MedicalModal({ onClose, onSave, seafarers, currentUser }: { onClose: () => void; onSave: (r: MedicalRecord) => void; seafarers: typeof mockSeafarers; currentUser?: any }) {
  const isSeafarer = currentUser?.role === 'Seafarer';
  const lockedSf = isSeafarer ? mockSeafarers.find(s => s.name === currentUser.full_name || s.id === currentUser.id) : null;
  const [form, setForm] = useState({ seafarer_id: lockedSf?.id || '', cert_no: '', facility: '', country: 'Ethiopia', doctor: '', exam_date: '', issue_date: '', expiry: '', fitness: '', cert_file: false });
  const [errors, setErrors] = useState<any>({});

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); setErrors((e: any) => { const n = { ...e }; delete n[k]; return n; }); }

  function save() {
    const e: any = {};
    if (!form.seafarer_id) e.seafarer_id = 'Required';
    if (!form.cert_no) e.cert_no = 'Required';
    if (!form.facility) e.facility = 'Required';
    if (!form.doctor) e.doctor = 'Required';
    if (!form.exam_date) e.exam_date = 'Required';
    if (!form.issue_date) e.issue_date = 'Required';
    if (!form.expiry) e.expiry = 'Required';
    if (!form.fitness) e.fitness = 'Required';
    if (!form.cert_file) e.cert_file = 'Certificate upload is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const sf = seafarers.find(s => s.id === form.seafarer_id);
    onSave({ ...form, id: `MR-${Date.now()}`, seafarer: sf?.name || '', status: 'Submitted', remarks: '' });
  }

  const Err = ({ k }: { k: string }) => errors[k] ? <span style={{ color: '#dc2626', fontSize: 11 }}>{errors[k]}</span> : null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">🏥 Add Medical Record</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div className="alert alert-info">ℹ Medical records require review and approval by the System Administrator before being accepted.</div>
          <div className="form-section">
            <div className="form-section-title">Seafarer</div>
            <div className="form-group">
              <label>Seafarer <span style={{ color: '#dc2626' }}>*</span></label>
              {isSeafarer && lockedSf ? (
                <input value={`${lockedSf.name} (${lockedSf.id})`} readOnly style={{ background: '#f8fafc', color: '#374151' }} />
              ) : (
                <select value={form.seafarer_id} onChange={e => set('seafarer_id', e.target.value)} style={errors.seafarer_id ? { borderColor: '#dc2626' } : {}}>
                  <option value="">Select seafarer...</option>
                  {seafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select>
              )}
              <Err k="seafarer_id" />
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-title">Medical Facility Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Medical Certificate Number <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.cert_no} onChange={e => set('cert_no', e.target.value)} placeholder="MC-XXXX-XXXX" style={errors.cert_no ? { borderColor: '#dc2626' } : {}} />
                <Err k="cert_no" />
              </div>
              <div className="form-group">
                <label>Medical Facility Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.facility} onChange={e => set('facility', e.target.value)} placeholder="Hospital / Clinic name" style={errors.facility ? { borderColor: '#dc2626' } : {}} />
                <Err k="facility" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select value={form.country} onChange={e => set('country', e.target.value)}>
                  <option>Ethiopia</option><option>Djibouti</option><option>Kenya</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Doctor Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.doctor} onChange={e => set('doctor', e.target.value)} placeholder="Dr. Full Name" style={errors.doctor ? { borderColor: '#dc2626' } : {}} />
                <Err k="doctor" />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-title">Examination Dates</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Examination Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" value={form.exam_date} onChange={e => set('exam_date', e.target.value)} style={errors.exam_date ? { borderColor: '#dc2626' } : {}} />
                <Err k="exam_date" />
              </div>
              <div className="form-group">
                <label>Issue Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" value={form.issue_date} onChange={e => set('issue_date', e.target.value)} style={errors.issue_date ? { borderColor: '#dc2626' } : {}} />
                <Err k="issue_date" />
              </div>
              <div className="form-group">
                <label>Expiry Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} style={errors.expiry ? { borderColor: '#dc2626' } : {}} />
                <Err k="expiry" />
              </div>
              <div className="form-group">
                <label>Fitness Status <span style={{ color: '#dc2626' }}>*</span></label>
                <select value={form.fitness} onChange={e => set('fitness', e.target.value)} style={errors.fitness ? { borderColor: '#dc2626' } : {}}>
                  <option value="">Select fitness status...</option>
                  <option>Fit</option>
                  <option>Fit with Restrictions</option>
                  <option>Unfit</option>
                </select>
                <Err k="fitness" />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-title">Certificate Upload</div>
            <div style={{ border: `2px dashed ${errors.cert_file ? '#fecaca' : form.cert_file ? '#86efac' : '#cbd5e1'}`, borderRadius: 10, padding: 24, textAlign: 'center', background: form.cert_file ? '#f0fdf4' : '#f8fafc', cursor: 'pointer' }} onClick={() => set('cert_file', !form.cert_file)}>
              {form.cert_file
                ? <><div style={{ fontSize: 28, marginBottom: 6 }}>✅</div><div style={{ fontSize: 13, fontWeight: 500, color: '#166534' }}>Medical Certificate Uploaded</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>medical_certificate.pdf · Click to remove</div></>
                : <><div style={{ fontSize: 28, marginBottom: 6 }}>📄</div><div style={{ fontSize: 13, fontWeight: 500 }}>Click to upload medical certificate</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>PDF, JPG, PNG — max 5MB</div></>
              }
            </div>
            {errors.cert_file && <span style={{ color: '#dc2626', fontSize: 11, marginTop: 4, display: 'block' }}>{errors.cert_file}</span>}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Submit for Review</button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ record, onClose, onAction, canApprove }: { record: MedicalRecord; onClose: () => void; onAction: (id: string, action: string, remarks: string) => void; canApprove: boolean }) {
  const [remarks, setRemarks] = useState('');
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Review Medical Record</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div className="info-grid" style={{ marginBottom: 16 }}>
            {[['Seafarer', record.seafarer], ['Cert. No.', record.cert_no], ['Facility', record.facility], ['Doctor', record.doctor], ['Exam Date', record.exam_date], ['Issue Date', record.issue_date], ['Expiry', record.expiry], ['Fitness', record.fitness], ['Country', record.country]].map(([k, v]) => (
              <div className="info-item" key={k}><label>{k}</label>
                <div className="info-value">
                  {k === 'Fitness' ? <span className={`badge badge-${v === 'Fit' ? 'green' : v === 'Fit with Restrictions' ? 'yellow' : 'red'}`}>{v}</span> : v}
                </div>
              </div>
            ))}
          </div>
          {record.cert_file && (
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <div><div style={{ fontSize: 13, fontWeight: 500 }}>medical_certificate.pdf</div><div style={{ fontSize: 12, color: '#64748b' }}>Submitted by seafarer</div></div>
              <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>👁 View Document</button>
            </div>
          )}
          <div className="form-group">
            <label>Admin Review Remarks</label>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add verification notes or rejection reason..." rows={3} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {canApprove && (
            <>
              <button className="btn btn-danger" onClick={() => { onAction(record.id, 'Rejected', remarks); onClose(); }}>Reject</button>
              <button className="btn btn-success" onClick={() => { onAction(record.id, 'Approved', remarks); onClose(); }}>Approve</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MedicalRecords({ currentUser }: { currentUser?: any }) {
  const [records, setRecords] = useState<MedicalRecord[]>(
    mockMedicalRecords.map(m => ({ ...m, country: 'Ethiopia', issue_date: m.exam_date, fitness: m.status, cert_file: true, status: m.verified, remarks: '' }))
  );
  const [showAdd, setShowAdd] = useState(false);
  const [reviewing, setReviewing] = useState<MedicalRecord | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const canApproveMedical = currentUser?.role === 'System Administrator';
  const canSubmitMedical = currentUser?.role === 'Seafarer' || currentUser?.role === 'System Administrator';
  const visibleRecords = currentUser?.role === 'Seafarer'
    ? records.filter(r => r.seafarer_id === currentUser.id)
    : records;

  const filtered = visibleRecords.filter(r =>
    (r.seafarer.toLowerCase().includes(search.toLowerCase()) || r.cert_no.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || r.status === statusFilter)
  );

  function handleSave(r: MedicalRecord) {
    setRecords(prev => [r, ...prev]);
    setShowAdd(false);
    setSuccessMsg(`Medical record submitted for ${r.seafarer}. Pending System Administrator review.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  function handleAction(id: string, action: string, remarks: string) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: action, remarks } : r));
    setSuccessMsg(`Record ${action.toLowerCase()} successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  return (
    <div className="page">
      {showAdd && <MedicalModal onClose={() => setShowAdd(false)} onSave={handleSave} seafarers={mockSeafarers} currentUser={currentUser} />}
      {reviewing && <ReviewModal record={reviewing} onClose={() => setReviewing(null)} onAction={handleAction} canApprove={canApproveMedical} />}

      <div className="flex-between page-header">
        <div><div className="page-title">Medical Records Management</div><div className="page-subtitle">Manage seafarer medical fitness certificates</div></div>
        {canSubmitMedical && <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Medical Record</button>}
      </div>

      {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Workflow: Medical Record Management</div>
          <div className="workflow">
            {['Upload Certificate', 'Submit Record', 'Admin Review', 'Approve / Reject', 'Stored in Profile'].map((s, i, arr) => (
              <React.Fragment key={s}>
                <div className={`workflow-step ${i < 2 ? 'done' : i === 2 ? 'active' : ''}`}>{i < 2 ? '✓ ' : ''}{s}</div>
                {i < arr.length - 1 && <span className="workflow-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Records', value: visibleRecords.length, color: 'blue', icon: '🏥' },
          { label: 'Fit', value: visibleRecords.filter(r => r.fitness === 'Fit').length, color: 'green', icon: '✓' },
          { label: 'Fit w/ Restrictions', value: visibleRecords.filter(r => r.fitness === 'Fit with Restrictions').length, color: 'yellow', icon: '⚠' },
          { label: 'Pending Review', value: visibleRecords.filter(r => r.status === 'Submitted' || r.status === 'Pending').length, color: 'blue', icon: '⏳' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Medical Records</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Search seafarer, cert no..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13 }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13 }}>
              <option value="">All Status</option>
              <option>Approved</option><option>Submitted</option><option>Pending</option><option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Seafarer</th><th>Cert. No.</th><th>Facility</th><th>Country</th>
                <th>Doctor</th><th>Exam Date</th><th>Expiry</th><th>Fitness</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={11} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}><div style={{ fontSize: 24, marginBottom: 6 }}>📭</div>No records found</td></tr>}
              {filtered.map(r => (
                <tr key={r.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{r.id}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{r.seafarer}</div><div style={{ fontSize: 11, color: '#64748b' }}>{r.seafarer_id}</div></td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.cert_no}</span></td>
                  <td style={{ fontSize: 13 }}>{r.facility}</td>
                  <td style={{ fontSize: 13 }}>{r.country}</td>
                  <td style={{ fontSize: 13 }}>{r.doctor}</td>
                  <td style={{ fontSize: 13 }}>{r.exam_date}</td>
                  <td style={{ fontSize: 13 }}>{r.expiry}</td>
                  <td><span className={`badge badge-${r.fitness === 'Fit' ? 'green' : r.fitness === 'Fit with Restrictions' ? 'yellow' : 'red'}`}>{r.fitness}</span></td>
                  <td><span className={`badge badge-${r.status === 'Approved' ? 'green' : r.status === 'Rejected' ? 'red' : 'blue'}`}>{r.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => setReviewing(r)}>View</button>
                      {canApproveMedical && (r.status === 'Submitted' || r.status === 'Pending') && (
                        <button className="btn btn-success btn-xs" onClick={() => setReviewing(r)}>Review</button>
                      )}
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
