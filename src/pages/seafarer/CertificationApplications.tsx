import React, { useState } from 'react';
import { mockCertifications, mockSeafarers, mockTrainingRecords, mockMedicalRecords, mockSeaService } from '../../mockData';

interface CertApp {
  id: string; seafarer_id: string; seafarer: string;
  cert_type: string; cert_category: string;
  app_date: string; submission_date: string;
  training_ok: boolean; medical_ok: boolean; sea_service_ok: boolean; eligibility: string;
  docs_training: boolean; docs_medical: boolean; docs_sea_service: boolean; docs_passport: boolean;
  status: string; reviewing_officer: string; review_date: string;
  review_remarks: string; rejection_reason: string;
  cert_number?: string; cert_issue?: string; cert_expiry?: string;
}

const CERT_CATEGORIES: Record<string, string[]> = {
  'Basic Safety': ['Personal Survival Techniques', 'Fire Prevention and Fire Fighting', 'Elementary First Aid', 'Personal Safety and Social Responsibilities'],
  'Advanced Safety': ['Advanced Fire Fighting', 'Proficiency in Survival Craft', 'Medical First Aid', 'Medical Care'],
  'Professional': ['Deck Rating Certificate', 'Engine Rating Certificate', 'Able Seafarer Deck', 'Able Seafarer Engine', 'Officer of the Watch (Deck)', 'Officer of the Watch (Engine)', 'Chief Engineer Certificate', 'Master Certificate'],
};

function NewAppModal({ onClose, onSave, seafarers }: { onClose: () => void; onSave: (a: CertApp) => void; seafarers: typeof mockSeafarers }) {
  const [form, setForm] = useState({ seafarer_id: '', cert_category: '', cert_type: '', docs_training: false, docs_medical: false, docs_sea_service: false, docs_passport: false });
  const [errors, setErrors] = useState<any>({});

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); setErrors((e: any) => { const n = { ...e }; delete n[k]; return n; }); }

  const sfTraining = mockTrainingRecords.filter(t => t.seafarer_id === form.seafarer_id && t.status === 'Approved');
  const sfMedical = mockMedicalRecords.filter(m => m.seafarer_id === form.seafarer_id);
  const sfSeaService = mockSeaService.filter(s => s.seafarer_id === form.seafarer_id && s.status === 'Approved');
  const totalDays = sfSeaService.reduce((sum, s) => sum + s.days, 0);

  const training_ok = sfTraining.length > 0;
  const medical_ok = sfMedical.some(m => m.status === 'Fit' || m.status === 'Fit with Restrictions');
  const sea_service_ok = totalDays >= 365;
  const eligibility = training_ok && medical_ok && sea_service_ok ? 'Eligible' : 'Not Eligible';

  function save() {
    const e: any = {};
    if (!form.seafarer_id) e.seafarer_id = 'Required';
    if (!form.cert_category) e.cert_category = 'Required';
    if (!form.cert_type) e.cert_type = 'Required';
    if (!form.docs_training) e.docs_training = 'Required';
    if (!form.docs_medical) e.docs_medical = 'Required';
    if (!form.docs_passport) e.docs_passport = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const sf = seafarers.find(s => s.id === form.seafarer_id);
    const today = new Date().toISOString().slice(0, 10);
    onSave({
      id: `CA-${Date.now()}`, seafarer_id: form.seafarer_id, seafarer: sf?.name || '',
      cert_type: form.cert_type, cert_category: form.cert_category,
      app_date: today, submission_date: today,
      training_ok, medical_ok, sea_service_ok, eligibility,
      docs_training: form.docs_training, docs_medical: form.docs_medical,
      docs_sea_service: form.docs_sea_service, docs_passport: form.docs_passport,
      status: 'Submitted', reviewing_officer: '', review_date: '', review_remarks: '', rejection_reason: '',
    });
  }

  const Err = ({ k }: { k: string }) => errors[k] ? <span style={{ color: '#dc2626', fontSize: 11 }}>{errors[k]}</span> : null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 720 }}>
        <div className="modal-header"><div className="modal-title">📜 New Certification Application</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div className="form-section">
            <div className="form-section-title">Select Seafarer</div>
            <div className="form-group">
              <label>Seafarer <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={form.seafarer_id} onChange={e => set('seafarer_id', e.target.value)} style={errors.seafarer_id ? { borderColor: '#dc2626' } : {}}>
                <option value="">Select seafarer...</option>
                {seafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
              <Err k="seafarer_id" />
            </div>
          </div>

          {form.seafarer_id && (
            <div className="form-section">
              <div className="form-section-title">Automatic Eligibility Check</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                {[
                  { label: 'Training Records', ok: training_ok, detail: `${sfTraining.length} approved record(s)` },
                  { label: 'Medical Certificate', ok: medical_ok, detail: medical_ok ? 'Valid medical certificate' : 'No valid medical record' },
                  { label: 'Sea Service (≥365 days)', ok: sea_service_ok, detail: `${totalDays} approved day(s)` },
                ].map(item => (
                  <div key={item.label} style={{ padding: '12px', borderRadius: 8, background: item.ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${item.ok ? '#86efac' : '#fecaca'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{item.ok ? '✅' : '❌'}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: item.ok ? '#166534' : '#991b1b' }}>{item.label}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: item.ok ? '#15803d' : '#dc2626' }}>{item.detail}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: eligibility === 'Eligible' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${eligibility === 'Eligible' ? '#86efac' : '#fecaca'}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{eligibility === 'Eligible' ? '✅' : '⚠'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: eligibility === 'Eligible' ? '#166534' : '#991b1b' }}>
                    {eligibility === 'Eligible' ? 'Seafarer is eligible to apply' : 'Seafarer does not meet all requirements'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                    {eligibility !== 'Eligible' && 'Complete all requirements before applying'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-section">
            <div className="form-section-title">Certificate Type</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Certificate Category <span style={{ color: '#dc2626' }}>*</span></label>
                <select value={form.cert_category} onChange={e => set('cert_category', e.target.value)} style={errors.cert_category ? { borderColor: '#dc2626' } : {}}>
                  <option value="">Select category...</option>
                  {Object.keys(CERT_CATEGORIES).map(c => <option key={c}>{c}</option>)}
                </select>
                <Err k="cert_category" />
              </div>
              <div className="form-group">
                <label>Certificate Type <span style={{ color: '#dc2626' }}>*</span></label>
                <select value={form.cert_type} onChange={e => set('cert_type', e.target.value)} style={errors.cert_type ? { borderColor: '#dc2626' } : {}} disabled={!form.cert_category}>
                  <option value="">Select certificate...</option>
                  {form.cert_category && CERT_CATEGORIES[form.cert_category]?.map(c => <option key={c}>{c}</option>)}
                </select>
                <Err k="cert_type" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Supporting Documents</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { key: 'docs_training', label: 'Training Certificates', required: true, icon: '🎓' },
                { key: 'docs_medical', label: 'Medical Certificate', required: true, icon: '🏥' },
                { key: 'docs_sea_service', label: 'Sea Service Documents', required: false, icon: '⚓' },
                { key: 'docs_passport', label: 'Passport Copy', required: true, icon: '📘' },
              ].map(doc => {
                const val = (form as any)[doc.key];
                return (
                  <div key={doc.key} onClick={() => set(doc.key, !val)}
                    style={{ border: `2px ${val ? 'solid #86efac' : errors[doc.key] ? 'dashed #fecaca' : 'dashed #cbd5e1'}`, borderRadius: 10, padding: '14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: val ? '#f0fdf4' : errors[doc.key] ? '#fef2f2' : '#f8fafc' }}>
                    <span style={{ fontSize: 22 }}>{doc.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.label}{doc.required && <span style={{ color: '#dc2626' }}> *</span>}</div>
                      <div style={{ fontSize: 11.5, color: val ? '#16a34a' : '#94a3b8', marginTop: 2 }}>{val ? '✓ Attached' : 'Click to attach'}</div>
                    </div>
                    {val && <span style={{ color: '#16a34a', fontSize: 18 }}>✓</span>}
                  </div>
                );
              })}
            </div>
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

function GenerateCertModal({ app, onClose, onGenerate }: { app: CertApp; onClose: () => void; onGenerate: (id: string, certNo: string, issue: string, expiry: string) => void }) {
  const certNo = `CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const issue = new Date().toISOString().slice(0, 10);
  const expiry = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 10);
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: 500 }}>
        <div className="modal-header"><div className="modal-title">📜 Generate Certificate</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div className="alert alert-success">✅ Application approved. Ready to generate certificate.</div>
          <div className="info-grid">
            {[['Seafarer', app.seafarer], ['Certificate Type', app.cert_type], ['Certificate No.', certNo], ['Issue Date', issue], ['Expiry Date', expiry]].map(([k, v]) => (
              <div className="info-item" key={k}><label>{k}</label><div className="info-value" style={{ fontFamily: k === 'Certificate No.' ? 'monospace' : 'inherit' }}>{v}</div></div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#374151' }}>
            🔲 A QR code will be embedded in the digital certificate for public verification.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={() => { onGenerate(app.id, certNo, issue, expiry); onClose(); }}>📜 Generate & Issue Certificate</button>
        </div>
      </div>
    </div>
  );
}

export default function CertificationApplications({ currentUser }: { currentUser?: any }) {
  const [applications, setApplications] = useState<CertApp[]>([
    { id: 'CA-2024-001', seafarer_id: 'SF-2024-0001', seafarer: 'Abebe Girma', cert_type: 'Able Seafarer Deck', cert_category: 'Professional', app_date: '2024-02-01', submission_date: '2024-02-01', training_ok: true, medical_ok: true, sea_service_ok: true, eligibility: 'Eligible', docs_training: true, docs_medical: true, docs_sea_service: true, docs_passport: true, status: 'Approved', reviewing_officer: 'Berhane Tadesse', review_date: '2024-02-05', review_remarks: 'All requirements met', rejection_reason: '' },
    { id: 'CA-2024-002', seafarer_id: 'SF-2024-0002', seafarer: 'Tigist Haile', cert_type: 'Officer of the Watch (Deck)', cert_category: 'Professional', app_date: '2024-02-20', submission_date: '2024-02-20', training_ok: true, medical_ok: true, sea_service_ok: true, eligibility: 'Eligible', docs_training: true, docs_medical: true, docs_sea_service: true, docs_passport: true, status: 'Submitted', reviewing_officer: '', review_date: '', review_remarks: '', rejection_reason: '' },
    { id: 'CA-2024-003', seafarer_id: 'SF-2024-0004', seafarer: 'Hana Tesfaye', cert_type: 'Elementary First Aid', cert_category: 'Basic Safety', app_date: '2024-03-10', submission_date: '2024-03-10', training_ok: true, medical_ok: false, sea_service_ok: false, eligibility: 'Not Eligible', docs_training: true, docs_medical: false, docs_sea_service: false, docs_passport: true, status: 'Pending Additional Documents', reviewing_officer: 'Berhane Tadesse', review_date: '2024-03-12', review_remarks: 'Medical certificate missing', rejection_reason: '' },
  ]);
  const [certs, setCerts] = useState(mockCertifications.map(c => ({ ...c })));
  const [tab, setTab] = useState('applications');
  const [showNew, setShowNew] = useState(false);
  const [reviewing, setReviewing] = useState<CertApp | null>(null);
  const [generating, setGenerating] = useState<CertApp | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const canSubmitCertification = currentUser?.role === 'Seafarer' || currentUser?.role === 'System Administrator';
  const canReviewCertification = currentUser?.role === 'System Administrator';
  const visibleApplications = currentUser?.role === 'Seafarer'
    ? applications.filter(a => a.seafarer_id === currentUser.id)
    : applications;
  const visibleCerts = currentUser?.role === 'Seafarer'
    ? certs.filter(c => c.seafarer_id === currentUser.id)
    : certs;

  function handleSave(a: CertApp) { setApplications(prev => [a, ...prev]); setShowNew(false); setSuccessMsg('Application submitted successfully.'); setTimeout(() => setSuccessMsg(''), 4000); }

  function handleReview(id: string, action: string) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: action, review_remarks: reviewRemarks, review_date: new Date().toISOString().slice(0, 10), reviewing_officer: currentUser?.full_name || 'Officer' } : a));
    setReviewing(null); setReviewRemarks('');
    setSuccessMsg(`Application ${action.toLowerCase()}.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function handleGenerate(id: string, certNo: string, issue: string, expiry: string) {
    const app = applications.find(a => a.id === id)!;
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Certificate Issued', cert_number: certNo, cert_issue: issue, cert_expiry: expiry } : a));
    setCerts(prev => [{ id: `C-${Date.now()}`, seafarer_id: app.seafarer_id, seafarer: app.seafarer, type: app.cert_type, cert_no: certNo, issue, expiry, status: 'Active' }, ...prev]);
    setSuccessMsg(`Certificate ${certNo} issued successfully.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  const statusColor: Record<string, string> = { 'Submitted': 'blue', 'Approved': 'green', 'Rejected': 'red', 'Certificate Issued': 'teal', 'Pending Additional Documents': 'yellow' };

  return (
    <div className="page">
      {showNew && <NewAppModal onClose={() => setShowNew(false)} onSave={handleSave} seafarers={mockSeafarers} />}
      {generating && <GenerateCertModal app={generating} onClose={() => setGenerating(null)} onGenerate={handleGenerate} />}

      <div className="flex-between page-header">
        <div><div className="page-title">Certification Management</div><div className="page-subtitle">Apply for, review, and issue maritime certificates</div></div>
        {canSubmitCertification && <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Application</button>}
      </div>

      {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Certification Workflow</div>
          <div className="workflow">
            {['Select Certificate Type', 'Eligibility Validation', 'Upload Documents', 'Officer Review', 'Approve / Reject', 'Certificate Generation', 'Certificate Issuance'].map((s, i, arr) => (
              <React.Fragment key={s}>
                <div className={`workflow-step ${i < 3 ? 'done' : i === 3 ? 'active' : ''}`}>{i < 3 ? '✓ ' : ''}{s}</div>
                {i < arr.length - 1 && <span className="workflow-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab${tab === 'applications' ? ' active' : ''}`} onClick={() => setTab('applications')}>📋 Applications ({visibleApplications.length})</div>
        <div className={`tab${tab === 'certificates' ? ' active' : ''}`} onClick={() => setTab('certificates')}>📜 Certificates ({visibleCerts.length})</div>
      </div>

      {tab === 'applications' && (
        <div className="card">
          <div className="card-header"><div className="card-title">Certificate Applications</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px' }}>
            {visibleApplications.map(app => (
              <div key={app.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#1e40af', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{app.seafarer.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{app.cert_type}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{app.id} · {app.seafarer} · {app.cert_category} · Applied: {app.app_date}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${statusColor[app.status] || 'gray'}`}>{app.status}</span>
                </div>
                <div style={{ padding: '12px 18px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>ELIGIBILITY CHECK</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[['Training', app.training_ok], ['Medical', app.medical_ok], ['Sea Service', app.sea_service_ok]].map(([l, ok]) => (
                        <span key={String(l)} className={`badge badge-${ok ? 'green' : 'red'}`} style={{ fontSize: 11 }}>{ok ? '✓' : '✗'} {l}</span>
                      ))}
                      <span className={`badge badge-${app.eligibility === 'Eligible' ? 'green' : 'red'}`} style={{ fontSize: 11 }}>{app.eligibility}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>DOCUMENTS</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[['Training', app.docs_training], ['Medical', app.docs_medical], ['Sea Service', app.docs_sea_service], ['Passport', app.docs_passport]].map(([l, ok]) => (
                        <span key={String(l)} className={`badge badge-${ok ? 'green' : 'gray'}`} style={{ fontSize: 11 }}>{ok ? '✓' : '○'} {l}</span>
                      ))}
                    </div>
                  </div>
                  {app.review_remarks && (
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>OFFICER REMARKS</div>
                      <div style={{ fontSize: 12.5 }}>{app.review_remarks}</div>
                    </div>
                  )}
                  {app.cert_number && (
                    <div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>CERTIFICATE</div>
                      <div style={{ fontSize: 12.5, fontFamily: 'monospace' }}>{app.cert_number} · Issued: {app.cert_issue} · Expires: {app.cert_expiry}</div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 18px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
                  {canReviewCertification && app.status === 'Submitted' && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => setReviewing(app)}>✓ Review & Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setReviewing(app)}>✗ Reject</button>
                      <button className="btn btn-warning btn-sm" onClick={() => { handleReview(app.id, 'Pending Additional Documents'); }}>📎 Request More Docs</button>
                    </>
                  )}
                  {canReviewCertification && app.status === 'Approved' && !app.cert_number && (
                    <button className="btn btn-primary btn-sm" onClick={() => setGenerating(app)}>📜 Generate Certificate</button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => setReviewing(app)}>View Details</button>
                </div>
              </div>
            ))}
          </div>

          {/* Review panel */}
          {reviewing && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
              <div style={{ background: '#fff', borderRadius: 12, width: 600, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Review Application — {reviewing.cert_type}</div>
                  <button style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} onClick={() => setReviewing(null)}>×</button>
                </div>
                <div style={{ padding: 22 }}>
                  <div className="info-grid" style={{ marginBottom: 16 }}>
                    {[['App ID', reviewing.id], ['Seafarer', reviewing.seafarer], ['Certificate Type', reviewing.cert_type], ['Category', reviewing.cert_category], ['Applied', reviewing.app_date], ['Eligibility', reviewing.eligibility]].map(([k, v]) => (
                      <div className="info-item" key={k}><label>{k}</label>
                        <div className="info-value">{k === 'Eligibility' ? <span className={`badge badge-${v === 'Eligible' ? 'green' : 'red'}`}>{v}</span> : v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>Officer Remarks / Decision Notes</label>
                    <textarea value={reviewRemarks} onChange={e => setReviewRemarks(e.target.value)} placeholder="Enter review notes or rejection reason..." rows={3} />
                  </div>
                </div>
                <div style={{ padding: '16px 22px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setReviewing(null)}>Close</button>
                  {canReviewCertification && reviewing.status === 'Submitted' && <>
                    <button className="btn btn-danger" onClick={() => handleReview(reviewing.id, 'Rejected')}>✗ Reject</button>
                    <button className="btn btn-success" onClick={() => handleReview(reviewing.id, 'Approved')}>✓ Approve</button>
                  </>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'certificates' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Issued Certificates ({visibleCerts.length})</div>
            <button className="btn btn-secondary btn-sm">⬇ Export</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Seafarer</th><th>Certificate Type</th><th>Cert. Number</th><th>Issue Date</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {visibleCerts.map(c => (
                  <tr key={c.id}>
                    <td><div style={{ fontWeight: 500 }}>{c.seafarer}</div><div style={{ fontSize: 11, color: '#64748b' }}>{c.seafarer_id}</div></td>
                    <td>{c.type}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.cert_no}</span></td>
                    <td>{c.issue}</td>
                    <td>{c.expiry}</td>
                    <td><span className={`badge badge-${c.status === 'Active' ? 'green' : c.status === 'Expiring Soon' ? 'yellow' : 'red'}`}>{c.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-xs">View</button>
                        <button className="btn btn-secondary btn-xs">🖨 Print</button>
                        {canReviewCertification && <button className="btn btn-danger btn-xs">Revoke</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
