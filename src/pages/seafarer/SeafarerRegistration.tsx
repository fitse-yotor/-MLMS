import React, { useState } from 'react';

interface RegForm {
  first_name: string; middle_name: string; last_name: string;
  gender: string; dob: string; place_of_birth: string;
  nationality: string; national_id: string; passport_no: string;
  passport_expiry: string; marital_status: string;
  mobile: string; email: string; permanent_address: string;
  current_address: string; region: string; city: string;
  emergency_name: string; emergency_phone: string; emergency_relation: string;
  docs_national_id: boolean; docs_passport: boolean;
  docs_graduation: boolean; docs_photo: boolean;
}

const EMPTY: RegForm = {
  first_name: '', middle_name: '', last_name: '',
  gender: '', dob: '', place_of_birth: '',
  nationality: 'Ethiopian', national_id: '', passport_no: '',
  passport_expiry: '', marital_status: '',
  mobile: '', email: '', permanent_address: '',
  current_address: '', region: '', city: '',
  emergency_name: '', emergency_phone: '', emergency_relation: '',
  docs_national_id: false, docs_passport: false,
  docs_graduation: false, docs_photo: false,
};

const steps = ['Personal Information', 'Contact Details', 'Documents Upload', 'Review & Submit'];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label>{label}{required && <span style={{ color: '#dc2626' }}> *</span>}</label>
      {children}
    </div>
  );
}

export default function SeafarerRegistration({ onBack, onSaved }: { onBack: () => void; onSaved?: (sf: any) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<RegForm>>({});
  const [submitted, setSubmitted] = useState(false);
  const [refNo] = useState(() => `REG-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`);

  function set(field: keyof RegForm, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => { const n = { ...e }; delete (n as any)[field]; return n; });
  }

  function validate(s: number): boolean {
    const e: any = {};
    if (s === 0) {
      if (!form.first_name) e.first_name = 'Required';
      if (!form.last_name) e.last_name = 'Required';
      if (!form.gender) e.gender = 'Required';
      if (!form.dob) e.dob = 'Required';
      if (!form.place_of_birth) e.place_of_birth = 'Required';
      if (!form.nationality) e.nationality = 'Required';
      if (!form.national_id) e.national_id = 'Required';
    }
    if (s === 1) {
      if (!form.mobile) e.mobile = 'Required';
      if (!form.email) e.email = 'Required';
      if (!form.region) e.region = 'Required';
      if (!form.city) e.city = 'Required';
    }
    if (s === 2) {
      if (!form.docs_photo) e.docs_photo = 'Required' as any;
      if (!form.docs_national_id) e.docs_national_id = 'Required' as any;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validate(step)) setStep(s => s + 1); }
  function prev() { setStep(s => s - 1); }

  function submit() {
    if (validate(step)) {
      setSubmitted(true);
      onSaved?.({ ...form, id: refNo, status: 'Pending', reg_date: new Date().toISOString().slice(0, 10) });
    }
  }

  function Err({ field }: { field: keyof RegForm }) {
    return errors[field] ? <span style={{ color: '#dc2626', fontSize: 11, marginTop: 2 }}>{String(errors[field])}</span> : null;
  }

  if (submitted) {
    return (
      <div className="page">
        <div style={{ maxWidth: 560, margin: '48px auto', background: '#fff', borderRadius: 16, padding: 36, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Registration Submitted Successfully</div>
          <div style={{ fontSize: 13.5, color: '#64748b', marginBottom: 6 }}>Reference Number: <strong style={{ color: '#1e40af' }}>{refNo}</strong></div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
            Your application for <strong>{form.first_name} {form.last_name}</strong> has been submitted.<br />You will be notified once the documents are verified and reviewed.
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: '#374151' }}>Workflow Status</div>
            {['Application Submitted ✓', 'Document Verification', 'Authority Review', 'Approval Decision', 'Profile Creation'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: i === 0 ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, color: i === 0 ? '#166534' : '#94a3b8', fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={onBack}>Back to Registry</button>
            <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setStep(0); setForm(EMPTY); }}>New Registration</button>
          </div>
        </div>
      </div>
    );
  }

  const completion = [
    form.first_name && form.last_name && form.gender && form.dob,
    form.mobile && form.email && form.region,
    form.docs_national_id && form.docs_photo,
    true
  ];

  return (
    <div className="page">
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
        <span style={{ fontSize: 13, color: '#64748b' }}>Seafarer Registry / New Registration</span>
      </div>

      <div className="page-header">
        <div className="page-title">New Seafarer Registration</div>
        <div className="page-subtitle">Register a new seafarer profile — Step {step + 1} of {steps.length}</div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {i > 0 && <div style={{ flex: 1, height: 3, background: step > i - 1 ? '#1e40af' : '#e2e8f0', borderRadius: 2 }} />}
              <div onClick={() => step > i && setStep(i)} style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: step > i ? '#1e40af' : step === i ? '#3b82f6' : '#f1f5f9',
                color: step >= i ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, cursor: step > i ? 'pointer' : 'default',
                border: step === i ? '3px solid #93c5fd' : '3px solid transparent',
                boxShadow: step === i ? '0 0 0 3px #dbeafe' : 'none'
              }}>
                {step > i ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 3, background: step > i ? '#1e40af' : '#e2e8f0', borderRadius: 2 }} />}
            </div>
            <div style={{ fontSize: 11.5, textAlign: 'center', color: step === i ? '#1e40af' : step > i ? '#475569' : '#94a3b8', fontWeight: step === i ? 600 : 400 }}>
              {s}{completion[i] && step > i ? ' ✓' : ''}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        {/* STEP 1 */}
        {step === 0 && (
          <>
            <div className="card-header">
              <div className="card-title">👤 Personal Information</div>
              <span className="badge badge-blue">Step 1 of 4</span>
            </div>
            <div className="card-body">
              <div className="form-section">
                <div className="form-section-title">Identity Details</div>
                <div className="form-grid">
                  <Field label="First Name" required>
                    <input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="First name" style={errors.first_name ? { borderColor: '#dc2626' } : {}} />
                    <Err field="first_name" />
                  </Field>
                  <Field label="Middle Name">
                    <input value={form.middle_name} onChange={e => set('middle_name', e.target.value)} placeholder="Middle name" />
                  </Field>
                  <Field label="Last Name" required>
                    <input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Last name" style={errors.last_name ? { borderColor: '#dc2626' } : {}} />
                    <Err field="last_name" />
                  </Field>
                  <Field label="Gender" required>
                    <select value={form.gender} onChange={e => set('gender', e.target.value)} style={errors.gender ? { borderColor: '#dc2626' } : {}}>
                      <option value="">Select gender</option>
                      <option>Male</option><option>Female</option>
                    </select>
                    <Err field="gender" />
                  </Field>
                  <Field label="Date of Birth" required>
                    <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} style={errors.dob ? { borderColor: '#dc2626' } : {}} />
                    <Err field="dob" />
                  </Field>
                  <Field label="Place of Birth" required>
                    <input value={form.place_of_birth} onChange={e => set('place_of_birth', e.target.value)} placeholder="City, Country" style={errors.place_of_birth ? { borderColor: '#dc2626' } : {}} />
                    <Err field="place_of_birth" />
                  </Field>
                  <Field label="Nationality" required>
                    <select value={form.nationality} onChange={e => set('nationality', e.target.value)}>
                      <option>Ethiopian</option><option>Other</option>
                    </select>
                  </Field>
                  <Field label="Marital Status">
                    <select value={form.marital_status} onChange={e => set('marital_status', e.target.value)}>
                      <option value="">Select</option>
                      <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                    </select>
                  </Field>
                </div>
              </div>
              <div className="form-section">
                <div className="form-section-title">Identity Documents</div>
                <div className="form-grid">
                  <Field label="National ID Number" required>
                    <input value={form.national_id} onChange={e => set('national_id', e.target.value)} placeholder="e.g. ET-1234567" style={errors.national_id ? { borderColor: '#dc2626' } : {}} />
                    <Err field="national_id" />
                  </Field>
                  <Field label="Passport Number">
                    <input value={form.passport_no} onChange={e => set('passport_no', e.target.value)} placeholder="e.g. EP123456" />
                  </Field>
                  <Field label="Passport Expiry Date">
                    <input type="date" value={form.passport_expiry} onChange={e => set('passport_expiry', e.target.value)} />
                  </Field>
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', fontSize: 13, color: '#1e40af' }}>
                ℹ A unique Seafarer ID will be automatically generated upon approval of this registration.
              </div>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <>
            <div className="card-header">
              <div className="card-title">📞 Contact Details</div>
              <span className="badge badge-blue">Step 2 of 4</span>
            </div>
            <div className="card-body">
              <div className="form-section">
                <div className="form-section-title">Contact Information</div>
                <div className="form-grid">
                  <Field label="Mobile Number" required>
                    <input value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+251 9XX XXX XXX" style={errors.mobile ? { borderColor: '#dc2626' } : {}} />
                    <Err field="mobile" />
                  </Field>
                  <Field label="Email Address" required>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" style={errors.email ? { borderColor: '#dc2626' } : {}} />
                    <Err field="email" />
                  </Field>
                  <Field label="Region" required>
                    <select value={form.region} onChange={e => set('region', e.target.value)} style={errors.region ? { borderColor: '#dc2626' } : {}}>
                      <option value="">Select region</option>
                      {['Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'SNNPR', 'Somali', 'Afar', 'Dire Dawa', 'Harari', 'Gambella', 'Benishangul-Gumuz'].map(r => <option key={r}>{r}</option>)}
                    </select>
                    <Err field="region" />
                  </Field>
                  <Field label="City" required>
                    <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" style={errors.city ? { borderColor: '#dc2626' } : {}} />
                    <Err field="city" />
                  </Field>
                  <div className="form-group full">
                    <label>Permanent Address</label>
                    <textarea value={form.permanent_address} onChange={e => set('permanent_address', e.target.value)} placeholder="Full permanent address" rows={2} />
                  </div>
                  <div className="form-group full">
                    <label>Current Address <span style={{ fontSize: 11, color: '#64748b' }}>(if different from permanent)</span></label>
                    <textarea value={form.current_address} onChange={e => set('current_address', e.target.value)} placeholder="Full current address" rows={2} />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="form-section-title">Emergency Contact</div>
                <div className="form-grid">
                  <Field label="Contact Name">
                    <input value={form.emergency_name} onChange={e => set('emergency_name', e.target.value)} placeholder="Full name" />
                  </Field>
                  <Field label="Relationship">
                    <select value={form.emergency_relation} onChange={e => set('emergency_relation', e.target.value)}>
                      <option value="">Select</option>
                      <option>Parent</option><option>Spouse</option><option>Sibling</option><option>Child</option><option>Other</option>
                    </select>
                  </Field>
                  <Field label="Phone Number">
                    <input value={form.emergency_phone} onChange={e => set('emergency_phone', e.target.value)} placeholder="+251 9XX XXX XXX" />
                  </Field>
                </div>
              </div>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <>
            <div className="card-header">
              <div className="card-title">📎 Documents Upload</div>
              <span className="badge badge-blue">Step 3 of 4</span>
            </div>
            <div className="card-body">
              <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, color: '#92400e', marginBottom: 20 }}>
                ⚠ Please upload clear, readable copies of all required documents. Accepted formats: PDF, JPG, PNG (max 5MB each). Items marked with * are mandatory.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { key: 'docs_national_id' as keyof RegForm, label: 'National ID (Front & Back)', required: true, icon: '🪪', desc: 'Both sides of your national identity card' },
                  { key: 'docs_passport' as keyof RegForm, label: 'Passport Copy', required: false, icon: '📘', desc: 'Bio-data page of valid passport' },
                  { key: 'docs_graduation' as keyof RegForm, label: 'Graduation Certificate', required: false, icon: '🎓', desc: 'Highest academic qualification' },
                  { key: 'docs_photo' as keyof RegForm, label: 'Passport Size Photo', required: true, icon: '📷', desc: 'Recent photo, white background, 3.5×4.5cm' },
                ].map(doc => {
                  const uploaded = form[doc.key] as boolean;
                  const hasError = !!errors[doc.key];
                  return (
                    <div key={doc.key} style={{ border: `2px ${uploaded ? 'solid' : 'dashed'} ${hasError ? '#fecaca' : uploaded ? '#86efac' : '#cbd5e1'}`, borderRadius: 10, padding: '18px', background: uploaded ? '#f0fdf4' : hasError ? '#fef2f2' : '#f8fafc', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ fontSize: 28 }}>{doc.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>
                            {doc.label}{doc.required && <span style={{ color: '#dc2626' }}> *</span>}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b', margin: '3px 0 10px' }}>{doc.desc}</div>
                          {uploaded ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 500 }}>✓ Uploaded</span>
                              <button className="btn btn-secondary btn-xs" onClick={() => set(doc.key, false)}>Remove</button>
                            </div>
                          ) : (
                            <button className="btn btn-secondary btn-sm" onClick={() => set(doc.key, true)}>
                              📁 Choose File
                            </button>
                          )}
                          {hasError && <div style={{ color: '#dc2626', fontSize: 11, marginTop: 4 }}>This document is required</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Upload Progress</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[['docs_national_id', 'National ID'], ['docs_passport', 'Passport'], ['docs_graduation', 'Certificate'], ['docs_photo', 'Photo']].map(([k, l]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <span style={{ color: form[k as keyof RegForm] ? '#16a34a' : '#94a3b8' }}>{form[k as keyof RegForm] ? '✓' : '○'}</span>
                      <span style={{ color: form[k as keyof RegForm] ? '#166534' : '#94a3b8' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <>
            <div className="card-header">
              <div className="card-title">✅ Review & Submit</div>
              <span className="badge badge-blue">Step 4 of 4</span>
            </div>
            <div className="card-body">
              <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, color: '#92400e', marginBottom: 20 }}>
                ⚠ Please review all information carefully. Once submitted, changes can only be made through a Correction Request.
              </div>
              <div className="card-grid">
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>👤 Personal Information</div>
                  {[
                    ['Full Name', `${form.first_name} ${form.middle_name} ${form.last_name}`.trim()],
                    ['Gender', form.gender || '—'], ['Date of Birth', form.dob || '—'],
                    ['Place of Birth', form.place_of_birth || '—'], ['Nationality', form.nationality],
                    ['Marital Status', form.marital_status || '—'],
                    ['National ID', form.national_id || '—'], ['Passport No.', form.passport_no || '—'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#64748b' }}>{k}</span>
                      <span style={{ fontWeight: 500, color: v === '—' ? '#94a3b8' : '#0f172a' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0', marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>📞 Contact Information</div>
                    {[
                      ['Mobile', form.mobile || '—'], ['Email', form.email || '—'],
                      ['Region', form.region || '—'], ['City', form.city || '—'],
                      ['Emergency Contact', form.emergency_name || '—'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#64748b' }}>{k}</span>
                        <span style={{ fontWeight: 500, color: v === '—' ? '#94a3b8' : '#0f172a' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>📎 Documents</div>
                    {[['National ID', form.docs_national_id], ['Passport', form.docs_passport], ['Graduation', form.docs_graduation], ['Photo', form.docs_photo]].map(([l, v]) => (
                      <div key={String(l)} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                        <span style={{ color: '#64748b' }}>{l as string}</span>
                        <span style={{ color: v ? '#16a34a' : '#94a3b8', fontWeight: 500 }}>{v ? '✓ Uploaded' : '— Not provided'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: '14px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" id="confirm" style={{ width: 16, height: 16 }} />
                <label htmlFor="confirm" style={{ fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                  I confirm that all information provided is accurate and complete. I understand that providing false information may result in rejection or cancellation.
                </label>
              </div>
            </div>
          </>
        )}

        {/* Footer buttons */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {Object.keys(errors).length > 0 && <span style={{ color: '#dc2626' }}>⚠ Please fix {Object.keys(errors).length} error(s) above</span>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={onBack}>Cancel</button>
            {step > 0 && <button className="btn btn-secondary" onClick={prev}>← Previous</button>}
            {step < 3
              ? <button className="btn btn-primary" onClick={next}>Next Step →</button>
              : <button className="btn btn-success" onClick={submit}>✓ Submit Registration</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
