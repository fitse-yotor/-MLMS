import React, { useState } from 'react';
import { mockExamResults } from '../../mockData';

type ExamType = {
  id: string;
  code: string;
  name: string;
  category: string;
  level: string;
  duration: number;
  questions: number;
  marks: number;
  pass: number;
  attempts: number;
  retake_days: number;
  mode: string;
  certificate: string;
  active: boolean;
};

const initialExamTypes: ExamType[] = [
  { id: 'EXT-001', code: 'ASD', name: 'Able Seafarer Deck', category: 'Deck', level: 'Operational', duration: 120, questions: 50, marks: 100, pass: 60, attempts: 3, retake_days: 14, mode: 'Online', certificate: 'Able Seafarer Deck', active: true },
  { id: 'EXT-002', code: 'BSC', name: 'Basic Safety', category: 'Safety', level: 'Basic', duration: 90, questions: 40, marks: 100, pass: 60, attempts: 3, retake_days: 7, mode: 'Online', certificate: 'Basic Safety Certificate', active: true },
];

export default function ExamOperations({ currentUser }: { currentUser?: any }) {
  const isAdmin = currentUser?.role === 'System Administrator';
  const [tab, setTab] = useState(isAdmin ? 'config' : 'online');
  const tabs = [
    ...(isAdmin ? [{ id: 'config', label: 'Configuration' }, { id: 'proctoring', label: 'Proctoring' }] : []),
    { id: 'online', label: 'Online Exam' },
    { id: 'eligibility', label: 'Certificate Eligibility' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Exam Operations</div>
        <div className="page-subtitle">Configuration, delivery, proctoring, and certificate eligibility</div>
      </div>
      <div className="tabs">
        {tabs.map(t => <div key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>)}
      </div>
      {tab === 'config' && <ExamConfiguration />}
      {tab === 'online' && <OnlineExam currentUser={currentUser} />}
      {tab === 'proctoring' && <Proctoring />}
      {tab === 'eligibility' && <CertificateEligibility currentUser={currentUser} />}
    </div>
  );
}

function ExamConfiguration() {
  const [examTypes, setExamTypes] = useState(initialExamTypes);
  const [showNew, setShowNew] = useState(false);

  function save(form: ExamType) {
    setExamTypes(prev => [{ ...form, id: `EXT-${Date.now()}` }, ...prev]);
    setShowNew(false);
  }

  return (
    <>
      {showNew && <ExamTypeModal onClose={() => setShowNew(false)} onSave={save} />}
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div className="page-subtitle">Define exam type, duration, pass mark, attempt limit, and linked certificate.</div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Create Exam Type</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Level</th><th>Duration</th><th>Questions</th><th>Pass Mark</th><th>Attempts</th><th>Retake</th><th>Mode</th><th>Certificate</th><th>Status</th></tr></thead>
            <tbody>{examTypes.map(e => <tr key={e.id}><td><span style={{ fontFamily: 'monospace' }}>{e.code}</span></td><td>{e.name}</td><td>{e.category}</td><td>{e.level}</td><td>{e.duration} min</td><td>{e.questions}</td><td>{e.pass}%</td><td>{e.attempts}</td><td>{e.retake_days} days</td><td>{e.mode}</td><td>{e.certificate}</td><td><span className={`badge badge-${e.active ? 'green' : 'gray'}`}>{e.active ? 'Active' : 'Inactive'}</span></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ExamTypeModal({ onClose, onSave }: { onClose: () => void; onSave: (form: ExamType) => void }) {
  const [form, setForm] = useState<ExamType>({ id: '', code: '', name: '', category: 'Deck', level: 'Operational', duration: 120, questions: 50, marks: 100, pass: 60, attempts: 3, retake_days: 14, mode: 'Online', certificate: '', active: true });
  function set(key: keyof ExamType, value: any) { setForm(prev => ({ ...prev, [key]: value })); }
  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Create Exam Type</div><button className="modal-close" onClick={onClose}>x</button></div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group"><label>Exam Code</label><input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} /></div>
            <div className="form-group"><label>Exam Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={e => set('category', e.target.value)}><option>Deck</option><option>Engine</option><option>Safety</option></select></div>
            <div className="form-group"><label>Level</label><select value={form.level} onChange={e => set('level', e.target.value)}><option>Basic</option><option>Operational</option><option>Management</option></select></div>
            <div className="form-group"><label>Duration (Minutes)</label><input type="number" value={form.duration} onChange={e => set('duration', Number(e.target.value))} /></div>
            <div className="form-group"><label>Total Questions</label><input type="number" value={form.questions} onChange={e => set('questions', Number(e.target.value))} /></div>
            <div className="form-group"><label>Total Marks</label><input type="number" value={form.marks} onChange={e => set('marks', Number(e.target.value))} /></div>
            <div className="form-group"><label>Pass Mark (%)</label><input type="number" value={form.pass} onChange={e => set('pass', Number(e.target.value))} /></div>
            <div className="form-group"><label>Attempt Limit</label><input type="number" value={form.attempts} onChange={e => set('attempts', Number(e.target.value))} /></div>
            <div className="form-group"><label>Retake Waiting Period</label><input type="number" value={form.retake_days} onChange={e => set('retake_days', Number(e.target.value))} /></div>
            <div className="form-group"><label>Exam Mode</label><select value={form.mode} onChange={e => set('mode', e.target.value)}><option>Online</option><option>Center Based</option><option>Paper</option></select></div>
            <div className="form-group"><label>Certificate Linked</label><input value={form.certificate} onChange={e => set('certificate', e.target.value)} /></div>
          </div>
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => form.code && form.name && onSave(form)}>Activate Examination</button></div>
      </div>
    </div>
  );
}

function OnlineExam({ currentUser }: { currentUser?: any }) {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const questions = [
    'What is the correct first action after hearing an abandon ship signal?',
    'Which document verifies a seafarer medical fitness status?',
    'What should a candidate do before submitting an online examination?',
  ];
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">{currentUser?.role === 'Seafarer' ? 'My Online Examination' : 'Online Examination Delivery Preview'}</div><span className={`badge badge-${submitted ? 'green' : started ? 'blue' : 'yellow'}`}>{submitted ? 'Submitted' : started ? 'In Progress' : 'Ready'}</span></div>
      <div className="card-body">
        {!started && !submitted && (
          <div>
            <div className="info-grid">
              {[
                ['Candidate', currentUser?.role === 'Seafarer' ? currentUser.full_name : 'Demo Candidate'],
                ['Identity Verification', 'Verified'],
                ['Exam', 'Basic Safety'],
                ['Duration', '90 minutes'],
                ['Access Device', 'Browser session tracked'],
                ['Auto Submit', 'Enabled at timeout'],
              ].map(([k, v]) => <div className="info-item" key={k}><label>{k}</label><div className="info-value">{v}</div></div>)}
            </div>
            <div className="alert alert-info" style={{ marginTop: 18 }}>Instructions displayed. Candidate may start only after identity verification and schedule validation.</div>
            <button className="btn btn-primary" onClick={() => setStarted(true)}>Start Examination</button>
          </div>
        )}
        {started && !submitted && (
          <div>
            <div className="exam-timer">Time Remaining: 01:28:42</div>
            {questions.map((q, i) => (
              <div className="record-panel" key={q}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Question {i + 1}. {q}</div>
                {['A', 'B', 'C', 'D'].map(letter => <label key={letter} className="choice-row"><input type="radio" name={`q-${i}`} checked={answers[i] === letter} onChange={() => setAnswers(prev => ({ ...prev, [i]: letter }))} /> Option {letter}</label>)}
              </div>
            ))}
            <button className="btn btn-success" onClick={() => { setStarted(false); setSubmitted(true); }}>Submit Examination</button>
          </div>
        )}
        {submitted && <div className="empty-state"><p>Exam submitted successfully. Responses are recorded for scoring and evaluation.</p></div>}
      </div>
    </div>
  );
}

function Proctoring() {
  const [incidents, setIncidents] = useState([{ id: 'PR-001', candidate: 'Abebe Girma', attempt: 'ATT-001', proctor: 'Officer Tesfaye', type: 'Late Login', description: 'Candidate logged in 8 minutes after start time.', action: 'Allowed continuation', status: 'Reviewed' }]);
  const [type, setType] = useState('Screen Focus Lost');
  function addIncident() {
    setIncidents(prev => [{ id: `PR-${Date.now()}`, candidate: 'Demo Candidate', attempt: 'ATT-NEW', proctor: 'Current Officer', type, description: 'Incident recorded during live monitoring.', action: 'Pending review', status: 'Open' }, ...prev]);
  }
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">Proctoring and Invigilation</div><div style={{ display: 'flex', gap: 8 }}><select value={type} onChange={e => setType(e.target.value)}><option>Screen Focus Lost</option><option>Identity Mismatch</option><option>Unauthorized Material</option></select><button className="btn btn-primary" onClick={addIncident}>Record Incident</button></div></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Record ID</th><th>Candidate</th><th>Attempt</th><th>Proctor</th><th>Incident Type</th><th>Description</th><th>Action Taken</th><th>Status</th></tr></thead>
          <tbody>{incidents.map(i => <tr key={i.id}><td>{i.id}</td><td>{i.candidate}</td><td>{i.attempt}</td><td>{i.proctor}</td><td>{i.type}</td><td>{i.description}</td><td>{i.action}</td><td><span className={`badge badge-${i.status === 'Open' ? 'yellow' : 'green'}`}>{i.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function CertificateEligibility({ currentUser }: { currentUser?: any }) {
  const rows = mockExamResults.filter(r => currentUser?.role !== 'Seafarer' || r.seafarer_id === currentUser.id).map(r => ({
    id: `ELG-${r.id.replace('RES-', '')}`,
    candidate: r.candidate,
    attempt: r.id,
    result: r.result,
    certificate: r.exam_type,
    training: r.result === 'Pass',
    medical: r.result === 'Pass',
    sea: r.result === 'Pass',
    status: r.result === 'Pass' ? 'Eligible for Certification' : 'Not Eligible',
  }));
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">Exam to Certification Eligibility</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Eligibility ID</th><th>Candidate</th><th>Exam Attempt</th><th>Exam Result</th><th>Certificate Type</th><th>Training</th><th>Medical</th><th>Sea Service</th><th>Status</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.candidate}</td><td>{r.attempt}</td><td>{r.result}</td><td>{r.certificate}</td><td>{r.training ? 'Met' : 'Pending'}</td><td>{r.medical ? 'Met' : 'Pending'}</td><td>{r.sea ? 'Met' : 'Pending'}</td><td><span className={`badge badge-${r.status.startsWith('Eligible') ? 'green' : 'red'}`}>{r.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
