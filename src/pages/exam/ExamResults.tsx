import React, { useState } from 'react';
import { mockExamResults } from '../../mockData';

type Result = {
  id: string;
  seafarer_id: string;
  candidate: string;
  exam_type: string;
  date: string;
  score: number;
  pass_mark: number;
  percentage: string;
  result: string;
  published: boolean;
  approval?: string;
  approval_remarks?: string;
  evaluated_by?: string;
};

export default function ExamResults({ currentUser }: { currentUser?: any }) {
  const [tab, setTab] = useState('results');
  const [results, setResults] = useState<Result[]>(mockExamResults.map(r => ({ ...r, approval: r.published ? 'Approved' : 'Pending Approval', evaluated_by: 'Auto Scoring Engine' })));
  const [appeals, setAppeals] = useState([{ id: 'APL-001', seafarer_id: 'SF-2024-0003', candidate: 'Dawit Bekele', exam: 'Marine Engineer', score: 45, reason: 'Believe the marking was incorrect on questions 12 and 15', date: '2024-03-25', status: 'Under Review', decision: '' }]);
  const [retakes, setRetakes] = useState([{ id: 'RTK-001', seafarer_id: 'SF-2024-0003', candidate: 'Dawit Bekele', exam: 'Marine Engineer', score: 45, reason: 'Insufficient preparation, requesting another attempt', status: 'Pending' }]);
  const [showAppeal, setShowAppeal] = useState(false);
  const [message, setMessage] = useState('');
  const visibleResults = currentUser?.role === 'Seafarer'
    ? results.filter(r => r.seafarer_id === currentUser.id)
    : results;
  const visibleAppeals = currentUser?.role === 'Seafarer' ? appeals.filter(a => a.seafarer_id === currentUser.id) : appeals;
  const visibleRetakes = currentUser?.role === 'Seafarer' ? retakes.filter(r => r.seafarer_id === currentUser.id) : retakes;
  const canPublishResults = currentUser?.role === 'System Administrator';
  const canSubmitAppealOrRetake = currentUser?.role === 'Seafarer' || currentUser?.role === 'System Administrator';
  const canReviewAppealOrRetake = currentUser?.role === 'System Administrator';
  const failedOwnResult = visibleResults.find(r => r.result === 'Fail');

  function approveResult(id: string) {
    setResults(prev => prev.map(r => r.id === id ? { ...r, approval: 'Approved', approval_remarks: 'Result reviewed and approved for publication.' } : r));
    setMessage('Result approved.');
    setTimeout(() => setMessage(''), 3000);
  }

  function publishResult(id: string) {
    setResults(prev => prev.map(r => r.id === id ? { ...r, published: true, approval: 'Approved' } : r));
    setMessage('Result published. Candidate can now view and download the result slip.');
    setTimeout(() => setMessage(''), 3000);
  }

  function createAppeal(reason: string) {
    const result = failedOwnResult || visibleResults[0];
    if (!result || !reason.trim()) return;
    setAppeals(prev => [{ id: `APL-${Date.now()}`, seafarer_id: result.seafarer_id, candidate: result.candidate, exam: result.exam_type, score: result.score, reason, date: new Date().toISOString().slice(0, 10), status: 'Under Review', decision: '' }, ...prev]);
    setShowAppeal(false);
    setMessage('Appeal submitted for review.');
    setTimeout(() => setMessage(''), 3000);
  }

  function createRetake() {
    const result = failedOwnResult;
    if (!result) return;
    setRetakes(prev => [{ id: `RTK-${Date.now()}`, seafarer_id: result.seafarer_id, candidate: result.candidate, exam: result.exam_type, score: result.score, reason: 'Candidate requested a new attempt after failed result.', status: 'Pending' }, ...prev]);
    setMessage('Retake request submitted.');
    setTimeout(() => setMessage(''), 3000);
  }

  function decideAppeal(id: string, decision: string) {
    setAppeals(prev => prev.map(a => a.id === id ? { ...a, status: 'Closed', decision } : a));
    setMessage(`Appeal ${decision.toLowerCase()}.`);
    setTimeout(() => setMessage(''), 3000);
  }

  function decideRetake(id: string, status: string) {
    setRetakes(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setMessage(`Retake request ${status.toLowerCase()}.`);
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="page">
      {showAppeal && <AppealModal onClose={() => setShowAppeal(false)} onSave={createAppeal} />}
      <div className="page-header">
        <div className="page-title">Exam Results</div>
        <div className="page-subtitle">Evaluate, approve, publish, appeal, and manage retakes</div>
      </div>
      {message && <div className="alert alert-success">{message}</div>}

      <div className="tabs">
        <div className={`tab${tab === 'results' ? ' active' : ''}`} onClick={() => setTab('results')}>Results & Approval</div>
        <div className={`tab${tab === 'scoring' ? ' active' : ''}`} onClick={() => setTab('scoring')}>Scoring</div>
        <div className={`tab${tab === 'appeals' ? ' active' : ''}`} onClick={() => setTab('appeals')}>Appeals</div>
        <div className={`tab${tab === 'retakes' ? ' active' : ''}`} onClick={() => setTab('retakes')}>Retakes</div>
      </div>

      {tab === 'results' && (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
              { label: 'Total Results', value: visibleResults.length, color: 'blue' },
              { label: 'Passed', value: visibleResults.filter(r => r.result === 'Pass').length, color: 'green' },
              { label: 'Failed', value: visibleResults.filter(r => r.result === 'Fail').length, color: 'red' },
              { label: 'Pending Approval', value: visibleResults.filter(r => r.approval === 'Pending Approval').length, color: 'yellow' },
            ].map((s, i) => <div className="stat-card" key={i}><div className={`stat-icon ${s.color}`}>#</div><div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div></div>)}
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Results ({visibleResults.length})</div></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Candidate</th><th>Exam Type</th><th>Date</th><th>Score</th><th>Pass Mark</th><th>Percentage</th><th>Result</th><th>Approval</th><th>Published</th><th>Actions</th></tr></thead>
                <tbody>
                  {visibleResults.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500 }}>{r.candidate}</td>
                      <td>{r.exam_type}</td>
                      <td>{r.date}</td>
                      <td>{r.score || '-'}</td>
                      <td>{r.pass_mark}</td>
                      <td><strong>{r.percentage}</strong></td>
                      <td><span className={`badge badge-${r.result === 'Pass' ? 'green' : r.result === 'Fail' ? 'red' : 'yellow'}`}>{r.result}</span></td>
                      <td><span className={`badge badge-${r.approval === 'Approved' ? 'green' : 'yellow'}`}>{r.approval}</span></td>
                      <td><span className={`badge badge-${r.published ? 'green' : 'gray'}`}>{r.published ? 'Yes' : 'No'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {canPublishResults && r.approval !== 'Approved' && <button className="btn btn-success btn-xs" onClick={() => approveResult(r.id)}>Approve</button>}
                          {canPublishResults && !r.published && <button className="btn btn-primary btn-xs" onClick={() => publishResult(r.id)}>Publish</button>}
                          {r.published && <button className="btn btn-secondary btn-xs">Slip</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'scoring' && (
        <div className="card">
          <div className="card-header"><div className="card-title">Evaluation Queue</div></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Evaluation ID</th><th>Candidate</th><th>Attempt</th><th>Total Questions</th><th>Marks</th><th>Percentage</th><th>Evaluation Type</th><th>Evaluated By</th><th>Status</th></tr></thead>
              <tbody>
                {visibleResults.map(r => (
                  <tr key={r.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>EV-{r.id.replace('RES-', '')}</span></td>
                    <td>{r.candidate}</td>
                    <td>{r.id}</td>
                    <td>50</td>
                    <td>{r.score || 0}/100</td>
                    <td>{r.percentage}</td>
                    <td>{r.result === 'Pending' ? 'Manual Review' : 'Automatic'}</td>
                    <td>{r.evaluated_by}</td>
                    <td><span className={`badge badge-${r.result === 'Pending' ? 'yellow' : 'green'}`}>{r.result === 'Pending' ? 'Awaiting Evaluation' : 'Evaluation Complete'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'appeals' && (
        <div className="card">
          <div className="card-header"><div className="card-title">Result Appeals</div>{canSubmitAppealOrRetake && <button className="btn btn-primary btn-sm" onClick={() => setShowAppeal(true)}>+ New Appeal</button>}</div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {visibleAppeals.map(a => (
                <div key={a.id} className="record-panel">
                  <div className="flex-between">
                    <div style={{ fontWeight: 600 }}>{a.candidate} - {a.exam}</div>
                    <span className={`badge badge-${a.status === 'Closed' ? 'green' : 'yellow'}`}>{a.status}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748b', margin: '4px 0' }}>Score: {a.score}/100 / Filed: {a.date}</div>
                  <div style={{ fontSize: 13 }}>{a.reason}</div>
                  {a.decision && <div className="alert alert-info" style={{ marginTop: 10 }}>{a.decision}</div>}
                  {canReviewAppealOrRetake && a.status !== 'Closed' && <div style={{ marginTop: 12, display: 'flex', gap: 8 }}><button className="btn btn-success btn-sm" onClick={() => decideAppeal(a.id, 'Upheld')}>Uphold Appeal</button><button className="btn btn-danger btn-sm" onClick={() => decideAppeal(a.id, 'Dismissed')}>Dismiss</button></div>}
                </div>
              ))}
              {!visibleAppeals.length && <div className="empty-state"><p>No appeals found.</p></div>}
            </div>
          </div>
        </div>
      )}

      {tab === 'retakes' && (
        <div className="card">
          <div className="card-header"><div className="card-title">Retake Applications</div>{canSubmitAppealOrRetake && failedOwnResult && <button className="btn btn-primary btn-sm" onClick={createRetake}>+ Request Retake</button>}</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Candidate</th><th>Exam Type</th><th>Previous Score</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {visibleRetakes.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.candidate}</td>
                    <td>{r.exam}</td>
                    <td>{r.score}/100 (Fail)</td>
                    <td>{r.reason}</td>
                    <td><span className={`badge badge-${r.status === 'Approved' ? 'green' : r.status === 'Rejected' ? 'red' : 'yellow'}`}>{r.status}</span></td>
                    <td>{canReviewAppealOrRetake && r.status === 'Pending' && <div style={{ display: 'flex', gap: 4 }}><button className="btn btn-success btn-xs" onClick={() => decideRetake(r.id, 'Approved')}>Approve</button><button className="btn btn-danger btn-xs" onClick={() => decideRetake(r.id, 'Rejected')}>Reject</button></div>}</td>
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

function AppealModal({ onClose, onSave }: { onClose: () => void; onSave: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal" style={{ width: 560 }}>
        <div className="modal-header"><div className="modal-title">Submit Appeal</div><button className="modal-close" onClick={onClose}>x</button></div>
        <div className="modal-body">
          <div className="form-group"><label>Appeal Reason</label><textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain why the result should be reviewed..." /></div>
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => onSave(reason)}>Submit Appeal</button></div>
      </div>
    </div>
  );
}
