import React, { useState } from 'react';
import { mockBiometrics, mockSeafarers } from '../../mockData';

type VerificationLog = {
  id: string;
  seafarer_id: string;
  seafarer: string;
  type: string;
  method: string;
  score: number;
  result: string;
  officer: string;
  date: string;
  remarks: string;
};

const verificationTypes = [
  'Registration Verification',
  'Examination Verification',
  'Certificate Verification',
  "Seafarer's Book Verification",
  'Profile Update Verification',
];

const initialLogs: VerificationLog[] = [
  { id: 'VER-001', seafarer_id: 'SF-2024-0001', seafarer: 'Abebe Girma', type: 'Examination Verification', method: 'Facial + Fingerprint', score: 97, result: 'Verified', officer: 'Bio. Officer Meseret', date: '2024-03-20 09:45', remarks: 'Access allowed.' },
  { id: 'VER-002', seafarer_id: 'SF-2024-0002', seafarer: 'Tigist Haile', type: 'Certificate Verification', method: 'Facial + Fingerprint', score: 96, result: 'Verified', officer: 'Bio. Officer Meseret', date: '2024-03-19 14:20', remarks: 'Certificate identity confirmed.' },
  { id: 'VER-003', seafarer_id: 'SF-2024-0005', seafarer: 'Yonas Teshome', type: "Seafarer's Book Verification", method: 'Fingerprint', score: 93, result: 'Verified', officer: 'Bio. Officer Fikre', date: '2024-03-18 11:05', remarks: 'Book application may continue.' },
];

function scoreFor(seafarerId: string, type: string, method: string) {
  const enrolled = mockBiometrics.find(b => b.seafarer_id === seafarerId && b.status === 'Approved');
  if (!enrolled) return 54;
  const seed = `${seafarerId}-${type}-${method}`;
  const total = seed.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return 92 + (total % 8);
}

function nowStamp() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export default function BiometricVerification({ currentUser }: { currentUser?: any }) {
  const [seafarerId, setSeafarerId] = useState('SF-2024-0001');
  const [verificationType, setVerificationType] = useState('Examination Verification');
  const [method, setMethod] = useState('Facial + Fingerprint');
  const [liveFace, setLiveFace] = useState(false);
  const [liveFinger, setLiveFinger] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationLog | null>(null);
  const [logs, setLogs] = useState<VerificationLog[]>(initialLogs);
  const selectedSeafarer = mockSeafarers.find(s => s.id === seafarerId);
  const storedRecord = mockBiometrics.find(b => b.seafarer_id === seafarerId);

  function simulate() {
    if (!selectedSeafarer) return;
    setVerifying(true);
    setTimeout(() => {
      const score = scoreFor(seafarerId, verificationType, method);
      const nextResult: VerificationLog = {
        id: `VER-${Date.now()}`,
        seafarer_id: seafarerId,
        seafarer: selectedSeafarer.name,
        type: verificationType,
        method,
        score,
        result: score >= 90 ? 'Verified' : 'Rejected',
        officer: currentUser?.full_name || 'System Administrator',
        date: nowStamp(),
        remarks: score >= 90 ? 'Identity confirmed. Transaction may continue.' : 'Match score below threshold. Transaction rejected.',
      };
      setResult(nextResult);
      setLogs(prev => [nextResult, ...prev]);
      setVerifying(false);
    }, 900);
  }

  function reset() {
    setResult(null);
    setLiveFace(false);
    setLiveFinger(false);
  }

  const canVerify = selectedSeafarer && storedRecord && (liveFace || liveFinger);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Biometric Verification</div>
        <div className="page-subtitle">Verify seafarer identity using stored records and live capture comparison</div>
      </div>

      <div className="workflow" style={{ marginBottom: 24 }}>
        {['Search Profile', 'Capture Live Biometric', 'Match Comparison', 'Verification Result', 'Allow / Reject'].map((s, i, arr) => (
          <React.Fragment key={s}>
            <div className={`workflow-step ${result ? (i <= 4 ? 'done' : '') : i === 1 ? 'active' : i < 1 ? 'done' : ''}`}>{s}</div>
            {i < arr.length - 1 && <span className="workflow-arrow">-&gt;</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header"><div className="card-title">Verification Request</div></div>
          <div className="card-body">
            <div className="form-group">
              <label>Verification Type</label>
              <select value={verificationType} onChange={e => setVerificationType(e.target.value)}>
                {verificationTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Seafarer</label>
              <select value={seafarerId} onChange={e => { setSeafarerId(e.target.value); reset(); }}>
                {mockSeafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Verification Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)}>
                <option>Facial + Fingerprint</option>
                <option>Facial</option>
                <option>Fingerprint</option>
                <option>Signature</option>
              </select>
            </div>
            {selectedSeafarer && (
              <div className="bio-profile-card">
                <div className="bio-avatar">{selectedSeafarer.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{selectedSeafarer.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{selectedSeafarer.id} / {selectedSeafarer.status}</div>
                  <div style={{ fontSize: 12, color: storedRecord ? '#15803d' : '#dc2626' }}>
                    {storedRecord ? `Stored record: ${storedRecord.id}` : 'No stored biometric record'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Live Biometric Capture</div></div>
          <div className="card-body">
            <div className="bio-capture-grid" style={{ marginBottom: 16 }}>
              <button className={`bio-capture-tile ${liveFace ? 'captured' : 'pending'}`} onClick={() => setLiveFace(true)}>
                <span>Facial Scan</span>
                <strong>{liveFace ? 'Captured' : 'Click to capture'}</strong>
              </button>
              <button className={`bio-capture-tile ${liveFinger ? 'captured' : 'pending'}`} onClick={() => setLiveFinger(true)}>
                <span>Fingerprint</span>
                <strong>{liveFinger ? 'Captured' : 'Click to capture'}</strong>
              </button>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={simulate} disabled={verifying || !canVerify}>
              {verifying ? 'Comparing...' : 'Verify Identity'}
            </button>
            {!storedRecord && <div className="alert alert-danger" style={{ marginTop: 14 }}>No approved biometric record found for this seafarer.</div>}
          </div>
        </div>
      </div>

      {result && (
        <div className="card">
          <div className="card-header"><div className="card-title">Verification Result</div></div>
          <div className="card-body">
            <div className={`bio-result ${result.result === 'Verified' ? 'success' : 'danger'}`}>
              <div className="bio-result-mark">{result.result === 'Verified' ? 'OK' : 'NO'}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{result.result === 'Verified' ? 'Identity Verified' : 'Identity Rejected'}</div>
                <div style={{ fontSize: 13.5, marginTop: 4 }}>{result.remarks}</div>
                <div className="bio-result-metrics">
                  {[
                    ['Verification ID', result.id],
                    ['Match Score', `${result.score}%`],
                    ['Method', result.method],
                    ['Officer', result.officer],
                    ['Time', result.date],
                  ].map(([k, v]) => <div key={k}><span>{k}</span><strong>{v}</strong></div>)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className={`btn ${result.result === 'Verified' ? 'btn-success' : 'btn-danger'}`}>{result.result === 'Verified' ? 'Allow Transaction' : 'Reject Transaction'}</button>
              <button className="btn btn-secondary" onClick={reset}>New Verification</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><div className="card-title">Recent Verification Log</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Verification ID</th><th>Seafarer</th><th>Type</th><th>Method</th><th>Score</th><th>Result</th><th>Officer</th><th>Date & Time</th></tr></thead>
            <tbody>
              {logs.map(row => (
                <tr key={row.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{row.id}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{row.seafarer}</div><div style={{ fontSize: 11, color: '#64748b' }}>{row.seafarer_id}</div></td>
                  <td>{row.type}</td>
                  <td>{row.method}</td>
                  <td><strong style={{ color: row.score >= 90 ? '#16a34a' : '#dc2626' }}>{row.score}%</strong></td>
                  <td><span className={`badge badge-${row.result === 'Verified' ? 'green' : 'red'}`}>{row.result}</span></td>
                  <td>{row.officer}</td>
                  <td style={{ fontSize: 12.5 }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
