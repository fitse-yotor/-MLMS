import React, { useState } from 'react';
import { mockExamApplications, mockMedicalRecords, mockSeaService, mockSeafarers, mockTrainingRecords } from '../../mockData';

type ExamApplication = {
  id: string;
  seafarer_id: string;
  candidate: string;
  exam_type: string;
  category: string;
  app_date: string;
  preferred_date: string;
  eligibility: string;
  status: string;
  training_ok?: boolean;
  medical_ok?: boolean;
  sea_service_ok?: boolean;
  documents?: string[];
  review_remarks?: string;
};

const examTypes = [
  { name: 'Able Seafarer Deck', category: 'Deck' },
  { name: 'Deck Officer', category: 'Deck' },
  { name: 'Basic Safety', category: 'Safety' },
  { name: 'Marine Engineer', category: 'Engine' },
];

function eligibilityFor(seafarerId: string) {
  const training_ok = mockTrainingRecords.some(t => t.seafarer_id === seafarerId && t.status === 'Approved');
  const medical_ok = mockMedicalRecords.some(m => m.seafarer_id === seafarerId && (m.status === 'Fit' || m.status === 'Fit with Restrictions') && m.verified === 'Approved');
  const seaDays = mockSeaService.filter(s => s.seafarer_id === seafarerId && s.status === 'Approved').reduce((sum, s) => sum + s.days, 0);
  const sea_service_ok = seaDays >= 180;
  return { training_ok, medical_ok, sea_service_ok, eligibility: training_ok && medical_ok && sea_service_ok ? 'Eligible' : 'Pending' };
}

function NewApplicationModal({ currentUser, onClose, onSave }: { currentUser?: any; onClose: () => void; onSave: (app: ExamApplication) => void }) {
  const defaultSeafarer = currentUser?.role === 'Seafarer' ? currentUser.id : '';
  const [form, setForm] = useState({ seafarer_id: defaultSeafarer, exam_type: '', preferred_date: '', training: false, medical: false, sea: false, passport: false, national: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedExam = examTypes.find(e => e.name === form.exam_type);
  const check = form.seafarer_id ? eligibilityFor(form.seafarer_id) : null;

  function set(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function save() {
    const nextErrors: Record<string, string> = {};
    if (!form.seafarer_id) nextErrors.seafarer_id = 'Required';
    if (!form.exam_type) nextErrors.exam_type = 'Required';
    if (!form.preferred_date) nextErrors.preferred_date = 'Required';
    if (!form.training) nextErrors.training = 'Required';
    if (!form.medical) nextErrors.medical = 'Required';
    if (!form.passport) nextErrors.passport = 'Required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const sf = mockSeafarers.find(s => s.id === form.seafarer_id);
    const today = new Date().toISOString().slice(0, 10);
    onSave({
      id: `EA-${Date.now()}`,
      seafarer_id: form.seafarer_id,
      candidate: sf?.name || currentUser?.full_name || 'Candidate',
      exam_type: form.exam_type,
      category: selectedExam?.category || 'General',
      app_date: today,
      preferred_date: form.preferred_date,
      eligibility: check?.eligibility || 'Pending',
      status: 'Under Review',
      training_ok: check?.training_ok,
      medical_ok: check?.medical_ok,
      sea_service_ok: check?.sea_service_ok,
      documents: ['Training Certificate', 'Medical Certificate', form.sea ? 'Sea Service Record' : '', 'Passport Copy', form.national ? 'National ID Copy' : ''].filter(Boolean),
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">New Exam Application</div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Candidate</label>
              <select value={form.seafarer_id} disabled={currentUser?.role === 'Seafarer'} onChange={e => set('seafarer_id', e.target.value)}>
                <option value="">Select candidate</option>
                {mockSeafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
              {errors.seafarer_id && <span className="field-error">{errors.seafarer_id}</span>}
            </div>
            <div className="form-group">
              <label>Exam Type</label>
              <select value={form.exam_type} onChange={e => set('exam_type', e.target.value)}>
                <option value="">Select exam</option>
                {examTypes.map(e => <option key={e.name}>{e.name}</option>)}
              </select>
              {errors.exam_type && <span className="field-error">{errors.exam_type}</span>}
            </div>
            <div className="form-group">
              <label>Preferred Exam Date</label>
              <input type="date" value={form.preferred_date} onChange={e => set('preferred_date', e.target.value)} />
              {errors.preferred_date && <span className="field-error">{errors.preferred_date}</span>}
            </div>
            <div className="form-group">
              <label>Exam Category</label>
              <input value={selectedExam?.category || ''} readOnly placeholder="Auto-filled from exam type" />
            </div>
          </div>

          {check && (
            <div className="exam-check-grid">
              {[
                ['Training Requirement', check.training_ok],
                ['Medical Requirement', check.medical_ok],
                ['Sea Service Requirement', check.sea_service_ok],
              ].map(([label, ok]) => (
                <div key={String(label)} className={`exam-check ${ok ? 'ok' : 'warn'}`}>
                  <strong>{ok ? 'Pass' : 'Review'}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="form-section-title">Supporting Documents</div>
          <div className="doc-grid">
            {([
              ['training', 'Training Certificate', true],
              ['medical', 'Medical Certificate', true],
              ['sea', 'Sea Service Record', false],
              ['passport', 'Passport Copy', true],
              ['national', 'National ID Copy', false],
            ] as Array<[string, string, boolean]>).map(([key, label, required]) => (
              <button key={String(key)} type="button" className={`doc-tile ${(form as any)[key] ? 'selected' : ''} ${errors[String(key)] ? 'error' : ''}`} onClick={() => set(String(key), !(form as any)[key])}>
                <span>{(form as any)[key] ? 'Attached' : 'Attach'}</span>
                <strong>{label}{required ? ' *' : ''}</strong>
              </button>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Submit Application</button>
        </div>
      </div>
    </div>
  );
}

export default function ExamApplications({ currentUser }: { currentUser?: any }) {
  const [applications, setApplications] = useState<ExamApplication[]>(mockExamApplications.map(a => ({ ...a })));
  const [filter, setFilter] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<ExamApplication | null>(null);
  const [message, setMessage] = useState('');
  const visibleApplications = currentUser?.role === 'Seafarer'
    ? applications.filter(e => e.seafarer_id === currentUser.id)
    : applications;
  const canSubmitExamApplication = currentUser?.role === 'Seafarer' || currentUser?.role === 'System Administrator';
  const canReviewExamApplication = currentUser?.role === 'System Administrator';
  const filtered = visibleApplications.filter(e =>
    e.candidate.toLowerCase().includes(filter.toLowerCase()) || e.exam_type.toLowerCase().includes(filter.toLowerCase())
  );

  function addApplication(app: ExamApplication) {
    setApplications(prev => [app, ...prev]);
    setShowNew(false);
    setMessage('Exam application submitted and sent for officer review.');
    setTimeout(() => setMessage(''), 3500);
  }

  function review(id: string, status: string, remarks: string) {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status, review_remarks: remarks } : app));
    setMessage(`Application ${status.toLowerCase()}.`);
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="page">
      {showNew && <NewApplicationModal currentUser={currentUser} onClose={() => setShowNew(false)} onSave={addApplication} />}
      {selected && (
        <div className="modal-overlay" onClick={e => e.currentTarget === e.target && setSelected(null)}>
          <div className="modal" style={{ width: 760 }}>
            <div className="modal-header"><div className="modal-title">Application Detail</div><button className="modal-close" onClick={() => setSelected(null)}>x</button></div>
            <div className="modal-body">
              <div className="info-grid">
                {[
                  ['Application Number', selected.id],
                  ['Seafarer ID', selected.seafarer_id],
                  ['Candidate Name', selected.candidate],
                  ['Exam Type', selected.exam_type],
                  ['Exam Category', selected.category],
                  ['Preferred Date', selected.preferred_date],
                  ['Eligibility', selected.eligibility],
                  ['Status', selected.status],
                ].map(([k, v]) => <div className="info-item" key={k}><label>{k}</label><div className="info-value">{v}</div></div>)}
              </div>
              <hr className="divider" />
              <div className="exam-check-grid">
                {[
                  ['Training Requirement', selected.training_ok ?? selected.eligibility === 'Eligible'],
                  ['Medical Requirement', selected.medical_ok ?? selected.eligibility === 'Eligible'],
                  ['Sea Service Requirement', selected.sea_service_ok ?? selected.eligibility === 'Eligible'],
                ].map(([label, ok]) => <div key={String(label)} className={`exam-check ${ok ? 'ok' : 'warn'}`}><strong>{ok ? 'Pass' : 'Review'}</strong><span>{label}</span></div>)}
              </div>
              <div style={{ marginTop: 16 }}><strong>Documents:</strong> {(selected.documents || ['Training Certificate', 'Medical Certificate', 'Passport Copy']).join(', ')}</div>
              {selected.review_remarks && <div className="alert alert-info" style={{ marginTop: 16 }}>{selected.review_remarks}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="flex-between page-header">
        <div><div className="page-title">Exam Applications</div><div className="page-subtitle">Apply for examinations and manage eligibility review</div></div>
        {canSubmitExamApplication && <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Application</button>}
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="workflow" style={{ marginBottom: 20 }}>
        {['Select Exam Type', 'Upload Documents', 'Eligibility Check', 'Officer Review', 'Approve / Reject', 'Candidate Scheduling'].map((s, i, arr) => (
          <React.Fragment key={s}>
            <div className={`workflow-step ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`}>{s}</div>
            {i < arr.length - 1 && <span className="workflow-arrow">-&gt;</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Applications', value: visibleApplications.length, color: 'blue' },
          { label: 'Approved', value: visibleApplications.filter(e => e.status === 'Approved').length, color: 'green' },
          { label: 'Under Review', value: visibleApplications.filter(e => e.status === 'Under Review').length, color: 'yellow' },
          { label: 'Eligible', value: visibleApplications.filter(e => e.eligibility === 'Eligible').length, color: 'teal' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>#</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Applications ({filtered.length})</div>
          <input placeholder="Search..." value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 220 }} />
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Application ID</th><th>Candidate</th><th>Exam Type</th><th>Category</th><th>Date</th><th>Preferred Date</th><th>Eligibility</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.id}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{e.candidate}</div><div style={{ fontSize: 11, color: '#64748b' }}>{e.seafarer_id}</div></td>
                  <td>{e.exam_type}</td>
                  <td>{e.category}</td>
                  <td>{e.app_date}</td>
                  <td>{e.preferred_date}</td>
                  <td><span className={`badge badge-${e.eligibility === 'Eligible' ? 'green' : 'yellow'}`}>{e.eligibility}</span></td>
                  <td><span className={`badge badge-${e.status === 'Approved' ? 'green' : e.status === 'Rejected' ? 'red' : 'yellow'}`}>{e.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {canReviewExamApplication && e.status === 'Under Review' && <>
                        <button className="btn btn-success btn-xs" onClick={() => review(e.id, 'Approved', 'Application approved for scheduling.')}>Approve</button>
                        <button className="btn btn-danger btn-xs" onClick={() => review(e.id, 'Rejected', 'Application rejected. Requirements not fully satisfied.')}>Reject</button>
                      </>}
                      <button className="btn btn-secondary btn-xs" onClick={() => setSelected(e)}>View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="empty-state"><p>No exam applications found.</p></div>}
        </div>
      </div>
    </div>
  );
}
