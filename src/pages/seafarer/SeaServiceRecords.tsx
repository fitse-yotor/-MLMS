import React, { useState } from 'react';
import { mockSeaService, mockSeafarers } from '../../mockData';

interface SeaServiceRecord {
  id: string; seafarer_id: string; seafarer: string;
  vessel: string; imo: string; flag: string; vessel_type: string;
  rank: string; department: string; company: string;
  sign_on: string; sign_on_port: string;
  sign_off: string; sign_off_port: string;
  voyage_type: string; days: number;
  doc_letter: boolean; doc_contract: boolean; doc_discharge: boolean;
  status: string; reviewer: string; review_date: string; remarks: string;
}

const RANKS = ['AB Seaman', 'OS (Ordinary Seaman)', 'Deck Officer', 'Chief Officer', 'Master', 'Engineer', 'Chief Engineer', 'Electrical Officer', 'Radio Officer', 'Cook', 'Steward', 'Other'];
const VESSEL_TYPES = ['Cargo', 'Tanker', 'Passenger', 'Ferry', 'Bulk Carrier', 'Container', 'Fishing', 'Offshore', 'Other'];

function AddSeaServiceModal({ onClose, onSave, seafarers, currentUser }: { onClose: () => void; onSave: (r: SeaServiceRecord) => void; seafarers: typeof mockSeafarers; currentUser?: any }) {
  const isSeafarer = currentUser?.role === 'Seafarer';
  const lockedSf = isSeafarer ? mockSeafarers.find(s => s.name === currentUser.full_name || s.id === currentUser.id) : null;
  const [form, setForm] = useState({
    seafarer_id: lockedSf?.id || '', vessel: '', imo: '', flag: 'Ethiopia', vessel_type: '',
    rank: '', department: '', company: '',
    sign_on: '', sign_on_port: '', sign_off: '', sign_off_port: '',
    voyage_type: '', doc_letter: false, doc_contract: false, doc_discharge: false,
  });
  const [errors, setErrors] = useState<any>({});

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); setErrors((e: any) => { const n = { ...e }; delete n[k]; return n; }); }

  const days = form.sign_on && form.sign_off
    ? Math.max(0, Math.round((new Date(form.sign_off).getTime() - new Date(form.sign_on).getTime()) / 86400000))
    : 0;

  function save() {
    const e: any = {};
    if (!form.seafarer_id) e.seafarer_id = 'Required';
    if (!form.vessel) e.vessel = 'Required';
    if (!form.vessel_type) e.vessel_type = 'Required';
    if (!form.rank) e.rank = 'Required';
    if (!form.company) e.company = 'Required';
    if (!form.sign_on) e.sign_on = 'Required';
    if (!form.sign_off) e.sign_off = 'Required';
    if (!form.sign_on_port) e.sign_on_port = 'Required';
    if (!form.sign_off_port) e.sign_off_port = 'Required';
    if (!form.doc_letter && !form.doc_contract && !form.doc_discharge) e.docs = 'At least one supporting document is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const sf = seafarers.find(s => s.id === form.seafarer_id);
    onSave({ ...form, id: `SS-${Date.now()}`, seafarer: sf?.name || '', days, status: 'Submitted', reviewer: '', review_date: '', remarks: '' });
  }

  const Err = ({ k }: { k: string }) => errors[k] ? <span style={{ color: '#dc2626', fontSize: 11 }}>{errors[k]}</span> : null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 760 }}>
        <div className="modal-header"><div className="modal-title">⚓ Add Sea Service Record</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div className="alert alert-info">ℹ Sea service records will be verified against vessel records. Please ensure all details match official documents.</div>

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
            <div className="form-section-title">Vessel Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Vessel Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.vessel} onChange={e => set('vessel', e.target.value)} placeholder="e.g. MV Nile Star" style={errors.vessel ? { borderColor: '#dc2626' } : {}} />
                <Err k="vessel" />
              </div>
              <div className="form-group">
                <label>IMO Number</label>
                <input value={form.imo} onChange={e => set('imo', e.target.value)} placeholder="IMO XXXXXXX" />
              </div>
              <div className="form-group">
                <label>Flag State</label>
                <select value={form.flag} onChange={e => set('flag', e.target.value)}>
                  <option>Ethiopia</option><option>Djibouti</option><option>Kenya</option><option>International</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vessel Type <span style={{ color: '#dc2626' }}>*</span></label>
                <select value={form.vessel_type} onChange={e => set('vessel_type', e.target.value)} style={errors.vessel_type ? { borderColor: '#dc2626' } : {}}>
                  <option value="">Select type...</option>
                  {VESSEL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <Err k="vessel_type" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Service Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Rank <span style={{ color: '#dc2626' }}>*</span></label>
                <select value={form.rank} onChange={e => set('rank', e.target.value)} style={errors.rank ? { borderColor: '#dc2626' } : {}}>
                  <option value="">Select rank...</option>
                  {RANKS.map(r => <option key={r}>{r}</option>)}
                </select>
                <Err k="rank" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={form.department} onChange={e => set('department', e.target.value)}>
                  <option value="">Select...</option>
                  <option>Deck</option><option>Engine</option><option>Galley</option><option>Catering</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Company Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Shipping company name" style={errors.company ? { borderColor: '#dc2626' } : {}} />
                <Err k="company" />
              </div>
              <div className="form-group">
                <label>Voyage Type</label>
                <select value={form.voyage_type} onChange={e => set('voyage_type', e.target.value)}>
                  <option value="">Select...</option>
                  <option>Inland Waters</option><option>Coastal</option><option>International</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sign-On Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" value={form.sign_on} onChange={e => set('sign_on', e.target.value)} style={errors.sign_on ? { borderColor: '#dc2626' } : {}} />
                <Err k="sign_on" />
              </div>
              <div className="form-group">
                <label>Sign-On Port <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.sign_on_port} onChange={e => set('sign_on_port', e.target.value)} placeholder="Port name" style={errors.sign_on_port ? { borderColor: '#dc2626' } : {}} />
                <Err k="sign_on_port" />
              </div>
              <div className="form-group">
                <label>Sign-Off Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" value={form.sign_off} onChange={e => set('sign_off', e.target.value)} style={errors.sign_off ? { borderColor: '#dc2626' } : {}} />
                <Err k="sign_off" />
              </div>
              <div className="form-group">
                <label>Sign-Off Port <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.sign_off_port} onChange={e => set('sign_off_port', e.target.value)} placeholder="Port name" style={errors.sign_off_port ? { borderColor: '#dc2626' } : {}} />
                <Err k="sign_off_port" />
              </div>
            </div>
            {days > 0 && (
              <div style={{ padding: '10px 14px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', fontSize: 13, color: '#1e40af' }}>
                📅 Calculated sea days: <strong>{days} days</strong>
              </div>
            )}
          </div>

          <div className="form-section">
            <div className="form-section-title">Supporting Documents</div>
            {errors.docs && <div style={{ color: '#dc2626', fontSize: 12, marginBottom: 8 }}>⚠ {errors.docs}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { key: 'doc_letter', label: 'Sea Service Letter', icon: '📄' },
                { key: 'doc_contract', label: 'Employment Contract', icon: '📋' },
                { key: 'doc_discharge', label: 'Discharge Record', icon: '📑' },
              ].map(doc => (
                <div key={doc.key} onClick={() => set(doc.key, !(form as any)[doc.key])}
                  style={{ border: `2px ${(form as any)[doc.key] ? 'solid #86efac' : 'dashed #cbd5e1'}`, borderRadius: 10, padding: '16px', textAlign: 'center', cursor: 'pointer', background: (form as any)[doc.key] ? '#f0fdf4' : '#f8fafc' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{doc.icon}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{doc.label}</div>
                  <div style={{ fontSize: 11, color: (form as any)[doc.key] ? '#16a34a' : '#94a3b8', marginTop: 4 }}>{(form as any)[doc.key] ? '✓ Uploaded' : 'Click to attach'}</div>
                </div>
              ))}
            </div>
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

function ReviewModal({ record, onClose, onAction, canApprove }: { record: SeaServiceRecord; onClose: () => void; onAction: (id: string, action: string, remarks: string) => void; canApprove: boolean }) {
  const [remarks, setRemarks] = useState('');
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Review Sea Service Record</div><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div className="info-grid" style={{ marginBottom: 16 }}>
            {[['Seafarer', record.seafarer], ['Vessel', record.vessel], ['IMO', record.imo], ['Flag', record.flag], ['Vessel Type', record.vessel_type], ['Rank', record.rank], ['Company', record.company], ['Sign-On', record.sign_on], ['Sign-On Port', record.sign_on_port], ['Sign-Off', record.sign_off], ['Sign-Off Port', record.sign_off_port], ['Total Days', String(record.days)]].map(([k, v]) => (
              <div className="info-item" key={k}><label>{k}</label><div className="info-value">{v}</div></div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Supporting Documents</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['doc_letter', 'Sea Service Letter'], ['doc_contract', 'Contract'], ['doc_discharge', 'Discharge Record']].map(([k, l]) => (
                <span key={k} className={`badge badge-${(record as any)[k] ? 'green' : 'gray'}`}>{l}</span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Reviewer Remarks</label>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add verification notes..." rows={3} />
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

export default function SeaServiceRecords({ currentUser }: { currentUser?: any }) {
  const [records, setRecords] = useState<SeaServiceRecord[]>(
    mockSeaService.map(s => ({ ...s, sign_on_port: 'Addis Ababa', sign_off_port: 'Djibouti', department: 'Deck', voyage_type: 'Inland Waters', doc_letter: true, doc_contract: true, doc_discharge: true, reviewer: '', review_date: '', remarks: '' }))
  );
  const [showAdd, setShowAdd] = useState(false);
  const [reviewing, setReviewing] = useState<SeaServiceRecord | null>(null);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const canSubmitSeaService = currentUser?.role === 'Seafarer' || currentUser?.role === 'System Administrator';
  const canReviewSeaService = currentUser?.role === 'System Administrator';
  const visibleRecords = currentUser?.role === 'Seafarer'
    ? records.filter(r => r.seafarer_id === currentUser.id)
    : records;
  const totalDays = visibleRecords.filter(r => r.status === 'Approved').reduce((s, r) => s + r.days, 0);

  const filtered = visibleRecords.filter(r =>
    r.seafarer.toLowerCase().includes(search.toLowerCase()) || r.vessel.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(r: SeaServiceRecord) {
    setRecords(prev => [r, ...prev]);
    setShowAdd(false);
    setSuccessMsg(`Sea service record submitted for ${r.seafarer}. Pending verification.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  function handleAction(id: string, action: string, remarks: string) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: action, remarks, review_date: new Date().toISOString().slice(0, 10) } : r));
    setSuccessMsg(`Record ${action.toLowerCase()} successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  return (
    <div className="page">
      {showAdd && <AddSeaServiceModal onClose={() => setShowAdd(false)} onSave={handleSave} seafarers={mockSeafarers} currentUser={currentUser} />}
      {reviewing && <ReviewModal record={reviewing} onClose={() => setReviewing(null)} onAction={handleAction} canApprove={canReviewSeaService} />}

      <div className="flex-between page-header">
        <div><div className="page-title">Sea Service Records</div><div className="page-subtitle">Manage seafarer sea service history and experience</div></div>
        {canSubmitSeaService && <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Sea Service</button>}
      </div>

      {successMsg && <div className="alert alert-success">✓ {successMsg}</div>}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Records', value: visibleRecords.length, color: 'blue', icon: '📋' },
          { label: 'Approved', value: visibleRecords.filter(r => r.status === 'Approved').length, color: 'green', icon: '✓' },
          { label: 'Pending', value: visibleRecords.filter(r => r.status === 'Submitted').length, color: 'yellow', icon: '⏳' },
          { label: 'Total Approved Days', value: totalDays, color: 'teal', icon: '⚓' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Sea Service Records ({filtered.length})</div>
          <input placeholder="Search vessel, seafarer..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13 }} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Seafarer</th><th>Vessel</th><th>Type</th><th>Rank</th><th>Company</th>
                <th>Sign-On</th><th>Sign-Off</th><th>Days</th><th>Docs</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={11} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No records found</td></tr>}
              {filtered.map(r => (
                <tr key={r.id}>
                  <td><div style={{ fontWeight: 500 }}>{r.seafarer}</div><div style={{ fontSize: 11, color: '#64748b' }}>{r.seafarer_id}</div></td>
                  <td><div style={{ fontWeight: 500 }}>{r.vessel}</div><div style={{ fontSize: 11, color: '#64748b' }}>{r.flag} · {r.imo}</div></td>
                  <td>{r.vessel_type}</td>
                  <td>{r.rank}</td>
                  <td style={{ fontSize: 13 }}>{r.company}</td>
                  <td style={{ fontSize: 13 }}>{r.sign_on}</td>
                  <td style={{ fontSize: 13 }}>{r.sign_off}</td>
                  <td><strong>{r.days}</strong></td>
                  <td>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {r.doc_letter && <span className="badge badge-green" style={{ fontSize: 10 }}>Letter</span>}
                      {r.doc_contract && <span className="badge badge-blue" style={{ fontSize: 10 }}>Contract</span>}
                      {r.doc_discharge && <span className="badge badge-teal" style={{ fontSize: 10 }}>Discharge</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${r.status === 'Approved' ? 'green' : r.status === 'Rejected' ? 'red' : 'blue'}`}>{r.status}</span>
                    {r.remarks && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{r.remarks}</div>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => setReviewing(r)}>View</button>
                      {canReviewSeaService && r.status === 'Submitted' && (
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
