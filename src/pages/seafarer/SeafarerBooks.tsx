import React, { useState } from 'react';
import { mockSeafarers } from '../../mockData';

interface SeafarerBook {
  id: string; seafarer_id: string; seafarer: string;
  book_number: string; book_type: string;
  request_type: string; reason: string;
  apply_date: string; issue_date: string; expiry_date: string;
  status: string; current_step: number;
  reviewing_officer: string; review_date: string; remarks: string;
  passport_copy: boolean; photo: boolean; previous_book: boolean; fee_receipt: boolean;
}

const BOOK_TYPES = ["Seafarer's Book (Standard)", "Seafarer's Book (Duplicate)", "Seafarer's Book (Renewal)", "Seafarer's Book (Replacement)"];
const REQUEST_TYPES = ['New Issuance', 'Renewal', 'Replacement (Lost)', 'Replacement (Damaged)', 'Replacement (Expired)'];
const WORKFLOW_STEPS = ['Application', 'Document Review', 'Payment', 'Officer Review', 'Approval', 'Printing', 'Issuance'];

function NewBookModal({ onClose, onSave }: { onClose: () => void; onSave: (b: SeafarerBook) => void }) {
  const [form, setForm] = useState({
    seafarer_id: '', book_type: '', request_type: '', reason: '',
    passport_copy: false, photo: false, previous_book: false, fee_receipt: false,
  });
  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState(1);

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); setErrors((e: any) => { const n = { ...e }; delete n[k]; return n; }); }

  function validateStep1() {
    const e: any = {};
    if (!form.seafarer_id) e.seafarer_id = 'Required';
    if (!form.request_type) e.request_type = 'Required';
    if (!form.book_type) e.book_type = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: any = {};
    if (!form.passport_copy) e.passport_copy = 'Required';
    if (!form.photo) e.photo = 'Required';
    if (!form.fee_receipt) e.fee_receipt = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  }

  function save() {
    if (!validateStep2()) return;
    const sf = mockSeafarers.find(s => s.id === form.seafarer_id);
    const today = new Date().toISOString().slice(0, 10);
    const expiry = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 10);
    const bookNo = `SB-ETH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    onSave({
      id: `BK-${Date.now()}`, seafarer_id: form.seafarer_id, seafarer: sf?.name || '',
      book_number: bookNo, book_type: form.book_type, request_type: form.request_type,
      reason: form.reason, apply_date: today, issue_date: '', expiry_date: expiry,
      status: 'Submitted', current_step: 0,
      reviewing_officer: '', review_date: '', remarks: '',
      passport_copy: form.passport_copy, photo: form.photo,
      previous_book: form.previous_book, fee_receipt: form.fee_receipt,
    });
  }

  const Err = ({ k }: { k: string }) => errors[k] ? <span style={{ color: '#dc2626', fontSize: 11 }}>{errors[k]}</span> : null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 680 }}>
        <div className="modal-header"><div className="modal-title">📕 New Seafarer's Book Request</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 0 }}>
          {['Seafarer & Type', 'Documents', 'Review'].map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step > i + 1 ? '#16a34a' : step === i + 1 ? '#1e40af' : '#e2e8f0', color: step >= i + 1 ? '#fff' : '#94a3b8' }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12.5, color: step === i + 1 ? '#1e40af' : step > i + 1 ? '#16a34a' : '#94a3b8', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? '#86efac' : '#e2e8f0', marginLeft: 4 }} />}
            </div>
          ))}
        </div>
        <div className="modal-body">
          {step === 1 && (
            <>
              <div className="form-section">
                <div className="form-section-title">Seafarer Information</div>
                <div className="form-group">
                  <label>Seafarer <span style={{ color: '#dc2626' }}>*</span></label>
                  <select value={form.seafarer_id} onChange={e => set('seafarer_id', e.target.value)} style={errors.seafarer_id ? { borderColor: '#dc2626' } : {}}>
                    <option value="">Select seafarer...</option>
                    {mockSeafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                  <Err k="seafarer_id" />
                </div>
              </div>
              <div className="form-section">
                <div className="form-section-title">Book Request Details</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Request Type <span style={{ color: '#dc2626' }}>*</span></label>
                    <select value={form.request_type} onChange={e => set('request_type', e.target.value)} style={errors.request_type ? { borderColor: '#dc2626' } : {}}>
                      <option value="">Select type...</option>
                      {REQUEST_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <Err k="request_type" />
                  </div>
                  <div className="form-group">
                    <label>Book Type <span style={{ color: '#dc2626' }}>*</span></label>
                    <select value={form.book_type} onChange={e => set('book_type', e.target.value)} style={errors.book_type ? { borderColor: '#dc2626' } : {}}>
                      <option value="">Select book type...</option>
                      {BOOK_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <Err k="book_type" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Reason / Additional Notes</label>
                  <textarea value={form.reason} onChange={e => set('reason', e.target.value)} rows={2} placeholder="If replacement/renewal, please state the reason..." />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="form-section">
              <div className="form-section-title">Upload Required Documents</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { key: 'passport_copy', label: 'Passport Copy', required: true, icon: '📘' },
                  { key: 'photo', label: 'Recent Passport Photo', required: true, icon: '🖼' },
                  { key: 'previous_book', label: "Previous Seafarer's Book", required: false, icon: '📕' },
                  { key: 'fee_receipt', label: 'Fee Payment Receipt', required: true, icon: '🧾' },
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
              {(errors.passport_copy || errors.photo || errors.fee_receipt) && (
                <div style={{ marginTop: 10, color: '#dc2626', fontSize: 12 }}>Please attach all required documents before continuing.</div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="form-section">
              <div className="form-section-title">Application Summary</div>
              <div className="info-grid">
                {[
                  ['Seafarer', mockSeafarers.find(s => s.id === form.seafarer_id)?.name],
                  ['Request Type', form.request_type], ['Book Type', form.book_type],
                  ['Reason', form.reason || 'N/A'],
                ].map(([k, v]) => (
                  <div className="info-item" key={k as string}><label>{k}</label><div className="info-value">{v}</div></div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Documents</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {([['Passport', form.passport_copy], ['Photo', form.photo], ["Previous Book", form.previous_book], ['Fee Receipt', form.fee_receipt]] as [string, boolean][]).map(([l, ok]) => (
                    <span key={l} className={`badge badge-${ok ? 'green' : 'gray'}`}>{ok ? '✓' : '○'} {l}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {step < 3
            ? <button className="btn btn-primary" onClick={() => { if (step === 1 && !validateStep1()) return; if (step === 2 && !validateStep2()) return; setStep(s => s + 1); }}>Next →</button>
            : <button className="btn btn-primary" onClick={save}>📕 Submit Application</button>}
        </div>
      </div>
    </div>
  );
}

function BookReviewModal({ book, onClose, onAction, currentUser }: { book: SeafarerBook; onClose: () => void; onAction: (id: string, action: string, remarks: string) => void; currentUser?: any }) {
  const [remarks, setRemarks] = useState('');
  const canProcessBook = currentUser?.role === 'System Administrator';
  const nextActions: Record<string, string[]> = {
    'Submitted': ['Approve Documents', 'Request Correction'],
    'Documents Approved': ['Approve', 'Reject'],
    'Approved': ['Mark as Printed'],
    'Printed': ['Mark as Issued'],
  };
  const actions = nextActions[book.status] || [];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 580 }}>
        <div className="modal-header"><div className="modal-title">📕 Book Application Details</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {WORKFLOW_STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: book.current_step > i ? '#16a34a' : book.current_step === i ? '#1e40af' : '#e2e8f0', color: book.current_step >= i ? '#fff' : '#94a3b8' }}>
                      {book.current_step > i ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: 11, color: book.current_step === i ? '#1e40af' : book.current_step > i ? '#16a34a' : '#94a3b8' }}>{s}</span>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && <span style={{ color: '#cbd5e1', fontSize: 12 }}>›</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="info-grid">
            {([['Book Number', book.book_number], ['Seafarer', book.seafarer], ['Request Type', book.request_type], ['Book Type', book.book_type], ['Applied', book.apply_date], ['Status', book.status]] as [string, string][]).map(([k, v]) => (
              <div className="info-item" key={k}><label>{k}</label>
                <div className="info-value">{k === 'Status' ? <span className={`badge badge-${v === 'Issued' ? 'green' : v === 'Rejected' ? 'red' : 'blue'}`}>{v}</span> : v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>DOCUMENTS</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {([['Passport', book.passport_copy], ['Photo', book.photo], ["Previous Book", book.previous_book], ['Fee Receipt', book.fee_receipt]] as [string, boolean][]).map(([l, ok]) => (
                <span key={l} className={`badge badge-${ok ? 'green' : 'gray'}`}>{ok ? '✓' : '○'} {l}</span>
              ))}
            </div>
          </div>
          {canProcessBook && actions.length > 0 && (
            <div className="form-group" style={{ marginTop: 14 }}>
              <label>Remarks</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} placeholder="Add officer remarks..." />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {canProcessBook && actions.map(action => (
            <button key={action} className={`btn ${action.includes('Reject') || action.includes('Correction') ? 'btn-danger' : 'btn-success'} btn-sm`}
              onClick={() => { onAction(book.id, action, remarks); onClose(); }}>
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SeafarerBooks({ currentUser }: { currentUser?: any }) {
  const [books, setBooks] = useState<SeafarerBook[]>([
    { id: 'BK-001', seafarer_id: 'SF-2024-0001', seafarer: 'Abebe Girma', book_number: 'SB-ETH-2024-10001', book_type: "Seafarer's Book (Standard)", request_type: 'New Issuance', reason: '', apply_date: '2024-01-15', issue_date: '2024-01-22', expiry_date: '2029-01-22', status: 'Issued', current_step: 6, reviewing_officer: 'Berhane T.', review_date: '2024-01-18', remarks: '', passport_copy: true, photo: true, previous_book: false, fee_receipt: true },
    { id: 'BK-002', seafarer_id: 'SF-2024-0002', seafarer: 'Tigist Haile', book_number: 'SB-ETH-2024-10002', book_type: "Seafarer's Book (Standard)", request_type: 'Renewal', reason: 'Book expired', apply_date: '2024-03-05', issue_date: '', expiry_date: '2029-03-05', status: 'Submitted', current_step: 0, reviewing_officer: '', review_date: '', remarks: '', passport_copy: true, photo: true, previous_book: true, fee_receipt: true },
    { id: 'BK-003', seafarer_id: 'SF-2024-0003', seafarer: 'Solomon Bekele', book_number: 'SB-ETH-2024-10003', book_type: "Seafarer's Book (Standard)", request_type: 'New Issuance', reason: '', apply_date: '2024-02-20', issue_date: '', expiry_date: '2029-02-20', status: 'Approved', current_step: 4, reviewing_officer: 'Alem M.', review_date: '2024-02-24', remarks: 'Documents verified', passport_copy: true, photo: true, previous_book: false, fee_receipt: true },
    { id: 'BK-004', seafarer_id: 'SF-2024-0004', seafarer: 'Hana Tesfaye', book_number: 'SB-ETH-2024-10004', book_type: "Seafarer's Book (Replacement)", request_type: 'Replacement (Lost)', reason: 'Book lost at sea', apply_date: '2024-03-12', issue_date: '', expiry_date: '2029-03-12', status: 'Documents Approved', current_step: 2, reviewing_officer: 'Berhane T.', review_date: '2024-03-14', remarks: 'Police report attached', passport_copy: true, photo: true, previous_book: false, fee_receipt: true },
  ]);
  const [showNew, setShowNew] = useState(false);
  const [reviewing, setReviewing] = useState<SeafarerBook | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const canSubmitBook = currentUser?.role === 'Seafarer' || currentUser?.role === 'System Administrator';
  const canProcessBook = currentUser?.role === 'System Administrator';
  const visibleBooks = currentUser?.role === 'Seafarer'
    ? books.filter(b => b.seafarer_id === currentUser.id)
    : books;

  const statusFlow: Record<string, { next: string; step: number }> = {
    'Approve Documents': { next: 'Documents Approved', step: 1 },
    'Request Correction': { next: 'Pending Correction', step: 0 },
    'Approve': { next: 'Approved', step: 4 },
    'Reject': { next: 'Rejected', step: 0 },
    'Mark as Printed': { next: 'Printed', step: 5 },
    'Mark as Issued': { next: 'Issued', step: 6 },
  };

  function handleAction(id: string, action: string, remarks: string) {
    const flow = statusFlow[action];
    setBooks(prev => prev.map(b => b.id === id ? {
      ...b, status: flow?.next || b.status, current_step: flow?.step ?? b.current_step,
      remarks, reviewing_officer: currentUser?.full_name || 'Officer', review_date: new Date().toISOString().slice(0, 10),
      ...(flow?.next === 'Issued' ? { issue_date: new Date().toISOString().slice(0, 10) } : {}),
    } : b));
    setSuccessMsg(`Application ${action.toLowerCase()} successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function handleSave(b: SeafarerBook) { setBooks(prev => [b, ...prev]); setShowNew(false); setSuccessMsg('Book application submitted.'); setTimeout(() => setSuccessMsg(''), 4000); }

  const filtered = visibleBooks.filter(b =>
    (statusFilter === 'All' || b.status === statusFilter) &&
    (b.seafarer.toLowerCase().includes(search.toLowerCase()) || b.book_number.includes(search))
  );

  const statusColor: Record<string, string> = { 'Issued': 'green', 'Rejected': 'red', 'Approved': 'teal', 'Submitted': 'blue', 'Documents Approved': 'blue', 'Printed': 'yellow', 'Pending Correction': 'yellow' };
  const statuses = ['All', ...Array.from(new Set(books.map(b => b.status)))];

  return (
    <div className="page">
      {showNew && <NewBookModal onClose={() => setShowNew(false)} onSave={handleSave} />}
      {reviewing && <BookReviewModal book={reviewing} onClose={() => setReviewing(null)} onAction={handleAction} currentUser={currentUser} />}

      <div className="flex-between page-header">
        <div><div className="page-title">Seafarer's Books</div><div className="page-subtitle">Manage seafarer book issuance, renewal, and replacement requests</div></div>
        {canSubmitBook && <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Book Request</button>}
      </div>

      {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

      <div className="stats-row">
        {[
          { label: 'Total', value: visibleBooks.length, color: '#1e40af', filter: 'All' },
          { label: 'Issued', value: visibleBooks.filter(b => b.status === 'Issued').length, color: '#16a34a', filter: 'Issued' },
          { label: 'In Progress', value: visibleBooks.filter(b => !['Issued', 'Rejected'].includes(b.status)).length, color: '#b45309', filter: 'All' },
          { label: 'Rejected', value: visibleBooks.filter(b => b.status === 'Rejected').length, color: '#dc2626', filter: 'Rejected' },
        ].map(s => (
          <div key={s.label} className="stat-card" onClick={() => setStatusFilter(s.filter)} style={{ cursor: 'pointer' }}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '14px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Issuance Workflow</div>
          <div className="workflow">
            {WORKFLOW_STEPS.map((s, i, arr) => (
              <React.Fragment key={s}>
                <div className={`workflow-step ${i < 2 ? 'done' : i === 2 ? 'active' : ''}`}>{i < 2 ? '✓ ' : ''}{s}</div>
                {i < arr.length - 1 && <span className="workflow-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Book Applications</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="search-input" placeholder="Search by name or book number..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ fontSize: 13, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Book Number</th><th>Seafarer</th><th>Request Type</th><th>Applied</th><th>Progress</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{b.book_number}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{b.seafarer}</div><div style={{ fontSize: 11, color: '#64748b' }}>{b.book_type}</div></td>
                  <td>{b.request_type}</td>
                  <td>{b.apply_date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      {WORKFLOW_STEPS.map((_, i) => (
                        <div key={i} style={{ width: 18, height: 6, borderRadius: 3, background: b.current_step > i ? '#16a34a' : b.current_step === i ? '#3b82f6' : '#e2e8f0' }} title={WORKFLOW_STEPS[i]} />
                      ))}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>Step {Math.min(b.current_step + 1, WORKFLOW_STEPS.length)}/{WORKFLOW_STEPS.length}</div>
                  </td>
                  <td><span className={`badge badge-${statusColor[b.status] || 'gray'}`}>{b.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => setReviewing(b)}>View</button>
                      {canProcessBook && ['Submitted', 'Documents Approved', 'Approved', 'Printed'].includes(b.status) && (
                        <button className="btn btn-primary btn-xs" onClick={() => setReviewing(b)}>Process</button>
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
