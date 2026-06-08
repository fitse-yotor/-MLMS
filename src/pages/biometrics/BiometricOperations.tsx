import React, { useState } from 'react';
import { mockBiometrics, mockSeafarers } from '../../mockData';

type UpdateRequest = {
  id: string;
  seafarer_id: string;
  seafarer: string;
  reason: string;
  previous_record: string;
  new_reference: string;
  request_date: string;
  status: string;
  approved_by: string;
  approval_date: string;
  remarks: string;
};

type Device = {
  id: string;
  name: string;
  type: string;
  serial: string;
  manufacturer: string;
  model: string;
  location: string;
  status: string;
  registered: string;
  last_comm: string;
};

type Audit = {
  id: string;
  seafarer_id: string;
  activity: string;
  date: string;
  performed_by: string;
  source: string;
  ip: string;
  device: string;
  result: string;
  remarks: string;
};

const updateReasons = ['Poor Quality Capture', 'Damaged Record', 'System Migration', 'Identity Correction', 'Administrative Update'];

const initialUpdates: UpdateRequest[] = [
  { id: 'UPD-001', seafarer_id: 'SF-2024-0004', seafarer: 'Hana Tesfaye', reason: 'Poor Quality Capture', previous_record: 'BIO-003', new_reference: 'BIO-003-R1', request_date: '2024-03-12', status: 'Pending', approved_by: '', approval_date: '', remarks: 'Fingerprint record was partial.' },
];

const initialDevices: Device[] = [
  { id: 'DEV-001', name: 'AA Facial Camera 01', type: 'Camera', serial: 'CAM-77821', manufacturer: 'BioCapture', model: 'FacePro X2', location: 'Addis Ababa Center', status: 'Active', registered: '2024-01-05', last_comm: '2024-03-20 09:42' },
  { id: 'DEV-002', name: 'AA Fingerprint Scanner 02', type: 'Fingerprint Scanner', serial: 'FPS-23411', manufacturer: 'SecuScan', model: 'FP-900', location: 'Addis Ababa Center', status: 'Active', registered: '2024-01-05', last_comm: '2024-03-20 09:41' },
  { id: 'DEV-003', name: 'Hawassa Signature Pad', type: 'Signature Pad', serial: 'SIG-11245', manufacturer: 'SignWell', model: 'Pad 5', location: 'Hawassa Center', status: 'Maintenance', registered: '2024-02-10', last_comm: '2024-03-18 15:10' },
];

const initialAudit: Audit[] = [
  { id: 'BAUD-001', seafarer_id: 'SF-2024-0001', activity: 'Enrollment', date: '2024-01-12 09:15', performed_by: 'Bio. Officer Meseret', source: 'Seafarer Registration', ip: '192.168.1.12', device: 'AA Fingerprint Scanner 02', result: 'Approved', remarks: 'Enrollment completed.' },
  { id: 'BAUD-002', seafarer_id: 'SF-2024-0002', activity: 'Verification', date: '2024-03-19 14:20', performed_by: 'Bio. Officer Meseret', source: 'Certification', ip: '192.168.1.12', device: 'AA Facial Camera 01', result: 'Verified', remarks: 'Certificate verification successful.' },
  { id: 'BAUD-003', seafarer_id: 'SF-2024-0004', activity: 'Update', date: '2024-03-12 10:05', performed_by: 'Bio. Officer Alemu', source: 'Biometric Update', ip: '192.168.1.22', device: 'AA Fingerprint Scanner 02', result: 'Pending', remarks: 'Update requested for partial capture.' },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nowStamp() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export default function BiometricOperations({ currentUser }: { currentUser?: any }) {
  const [tab, setTab] = useState('updates');
  const [updates, setUpdates] = useState(initialUpdates);
  const [devices, setDevices] = useState(initialDevices);
  const [audit, setAudit] = useState(initialAudit);
  const [message, setMessage] = useState('');

  function addAudit(entry: Omit<Audit, 'id' | 'date' | 'performed_by' | 'ip'>) {
    setAudit(prev => [{
      id: `BAUD-${Date.now()}`,
      date: nowStamp(),
      performed_by: currentUser?.full_name || 'System Administrator',
      ip: '192.168.1.10',
      ...entry,
    }, ...prev]);
  }

  function notify(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Biometric Operations</div>
        <div className="page-subtitle">Manage update requests, devices, audit history, and biometric analytics</div>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="tabs">
        {[
          ['updates', 'Updates'],
          ['devices', 'Devices'],
          ['audit', 'Audit'],
          ['reports', 'Reports'],
        ].map(([id, label]) => <div key={id} className={`tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>{label}</div>)}
      </div>

      {tab === 'updates' && <UpdatesPanel updates={updates} setUpdates={setUpdates} addAudit={addAudit} notify={notify} currentUser={currentUser} />}
      {tab === 'devices' && <DevicesPanel devices={devices} setDevices={setDevices} addAudit={addAudit} notify={notify} />}
      {tab === 'audit' && <AuditPanel audit={audit} />}
      {tab === 'reports' && <ReportsPanel updates={updates} devices={devices} audit={audit} />}
    </div>
  );
}

function UpdatesPanel({ updates, setUpdates, addAudit, notify, currentUser }: {
  updates: UpdateRequest[];
  setUpdates: React.Dispatch<React.SetStateAction<UpdateRequest[]>>;
  addAudit: (entry: Omit<Audit, 'id' | 'date' | 'performed_by' | 'ip'>) => void;
  notify: (text: string) => void;
  currentUser?: any;
}) {
  const [showNew, setShowNew] = useState(false);

  function decide(id: string, status: string) {
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, status, approved_by: currentUser?.full_name || 'System Administrator', approval_date: today(), remarks: status === 'Approved' ? 'Replacement biometric reference approved.' : 'Update request rejected after review.' } : u));
    const req = updates.find(u => u.id === id);
    if (req) addAudit({ seafarer_id: req.seafarer_id, activity: 'Update', source: 'Biometric Update', device: 'Officer Workstation', result: status, remarks: `${req.reason} ${status.toLowerCase()}.` });
    notify(`Update request ${status.toLowerCase()}.`);
  }

  function addUpdate(update: UpdateRequest) {
    setUpdates(prev => [update, ...prev]);
    addAudit({ seafarer_id: update.seafarer_id, activity: 'Update', source: 'Biometric Update', device: 'Officer Workstation', result: 'Pending', remarks: update.reason });
    setShowNew(false);
    notify('Biometric update request created.');
  }

  return (
    <>
      {showNew && <UpdateModal onClose={() => setShowNew(false)} onSave={addUpdate} />}
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div className="page-subtitle">Replace outdated or unreadable biometric records after officer review.</div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Update Request</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Request ID</th><th>Seafarer</th><th>Reason</th><th>Previous Record</th><th>New Reference</th><th>Date</th><th>Status</th><th>Approved By</th><th>Actions</th></tr></thead>
            <tbody>
              {updates.map(u => (
                <tr key={u.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{u.id}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{u.seafarer}</div><div style={{ fontSize: 11, color: '#64748b' }}>{u.seafarer_id}</div></td>
                  <td>{u.reason}</td>
                  <td>{u.previous_record}</td>
                  <td>{u.new_reference}</td>
                  <td>{u.request_date}</td>
                  <td><span className={`badge badge-${u.status === 'Approved' ? 'green' : u.status === 'Rejected' ? 'red' : 'yellow'}`}>{u.status}</span></td>
                  <td>{u.approved_by || '-'}</td>
                  <td>{u.status === 'Pending' && <div style={{ display: 'flex', gap: 4 }}><button className="btn btn-success btn-xs" onClick={() => decide(u.id, 'Approved')}>Approve</button><button className="btn btn-danger btn-xs" onClick={() => decide(u.id, 'Rejected')}>Reject</button></div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function UpdateModal({ onClose, onSave }: { onClose: () => void; onSave: (update: UpdateRequest) => void }) {
  const [form, setForm] = useState({ seafarer_id: '', reason: updateReasons[0], remarks: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const record = mockBiometrics.find(b => b.seafarer_id === form.seafarer_id);
  const seafarer = mockSeafarers.find(s => s.id === form.seafarer_id);

  function save() {
    if (!form.seafarer_id) {
      setErrors({ seafarer_id: 'Required' });
      return;
    }
    onSave({
      id: `UPD-${Date.now()}`,
      seafarer_id: form.seafarer_id,
      seafarer: seafarer?.name || 'Selected Seafarer',
      reason: form.reason,
      previous_record: record?.id || 'No prior record',
      new_reference: `BIO-${Date.now()}-R`,
      request_date: today(),
      status: 'Pending',
      approved_by: '',
      approval_date: '',
      remarks: form.remarks || 'Replacement biometric reference captured.',
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">New Biometric Update Request</div><button className="modal-close" onClick={onClose}>x</button></div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Seafarer</label>
              <select value={form.seafarer_id} onChange={e => { setForm(prev => ({ ...prev, seafarer_id: e.target.value })); setErrors({}); }}>
                <option value="">Select seafarer</option>
                {mockSeafarers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
              </select>
              {errors.seafarer_id && <span className="field-error">{errors.seafarer_id}</span>}
            </div>
            <div className="form-group">
              <label>Update Reason</label>
              <select value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}>{updateReasons.map(r => <option key={r}>{r}</option>)}</select>
            </div>
          </div>
          <div className="bio-capture-grid" style={{ marginBottom: 14 }}>
            {['New Facial Reference', 'New Fingerprint Reference', 'New Signature Reference'].map(label => <div key={label} className="bio-capture-tile captured"><span>{label}</span><strong>Captured</strong></div>)}
          </div>
          <div className="form-group"><label>Remarks</label><textarea value={form.remarks} onChange={e => setForm(prev => ({ ...prev, remarks: e.target.value }))} /></div>
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={save}>Create Update Request</button></div>
      </div>
    </div>
  );
}

function DevicesPanel({ devices, setDevices, addAudit, notify }: {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  addAudit: (entry: Omit<Audit, 'id' | 'date' | 'performed_by' | 'ip'>) => void;
  notify: (text: string) => void;
}) {
  const [showNew, setShowNew] = useState(false);

  function addDevice(device: Device) {
    setDevices(prev => [device, ...prev]);
    addAudit({ seafarer_id: '-', activity: 'Device Registration', source: 'Device Management', device: device.name, result: 'Registered', remarks: `${device.type} registered at ${device.location}.` });
    setShowNew(false);
    notify('Biometric device registered.');
  }

  function toggleDevice(id: string) {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active', last_comm: nowStamp() } : d));
    notify('Device status updated.');
  }

  return (
    <>
      {showNew && <DeviceModal onClose={() => setShowNew(false)} onSave={addDevice} />}
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div className="page-subtitle">Register, activate, and monitor capture devices.</div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ Register Device</button>
      </div>
      <div className="bio-device-grid">
        {devices.map(d => (
          <div className="card" key={d.id}>
            <div className="card-body">
              <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                <div><div style={{ fontWeight: 700 }}>{d.name}</div><div style={{ fontSize: 12, color: '#64748b' }}>{d.id} / {d.serial}</div></div>
                <span className={`badge badge-${d.status === 'Active' ? 'green' : d.status === 'Maintenance' ? 'yellow' : 'gray'}`}>{d.status}</span>
              </div>
              <div className="schedule-meta">
                {[
                  ['Type', d.type],
                  ['Manufacturer', d.manufacturer],
                  ['Model', d.model],
                  ['Location', d.location],
                  ['Registered', d.registered],
                  ['Last Communication', d.last_comm],
                ].map(([k, v]) => <div key={k}><span>{k}</span><strong>{v}</strong></div>)}
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => toggleDevice(d.id)}>{d.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function DeviceModal({ onClose, onSave }: { onClose: () => void; onSave: (device: Device) => void }) {
  const [form, setForm] = useState({ name: '', type: 'Fingerprint Scanner', serial: '', manufacturer: '', model: '', location: 'Addis Ababa Center', status: 'Active' });
  function set(key: string, value: string) { setForm(prev => ({ ...prev, [key]: value })); }
  function save() {
    if (!form.name || !form.serial) return;
    onSave({ id: `DEV-${Date.now()}`, ...form, registered: today(), last_comm: nowStamp() });
  }
  return (
    <div className="modal-overlay" onClick={e => e.currentTarget === e.target && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Register Biometric Device</div><button className="modal-close" onClick={onClose}>x</button></div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group"><label>Device Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="form-group"><label>Device Type</label><select value={form.type} onChange={e => set('type', e.target.value)}><option>Fingerprint Scanner</option><option>Camera</option><option>Signature Pad</option><option>Multi-Biometric Device</option></select></div>
            <div className="form-group"><label>Serial Number</label><input value={form.serial} onChange={e => set('serial', e.target.value)} /></div>
            <div className="form-group"><label>Manufacturer</label><input value={form.manufacturer} onChange={e => set('manufacturer', e.target.value)} /></div>
            <div className="form-group"><label>Model</label><input value={form.model} onChange={e => set('model', e.target.value)} /></div>
            <div className="form-group"><label>Location</label><input value={form.location} onChange={e => set('location', e.target.value)} /></div>
          </div>
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={save}>Register Device</button></div>
      </div>
    </div>
  );
}

function AuditPanel({ audit }: { audit: Audit[] }) {
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">Biometric Audit Records</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Audit ID</th><th>Seafarer ID</th><th>Activity</th><th>Date</th><th>Performed By</th><th>Source Module</th><th>IP Address</th><th>Device</th><th>Result</th><th>Remarks</th></tr></thead>
          <tbody>
            {audit.map(a => <tr key={a.id}><td>{a.id}</td><td>{a.seafarer_id}</td><td>{a.activity}</td><td>{a.date}</td><td>{a.performed_by}</td><td>{a.source}</td><td>{a.ip}</td><td>{a.device}</td><td><span className={`badge badge-${a.result === 'Verified' || a.result === 'Approved' || a.result === 'Registered' ? 'green' : a.result === 'Pending' ? 'yellow' : 'gray'}`}>{a.result}</span></td><td>{a.remarks}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsPanel({ updates, devices, audit }: { updates: UpdateRequest[]; devices: Device[]; audit: Audit[] }) {
  const enrollments = mockBiometrics.length;
  const verifications = audit.filter(a => a.activity === 'Verification').length;
  const failed = audit.filter(a => a.activity === 'Failed Verification' || a.result === 'Rejected').length;
  const updated = updates.filter(u => u.status === 'Approved').length;
  return (
    <>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
        {[
          ['Total Enrollments', enrollments, 'blue'],
          ['Total Verifications', verifications, 'teal'],
          ['Successful Verifications', audit.filter(a => a.result === 'Verified').length, 'green'],
          ['Failed Verifications', failed, 'red'],
          ['Updated Records', updated, 'yellow'],
        ].map(([label, value, color]) => <div className="stat-card" key={String(label)}><div className={`stat-icon ${color}`}>B</div><div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div></div>)}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Device Usage Statistics</div><button className="btn btn-secondary btn-sm">Export PDF/Excel</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Device</th><th>Type</th><th>Location</th><th>Status</th><th>Audit Events</th><th>Last Communication</th></tr></thead>
            <tbody>{devices.map(d => <tr key={d.id}><td>{d.name}</td><td>{d.type}</td><td>{d.location}</td><td><span className={`badge badge-${d.status === 'Active' ? 'green' : d.status === 'Maintenance' ? 'yellow' : 'gray'}`}>{d.status}</span></td><td>{audit.filter(a => a.device === d.name).length}</td><td>{d.last_comm}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
