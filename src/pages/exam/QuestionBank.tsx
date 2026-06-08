import React, { useState } from 'react';
import { mockQuestions } from '../../mockData';

type Question = {
  id: string;
  code: string;
  exam_type?: string;
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
  text: string;
  marks?: number;
  status: string;
  options?: string[];
  correct?: string;
  explanation?: string;
  reviewer_remarks?: string;
};

const blankQuestion = {
  exam_type: 'Basic Safety',
  subject: '',
  topic: '',
  difficulty: 'Medium',
  type: 'MCQ',
  text: '',
  marks: 1,
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correct: 'A',
  explanation: '',
};

function QuestionModal({ initial, onClose, onSave }: { initial?: Question | null; onClose: () => void; onSave: (q: Question) => void }) {
  const [form, setForm] = useState({
    ...blankQuestion,
    ...(initial ? {
      exam_type: initial.exam_type || 'Basic Safety',
      subject: initial.subject,
      topic: initial.topic,
      difficulty: initial.difficulty,
      type: initial.type,
      text: initial.text,
      marks: initial.marks || 1,
      optionA: initial.options?.[0] || '',
      optionB: initial.options?.[1] || '',
      optionC: initial.options?.[2] || '',
      optionD: initial.options?.[3] || '',
      correct: initial.correct || 'A',
      explanation: initial.explanation || '',
    } : {}),
  });
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
    ['subject', 'topic', 'text', 'optionA', 'optionB', 'optionC', 'optionD'].forEach(key => {
      if (!(form as any)[key]) nextErrors[key] = 'Required';
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const prefix = form.subject.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || 'GEN';
    onSave({
      id: initial?.id || `Q-${Date.now()}`,
      code: initial?.code || `Q-${prefix}-${Math.floor(Math.random() * 900 + 100)}`,
      exam_type: form.exam_type,
      subject: form.subject,
      topic: form.topic,
      difficulty: form.difficulty,
      type: form.type,
      text: form.text,
      marks: Number(form.marks),
      status: initial?.status === 'Approved' ? 'Under Review' : initial?.status || 'Draft',
      options: [form.optionA, form.optionB, form.optionC, form.optionD],
      correct: form.correct,
      explanation: form.explanation,
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal" style={{ width: 840 }}>
        <div className="modal-header">
          <div className="modal-title">{initial ? 'Edit Question' : 'New Question'}</div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        <div className="modal-body">
          <div className="form-grid-3">
            <div className="form-group"><label>Exam Type</label><select value={form.exam_type} onChange={e => set('exam_type', e.target.value)}><option>Basic Safety</option><option>Able Seafarer Deck</option><option>Deck Officer</option><option>Marine Engineer</option></select></div>
            <div className="form-group"><label>Subject Area</label><input value={form.subject} onChange={e => set('subject', e.target.value)} />{errors.subject && <span className="field-error">{errors.subject}</span>}</div>
            <div className="form-group"><label>Topic</label><input value={form.topic} onChange={e => set('topic', e.target.value)} />{errors.topic && <span className="field-error">{errors.topic}</span>}</div>
            <div className="form-group"><label>Difficulty</label><select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
            <div className="form-group"><label>Question Type</label><select value={form.type} onChange={e => set('type', e.target.value)}><option>MCQ</option><option>True/False</option><option>Short Answer</option></select></div>
            <div className="form-group"><label>Marks</label><input type="number" min="1" value={form.marks} onChange={e => set('marks', e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Question Text</label><textarea value={form.text} onChange={e => set('text', e.target.value)} />{errors.text && <span className="field-error">{errors.text}</span>}</div>
          <div className="form-grid">
            {(['A', 'B', 'C', 'D'] as const).map(letter => {
              const key = `option${letter}`;
              return <div className="form-group" key={letter}><label>Option {letter}</label><input value={(form as any)[key]} onChange={e => set(key, e.target.value)} />{errors[key] && <span className="field-error">{errors[key]}</span>}</div>;
            })}
          </div>
          <div className="form-grid">
            <div className="form-group"><label>Correct Answer</label><select value={form.correct} onChange={e => set('correct', e.target.value)}><option>A</option><option>B</option><option>C</option><option>D</option></select></div>
            <div className="form-group"><label>Answer Explanation</label><input value={form.explanation} onChange={e => set('explanation', e.target.value)} /></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary" onClick={() => save()}>Save Draft</button>
          <button className="btn btn-primary" onClick={save}>{initial ? 'Submit Update' : 'Submit for Review'}</button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionBank({ currentUser }: { currentUser?: any }) {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions.map(q => ({
    ...q,
    exam_type: q.subject,
    marks: 1,
    options: ['Inflate the jacket and wear over clothing', 'Wear the jacket directly under water', 'Store it in the emergency locker', 'Share it with another person'],
    correct: 'A',
    explanation: 'Only approved procedures should be followed during emergency preparation.',
  })));
  const [selected, setSelected] = useState<string | null>(questions[0]?.id || null);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState<Question | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const sel = questions.find(q => q.id === selected);
  const canCreateQuestion = currentUser?.role === 'System Administrator';
  const canReviewQuestion = currentUser?.role === 'System Administrator';
  const filtered = questions.filter(q => [q.code, q.subject, q.topic, q.status].join(' ').toLowerCase().includes(filter.toLowerCase()));

  function saveQuestion(q: Question) {
    setQuestions(prev => prev.some(item => item.id === q.id) ? prev.map(item => item.id === q.id ? q : item) : [q, ...prev]);
    setSelected(q.id);
    setEditing(undefined);
    setMessage(q.status === 'Draft' ? 'Question saved as draft.' : 'Question submitted for review.');
    setTimeout(() => setMessage(''), 3000);
  }

  function updateStatus(id: string, status: string, remarks?: string) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status, reviewer_remarks: remarks } : q));
    setMessage(`Question ${status.toLowerCase()}.`);
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="page">
      {editing !== undefined && <QuestionModal initial={editing || null} onClose={() => setEditing(undefined)} onSave={saveQuestion} />}
      <div className="flex-between page-header">
        <div><div className="page-title">Question Bank</div><div className="page-subtitle">Create, review, approve, and maintain examination questions</div></div>
        {canCreateQuestion && <button className="btn btn-primary" onClick={() => setEditing(null)}>+ New Question</button>}
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="exam-question-layout">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Questions ({filtered.length})</div>
            <input placeholder="Search questions..." value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 240 }} />
          </div>
          <div className="question-list">
            {filtered.map(q => (
              <button key={q.id} className={`question-row ${selected === q.id ? 'active' : ''}`} onClick={() => setSelected(q.id)}>
                <div>
                  <div className="question-row-title">{q.code} - {q.topic}</div>
                  <div className="question-row-meta">{q.subject} / {q.difficulty} / {q.type}</div>
                </div>
                <span className={`badge badge-${q.status === 'Approved' ? 'green' : q.status === 'Rejected' ? 'red' : q.status === 'Draft' ? 'gray' : 'yellow'}`}>{q.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {sel ? (
            <>
              <div className="card-header">
                <div>
                  <div className="card-title">Question Detail</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sel.code}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {canCreateQuestion && <button className="btn btn-secondary btn-sm" onClick={() => setEditing(sel)}>Edit</button>}
                  {canReviewQuestion && sel.status !== 'Approved' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(sel.id, 'Approved', 'Question approved for examination generation.')}>Approve</button>}
                  {canReviewQuestion && sel.status !== 'Rejected' && <button className="btn btn-danger btn-sm" onClick={() => updateStatus(sel.id, 'Rejected', 'Question requires revision before use.')}>Reject</button>}
                </div>
              </div>
              <div className="card-body">
                <div className="info-grid" style={{ marginBottom: 16 }}>
                  {[['Exam Type', sel.exam_type || sel.subject], ['Subject', sel.subject], ['Topic', sel.topic], ['Difficulty', sel.difficulty], ['Type', sel.type], ['Marks', String(sel.marks || 1)]].map(([k, v]) => (
                    <div className="info-item" key={k}><label>{k}</label><div className="info-value">{v}</div></div>
                  ))}
                </div>
                <div className="question-text">{sel.text}</div>
                <div className="answer-options">
                  {(sel.options || []).map((opt, i) => {
                    const letter = ['A', 'B', 'C', 'D'][i];
                    return <div key={letter} className={`answer-option ${sel.correct === letter ? 'correct' : ''}`}><strong>{letter}.</strong> {opt}{sel.correct === letter && <span>Correct</span>}</div>;
                  })}
                </div>
                {sel.explanation && <div className="alert alert-info" style={{ marginTop: 16 }}>{sel.explanation}</div>}
                {sel.reviewer_remarks && <div className="alert alert-warning" style={{ marginTop: 12 }}>{sel.reviewer_remarks}</div>}
              </div>
            </>
          ) : <div className="empty-state"><p>Select a question to inspect it.</p></div>}
        </div>
      </div>
    </div>
  );
}
