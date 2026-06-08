import React, { useState } from 'react';
import { mockExamApplications, mockExamSchedules, mockSeafarers } from '../../mockData';

type Schedule = {
  id: string;
  name: string;
  exam_type: string;
  date: string;
  start: string;
  end: string;
  center: string;
  venue: string;
  capacity: number;
  registered: number;
  invigilator: string;
  examiner: string;
  deadline: string;
  status: string;
};

type Assignment = {
  id: string;
  schedule_id: string;
  candidate_id: string;
  candidate: string;
  seat: string;
  registration: string;
  login: string;
  token: string;
  attendance: string;
};

const initialAssignments: Assignment[] = [
  { id: 'ASN-001', schedule_id: 'SCH-2024-001', candidate_id: 'SF-2024-0001', candidate: 'Abebe Girma', seat: 'A-05', registration: 'REG-001', login: 'abebe.exam001', token: 'TOK-15A7', attendance: 'Present' },
  { id: 'ASN-002', schedule_id: 'SCH-2024-001', candidate_id: 'SF-2024-0002', candidate: 'Tigist Haile', seat: 'A-12', registration: 'REG-002', login: 'tigist.exam002', token: 'TOK-42BB', attendance: 'Present' },
  { id: 'ASN-003', schedule_id: 'SCH-2024-003', candidate_id: 'SF-2024-0005', candidate: 'Yonas Teshome', seat: 'B-04', registration: 'REG-003', login: 'yonas.exam003', token: 'TOK-90DE', attendance: 'Not Marked' },
];

function normalizeSchedule(s: any): Schedule {
  const [start = s.time || '', end = '12:00 PM'] = String(s.time || '').split(' - ');
  return { ...s, start, end, examiner: 'Captain Solomon Merga', deadline: s.date, registered: s.registered || 0 };
}

function ScheduleModal({ onClose, onSave }: { onClose: () => void; onSave: (schedule: Schedule) => void }) {
  const [form, setForm] = useState({ name: '', exam_type: 'Basic Safety', date: '', start: '09:00', end: '12:00', center: 'Addis Ababa Maritime Center', venue: '', capacity: 40, invigilator: '', examiner: '', deadline: '', status: 'Draft' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    ['name', 'date', 'venue', 'invigilator', 'examiner', 'deadline'].forEach(key => {
      if (!(form as any)[key]) nextErrors[key] = 'Required';
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...form, id: `SCH-${Date.now()}`, registered: 0 });
  }

  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Create Exam Schedule</div><button className="modal-close" onClick={onClose}>x</button></div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group"><label>Session Name</label><input value={form.name} onChange={e => set('name', e.target.value)} />{errors.name && <span className="field-error">{errors.name}</span>}</div>
            <div className="form-group"><label>Exam Type</label><select value={form.exam_type} onChange={e => set('exam_type', e.target.value)}><option>Basic Safety</option><option>Able Seafarer Deck</option><option>Deck Officer</option><option>Marine Engineer</option></select></div>
            <div className="form-group"><label>Exam Date</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} />{errors.date && <span className="field-error">{errors.date}</span>}</div>
            <div className="form-group"><label>Registration Deadline</label><input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />{errors.deadline && <span className="field-error">{errors.deadline}</span>}</div>
            <div className="form-group"><label>Start Time</label><input type="time" value={form.start} onChange={e => set('start', e.target.value)} /></div>
            <div className="form-group"><label>End Time</label><input type="time" value={form.end} onChange={e => set('end', e.target.value)} /></div>
            <div className="form-group"><label>Exam Center</label><input value={form.center} onChange={e => set('center', e.target.value)} /></div>
            <div className="form-group"><label>Venue</label><input value={form.venue} onChange={e => set('venue', e.target.value)} />{errors.venue && <span className="field-error">{errors.venue}</span>}</div>
            <div className="form-group"><label>Capacity</label><input type="number" min="1" value={form.capacity} onChange={e => set('capacity', Number(e.target.value))} /></div>
            <div className="form-group"><label>Schedule Status</label><select value={form.status} onChange={e => set('status', e.target.value)}><option>Draft</option><option>Upcoming</option><option>Published</option></select></div>
            <div className="form-group"><label>Assigned Invigilator</label><input value={form.invigilator} onChange={e => set('invigilator', e.target.value)} />{errors.invigilator && <span className="field-error">{errors.invigilator}</span>}</div>
            <div className="form-group"><label>Assigned Examiner</label><input value={form.examiner} onChange={e => set('examiner', e.target.value)} />{errors.examiner && <span className="field-error">{errors.examiner}</span>}</div>
          </div>
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={save}>Create Schedule</button></div>
      </div>
    </div>
  );
}

export default function ExamSchedules({ currentUser }: { currentUser?: any }) {
  const [view, setView] = useState('list');
  const [schedules, setSchedules] = useState<Schedule[]>(mockExamSchedules.map(normalizeSchedule));
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [showNew, setShowNew] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [message, setMessage] = useState('');
  const canManageSchedules = currentUser?.role === 'System Administrator';
  const seafarerAssignmentIds = assignments.filter(a => a.candidate_id === currentUser?.id).map(a => a.schedule_id);
  const visibleSchedules = currentUser?.role === 'Seafarer'
    ? schedules.filter(s => seafarerAssignmentIds.includes(s.id))
    : schedules;
  const visibleAssignments = currentUser?.role === 'Seafarer'
    ? assignments.filter(a => a.candidate_id === currentUser.id)
    : assignments;
  const approvedCandidateIds = mockExamApplications.filter(a => a.status === 'Approved').map(a => a.seafarer_id);
  const unassignedCandidates = mockSeafarers.filter(s => approvedCandidateIds.includes(s.id) && !assignments.some(a => a.candidate_id === s.id && a.schedule_id === selectedSchedule));

  function addSchedule(schedule: Schedule) {
    setSchedules(prev => [schedule, ...prev]);
    setShowNew(false);
    setMessage('Exam schedule created.');
    setTimeout(() => setMessage(''), 3000);
  }

  function publish(id: string) {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status: 'Published' } : s));
    setMessage('Schedule published and candidates can now view their assignment.');
    setTimeout(() => setMessage(''), 3000);
  }

  function assignCandidate() {
    const schedule = schedules.find(s => s.id === selectedSchedule);
    const sf = mockSeafarers.find(s => s.id === selectedCandidate);
    if (!schedule || !sf) return;
    const count = assignments.filter(a => a.schedule_id === selectedSchedule).length + 1;
    const assignment: Assignment = {
      id: `ASN-${Date.now()}`,
      schedule_id: selectedSchedule,
      candidate_id: sf.id,
      candidate: sf.name,
      seat: `${schedule.venue.slice(0, 1).toUpperCase() || 'A'}-${String(count).padStart(2, '0')}`,
      registration: `REG-${Date.now().toString().slice(-5)}`,
      login: `${sf.name.split(' ')[0].toLowerCase()}.exam${count}`,
      token: `TOK-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      attendance: 'Not Marked',
    };
    setAssignments(prev => [assignment, ...prev]);
    setSchedules(prev => prev.map(s => s.id === selectedSchedule ? { ...s, registered: s.registered + 1 } : s));
    setMessage(`${sf.name} assigned to ${schedule.name}.`);
    setSelectedCandidate('');
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="page">
      {showNew && <ScheduleModal onClose={() => setShowNew(false)} onSave={addSchedule} />}
      <div className="flex-between page-header">
        <div><div className="page-title">Exam Schedules</div><div className="page-subtitle">{currentUser?.role === 'Seafarer' ? 'Your assigned examination sessions' : 'Manage examination sessions and candidate assignments'}</div></div>
        {canManageSchedules && <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Create Schedule</button>}
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="tabs">
        <div className={`tab${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>Schedule List</div>
        <div className={`tab${view === 'candidates' ? ' active' : ''}`} onClick={() => setView('candidates')}>{currentUser?.role === 'Seafarer' ? 'My Assignment' : 'Candidate Assignments'}</div>
      </div>

      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {visibleSchedules.map(s => (
            <div className="card" key={s.id}>
              <div className="card-body">
                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{s.id} / {s.exam_type}</div>
                  </div>
                  <span className={`badge badge-${s.status === 'Completed' ? 'gray' : s.status === 'Published' ? 'green' : 'blue'}`}>{s.status}</span>
                </div>
                <div className="schedule-meta">
                  {[['Date', s.date], ['Time', `${s.start} - ${s.end}`], ['Center', s.center], ['Venue', s.venue], ['Capacity', `${s.registered}/${s.capacity}`], ['Invigilator', s.invigilator], ['Examiner', s.examiner], ['Deadline', s.deadline]].map(([label, value]) => (
                    <div key={label}><span>{label}</span><strong>{value}</strong></div>
                  ))}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setView('candidates')}>{currentUser?.role === 'Seafarer' ? 'View My Access' : 'View Candidates'}</button>
                  {canManageSchedules && s.status !== 'Published' && <button className="btn btn-primary btn-sm" onClick={() => publish(s.id)}>Publish</button>}
                </div>
              </div>
            </div>
          ))}
          {!visibleSchedules.length && <div className="card"><div className="empty-state"><p>No exam schedule has been assigned to you yet.</p></div></div>}
        </div>
      )}

      {view === 'candidates' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">{currentUser?.role === 'Seafarer' ? 'My Exam Access' : 'Candidate Assignments'}</div>
          </div>
          {canManageSchedules && (
            <div className="card-body" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="form-grid-3" style={{ alignItems: 'end' }}>
                <div className="form-group"><label>Exam Session</label><select value={selectedSchedule} onChange={e => setSelectedSchedule(e.target.value)}><option value="">Select schedule</option>{schedules.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                <div className="form-group"><label>Approved Candidate</label><select value={selectedCandidate} onChange={e => setSelectedCandidate(e.target.value)} disabled={!selectedSchedule}><option value="">Select candidate</option>{unassignedCandidates.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}</select></div>
                <button className="btn btn-primary" disabled={!selectedSchedule || !selectedCandidate} onClick={assignCandidate}>Assign Candidate</button>
              </div>
            </div>
          )}
          <div className="table-wrap">
            <table>
              <thead><tr><th>Candidate</th><th>Exam Session</th><th>Seat No.</th><th>Login</th><th>Access Token</th><th>Attendance</th></tr></thead>
              <tbody>
                {visibleAssignments.map(c => {
                  const schedule = schedules.find(s => s.id === c.schedule_id);
                  return (
                    <tr key={c.id}>
                      <td><div style={{ fontWeight: 500 }}>{c.candidate}</div><div style={{ fontSize: 11, color: '#64748b' }}>{c.candidate_id}</div></td>
                      <td>{schedule?.name || c.schedule_id}</td>
                      <td><strong>{c.seat}</strong></td>
                      <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.login}</span></td>
                      <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.token}</span></td>
                      <td><span className={`badge badge-${c.attendance === 'Present' ? 'green' : c.attendance === 'Absent' ? 'red' : 'gray'}`}>{c.attendance}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!visibleAssignments.length && <div className="empty-state"><p>No candidate assignments found.</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
