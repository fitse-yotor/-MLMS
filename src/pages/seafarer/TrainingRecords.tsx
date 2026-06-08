import React, { useState } from 'react';
import { mockTrainingRecords, mockSeafarers } from '../../mockData';

interface TrainingRecord {
  id: string; seafarer_id: string; seafarer: string;
  course: string; institution: string; country: string;
  cert_no: string; issue_date: string; expiry: string;
  cert_file: boolean; submission_date: string;
  status: string; remarks: string;
}

const COURSES = [
  'Personal Survival Techniques', 'Fire Prevention and Fire Fighting',
  'Elementary First Aid', 'Personal Safety and Social Responsibilities',
  'Advanced Fire Fighting', 'Proficiency in Survival Craft',
  'Medical First Aid', 'Medical Care', 'Deck Rating Certificate',
  'Engine Rating Certificate', 'Able Seafarer Deck', 'Able Seafarer Engine',
  'Officer of the Watch (Deck)', 'Officer of the Watch (Engine)',
  'GMDSS General Operator Certificate', 'Radar Navigation',
  'Electronic Chart Display and Information System (ECDIS)',
  'Proficiency in Designated Security Duties', 'Ship Security Officer',
];

function TrainingModal({ onClose, onSave, seafarers }: {
  onClose: () => void;
  onSave: (r: TrainingRecord) => void;
  seafarers: typeof mockSeafarers;
}) {
  const [form, setForm] = useState({
    seafarer_id: '', course: '', institution: '', country: 'Ethiopia',
    cert_no: '', issue_date: '', expiry: '', cert_file: false,
    remarks: '',
  });
  const [errors, setErrors] = useState<any>({});

  function set(k: string, v: any) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors((e: any) => { const n = { ...e }; delete n[k]; return n; });
  }

  function save() {
    const e: any = {};
    if (!form.seafarer_id) e.seafarer_id = 'Required';
    if (!form.course) e.course = 'Required';
    if (!form.institution) e.institution = 'Required';
    if (!form.cert_no) e.cert_no = 'Required';
    if (!form.issue_date) e.issue_date = 'Required';
    if (!form.expiry) e.expiry = 'Required';
    if (!form.cert_file) e.cert_file = 'Certificate file is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const sf = seafarers.find(s => s.id === form.seafarer_id);
    onSave({
      id: `TR-${Date.now()}`,
      seafarer_id: form.seafarer_id,
      seafarer: sf?.name || '',
      course: form.course, institution: form.institution,
      country: form.country, cert_no: form.cert_no,
      issue_date: form.issue_date, expiry: form.expiry,
      cert_file: form.cert_file,
      submission_date: new Date().toISOString().slice(0, 10),
      status: 'Submitted', remarks: form.remarks,
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">🎓 Add Training Record</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="alert alert-info">ℹ After submission, this record will be reviewed and verified by an authorized officer before being added to the seafarer profile.</div>

          <div className="form-section">
            <div className="form-section-title">Seafarer & Course</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Seafarer <span style={{ color: '#dc2626' }}>*</span></label>
                <select value={form.seafarer_id} onChange={e => set('seafarer_id', e.target.value)} style={errors.seafarer_id ? { borderColor: '#dc2626' } : {}}>
                  <option value="">Select seafarer...</option>
                  {seafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select>
                {errors.seafarer_id && <span style={{ color: '#dc2626', fontSize: 11 }}>{errors.seafarer_id}</span>}
              </div>
              <div className="form-group">
                <label>Training Course <span style={{ color: '#dc2626' }}>*</span></label>
                <select value={form.course} onChange={e => set('course', e.target.value)} style={errors.course ? { borderColor: '#dc2626' } : {}}>
                  <option value="">Select course...</option>
                  {COURSES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.course && <span style={{ color: '#dc2626', fontSize: 11 }}>{errors.course}</span>}
              </div>
              <div className="form-group">
                <label>Training Institution <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.institution} onChange={e => set('institution', e.target.value)} placeholder="Institution name" style={errors.institution ? { borderColor: '#dc2626' } : {}} />
                {errors.institution && <span style={{ color: '#dc2626', fontSize: 11 }}>{errors.institution}</span>}
              </div>
              <div className="form-group">
                <label>Country</label>
                <select value={form.country} onChange={e => set('country', e.target.value)}>
                  <option>Ethiopia</option><option>Djibouti</option><option>Kenya</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Certificate Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Certificate Number <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.cert_no} onChange={e => set('cert_no', e.target.value)} placeholder="e.g. PST-2024-0001" style={errors.cert_no ? { borderColor: '#dc2626' } : {}} />
                {errors.cert_no && <span style={{ color: '#dc2626', fontSize: 11 }}>{errors.cert_no}</span>}
              </div>
              <div className="form-group">
                <label>Issue Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" value={form.issue_date} onChange={e => set('issue_date', e.target.value)} style={errors.issue_date ? { borderColor: '#dc2626' } : {}} />
                {errors.issue_date && <span style={{ color: '#dc2626', fontSize: 11 }}>{errors.issue_date}</span>}
              </div>
              <div className="form-group">
                <label>Expiry Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} style={errors.expiry ? { borderColor: '#dc2626' } : {}} />
                {errors.expiry && <span style={{ color: '#dc2626', fontSize: 11 }}>{errors.expiry}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Certificate File Upload</div>
            <div style={{ border: `2px dashed ${errors.cert_file ? '#fecaca' : form.cert_file ? '#86efac' : '#cbd5e1'}`, borderRadius: 10, padding: 24, textAlign: 'center', background: form.cert_file ? '#f0fdf4' : '#f8fafc', cursor: 'pointer' }} onClick={() => set('cert_file', !form.cert_file)}>
              {form.cert_file ? (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#166534' }}>Certificate Uploaded</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>training_certificate.pdf · Click to remove</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Click to upload certificate</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>PDF, JPG, PNG — max 5MB</div>
                </div>
              )}
            </div>
            {errors.cert_file && <span style={{ color: '#dc2626', fontSize: 11, marginTop: 4, display: 'block' }}>{errors.cert_file}</span>}
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea value={form.remarks} onChange={e => set('remarks', e.target.value)} placeholder="Additional notes or remarks..." rows={2} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Submit for Verification</button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ record, onClose, onAction, canApprove }: { record: TrainingRecord; onClose: () => void; onAction: (id: string, action: string, remarks: string) => void; canApprove: boolean }) {
  const [remarks, setRemarks] = useState('');
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Review Training Record</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-grid" style={{ marginBottom: 16 }}>
            {[['Seafarer', record.seafarer], ['Course', record.course], ['Institution', record.institution], ['Country', record.country], ['Cert. No.', record.cert_no], ['Issue Date', record.issue_date], ['Expiry', record.expiry], ['Submitted', record.submission_date]].map(([k, v]) => (
              <div className="info-item" key={k}><label>{k}</label><div className="info-value">{v}</div></div>
            ))}
          </div>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📄</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Certificate File</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{record.cert_file ? 'training_certificate.pdf' : 'No file uploaded'}</div>
            </div>
            {record.cert_file && <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>👁 View</button>}
          </div>
          <div className="form-group">
            <label>Officer Remarks</label>
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

export default function TrainingRecords({ currentUser }: { currentUser?: any }) {
  const [records, setRecords] = useState<TrainingRecord[]>(
    mockTrainingRecords.map(r => ({ ...r, country: 'Ethiopia', issue_date: r.start, cert_file: true, submission_date: r.start, remarks: '' }))
  );
  const [showAdd, setShowAdd] = useState(false);
  const [reviewing, setReviewing] = useState<TrainingRecord | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const canSubmitTraining = currentUser?.role === 'Seafarer' || currentUser?.role === 'System Administrator';
  const canReviewTraining = currentUser?.role === 'System Administrator';
  const visibleRecords = currentUser?.role === 'Seafarer'
    ? records.filter(r => r.seafarer_id === currentUser.id)
    : records;

  const filtered = visibleRecords.filter(r =>
    (r.seafarer.toLowerCase().includes(search.toLowerCase()) || r.course.toLowerCase().includes(search.toLowerCase()) || r.cert_no.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || r.status === statusFilter)
  );

  function handleSave(r: TrainingRecord) {
    setRecords(prev => [r, ...prev]);
    setShowAdd(false);
    setSuccessMsg(`Training record submitted for ${r.seafarer}. Pending verification.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  function handleAction(id: string, action: string, remarks: string) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: action, remarks } : r));
    setSuccessMsg(`Record ${action.toLowerCase()} successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  const statusCounts = {
    all: visibleRecords.length,
    Submitted: visibleRecords.filter(r => r.status === 'Submitted').length,
    Approved: visibleRecords.filter(r => r.status === 'Approved').length,
    Rejected: visibleRecords.filter(r => r.status === 'Rejected').length,
    Expired: visibleRecords.filter(r => r.status === 'Expired').length,
  };

  return (
    <div className="page">
      {showAdd && <TrainingModal onClose={() => setShowAdd(false)} onSave={handleSave} seafarers={mockSeafarers} />}
      {reviewing && <ReviewModal record={reviewing} onClose={() => setReviewing(null)} onAction={handleAction} canApprove={canReviewTraining} />}

      <div className="flex-between page-header">
        <div>
          <div className="page-title">Training Records Management</div>
          <div className="page-subtitle">Manage maritime training certificates and qualifications</div>
        </div>
        {canSubmitTraining && <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Training Record</button>}
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ {successMsg}</div>
      )}

      {/* Workflow banner */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Workflow: Training Record Management</div>
          <div className="workflow">
            {['Add Training Record', 'Upload Certificate', 'Submit for Verification', 'Officer Review', 'Approve / Reject', 'Added to Profile'].map((s, i, arr) => (
              <React.Fragment key={s}>
                <div className={`workflow-step ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`}>{i < 3 ? '✓ ' : ''}{s}</div>
                {i < arr.length - 1 && <span className="workflow-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Records', value: statusCounts.all, color: 'blue', icon: '📋' },
          { label: 'Submitted', value: statusCounts.Submitted, color: 'blue', icon: '📤' },
          { label: 'Approved', value: statusCounts.Approved, color: 'green', icon: '✓' },
          { label: 'Rejected', value: statusCounts.Rejected, color: 'red', icon: '✗' },
          { label: 'Expired', value: statusCounts.Expired, color: 'yellow', icon: '⚠' },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ cursor: 'pointer' }} onClick={() => setStatusFilter(i === 0 ? '' : s.label)}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Training Records {statusFilter && <span className="badge badge-blue" style={{ marginLeft: 8 }}>{statusFilter}</span>}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Search course, seafarer, cert no..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260, padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13 }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13 }}>
              <option value="">All Status</option>
              <option>Submitted</option><option>Approved</option><option>Rejected</option><option>Expired</option>
            </select>
            {statusFilter && <button className="btn btn-secondary btn-sm" onClick={() => setStatusFilter('')}>Clear ×</button>}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Seafarer</th>
                <th>Course</th>
                <th>Institution</th>
                <th>Country</th>
                <th>Cert. No.</th>
                <th>Issue Date</th>
                <th>Expiry</th>
                <th>File</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={11} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📭</div>
                  No training records found
                </td></tr>
              )}
              {filtered.map(r => (
                <tr key={r.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{r.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.seafarer}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{r.seafarer_id}</div>
                  </td>
                  <td style={{ maxWidth: 160 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{r.course}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{r.institution}</td>
                  <td style={{ fontSize: 13 }}>{r.country}</td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.cert_no}</span></td>
                  <td style={{ fontSize: 13 }}>{r.issue_date}</td>
                  <td style={{ fontSize: 13 }}>{r.expiry}</td>
                  <td>
                    {r.cert_file
                      ? <span style={{ color: '#16a34a', fontSize: 12 }}>✓ Uploaded</span>
                      : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge badge-${r.status === 'Approved' ? 'green' : r.status === 'Rejected' ? 'red' : r.status === 'Submitted' ? 'blue' : 'gray'}`}>
                      {r.status}
                    </span>
                    {r.remarks && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{r.remarks}</div>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => setReviewing(r)}>View</button>
                      {canReviewTraining && r.status === 'Submitted' && (
                        <button className="btn btn-success btn-xs" onClick={() => setReviewing(r)}>Review</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: '#64748b' }}>
          <span>Showing {filtered.length} of {visibleRecords.length} records</span>
          <button className="btn btn-secondary btn-sm">⬇ Export</button>
        </div>
      </div>
    </div>
  );
}
