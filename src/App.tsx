import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SeafarerList from './pages/seafarer/SeafarerList';
import SeafarerDetail from './pages/seafarer/SeafarerDetail';
import SeafarerRegistration from './pages/seafarer/SeafarerRegistration';
import TrainingRecords from './pages/seafarer/TrainingRecords';
import MedicalRecords from './pages/seafarer/MedicalRecords';
import SeaServiceRecords from './pages/seafarer/SeaServiceRecords';
import CertificationApplications from './pages/seafarer/CertificationApplications';
import SeafarerBooks from './pages/seafarer/SeafarerBooks';
import BiometricEnrollment from './pages/biometrics/BiometricEnrollment';
import BiometricVerification from './pages/biometrics/BiometricVerification';
import BiometricOperations from './pages/biometrics/BiometricOperations';
import ExamApplications from './pages/exam/ExamApplications';
import QuestionBank from './pages/exam/QuestionBank';
import ExamSchedules from './pages/exam/ExamSchedules';
import ExamResults from './pages/exam/ExamResults';
import ExamOperations from './pages/exam/ExamOperations';
import LogisticsOperators from './pages/logistics/LogisticsOperators';
import VesselOwners from './pages/vessel/VesselOwners';
import VesselList from './pages/vessel/VesselList';
import VesselInspections from './pages/vessel/VesselInspections';
import VesselPermits from './pages/vessel/VesselPermits';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import UserManagement from './pages/UserManagement';
import { mockNotifications } from './mockData';
import { AppUser } from './mockUsers';

export type Page =
  | 'dashboard'
  | 'seafarer-list' | 'seafarer-detail' | 'seafarer-registration'
  | 'training' | 'medical' | 'sea-service' | 'certifications' | 'books'
  | 'bio-enrollment' | 'bio-verification' | 'bio-operations'
  | 'exam-applications' | 'question-bank' | 'exam-schedules' | 'exam-results' | 'exam-operations'
  | 'logistics'
  | 'vessel-owners' | 'vessel-list' | 'vessel-inspections' | 'vessel-permits'
  | 'reports' | 'audit' | 'users';

interface NavItem { label: string; page: Page; icon: string; }

const ADMIN_ROLE = 'System Administrator';
const ALL_ROLES = ['*'];

// Roles that work in the Seafarer Management section
const SEAFARER_MGMT_ROLES = [
  ADMIN_ROLE,
  'Registration Officer',
  'Verification Officer',
  'Medical Officer',
  'Certification Officer',
  "Seafarer's Book Officer",
  'Management User',
  'Auditor',
  'Seafarer',
];

const pageAccess: Record<Page, string[]> = {
  dashboard: ALL_ROLES,

  // Seafarer Management — visible to all seafarer-management roles + seafarers themselves
  'seafarer-list':         SEAFARER_MGMT_ROLES,
  'seafarer-detail':       SEAFARER_MGMT_ROLES,
  'seafarer-registration': [ADMIN_ROLE, 'Registration Officer', 'Seafarer'],
  training:                [ADMIN_ROLE, 'Registration Officer', 'Verification Officer', 'Certification Officer', 'Management User', 'Auditor', 'Seafarer'],
  medical:                 [ADMIN_ROLE, 'Medical Officer', 'Verification Officer', 'Management User', 'Auditor', 'Seafarer'],
  'sea-service':           [ADMIN_ROLE, 'Registration Officer', 'Verification Officer', 'Certification Officer', 'Management User', 'Auditor', 'Seafarer'],
  certifications:          [ADMIN_ROLE, 'Certification Officer', 'Verification Officer', 'Management User', 'Auditor', 'Seafarer'],
  books:                   [ADMIN_ROLE, "Seafarer's Book Officer", 'Management User', 'Auditor', 'Seafarer'],

  // Biometrics
  'bio-enrollment':  [ADMIN_ROLE, 'Biometric Officer', 'Management User', 'Auditor'],
  'bio-verification':[ADMIN_ROLE, 'Biometric Officer', 'Management User', 'Auditor'],
  'bio-operations':  [ADMIN_ROLE, 'Biometric Officer', 'Management User', 'Auditor'],

  // Examination
  'exam-applications': [ADMIN_ROLE, 'Exam Administrator', 'Management User', 'Auditor', 'Seafarer'],
  'question-bank':     [ADMIN_ROLE, 'Exam Administrator', 'Question Bank Officer', 'Question Reviewer'],
  'exam-schedules':    [ADMIN_ROLE, 'Exam Administrator', 'Invigilator', 'Management User', 'Seafarer'],
  'exam-results':      [ADMIN_ROLE, 'Exam Administrator', 'Evaluator', 'Result Approval Officer', 'Management User', 'Auditor', 'Seafarer'],
  'exam-operations':   [ADMIN_ROLE, 'Exam Administrator', 'Invigilator', 'Evaluator'],

  // Logistics
  logistics: [ADMIN_ROLE, 'Logistics Operator', 'Service Officer', 'Management User', 'Auditor'],

  // Vessel Management
  'vessel-owners':     [ADMIN_ROLE, 'Inspection Officer', 'Licensing Officer', 'Management User', 'Auditor', 'Vessel Owner'],
  'vessel-list':       [ADMIN_ROLE, 'Inspection Officer', 'Licensing Officer', 'Management User', 'Auditor', 'Vessel Owner'],
  'vessel-inspections':[ADMIN_ROLE, 'Inspection Officer', 'Management User', 'Auditor', 'Vessel Owner'],
  'vessel-permits':    [ADMIN_ROLE, 'Licensing Officer', 'Management User', 'Auditor', 'Vessel Owner'],

  // Administration
  reports: [ADMIN_ROLE, 'Management User', 'Auditor'],
  audit:   [ADMIN_ROLE, 'Auditor'],
  users:   [ADMIN_ROLE],
};

function canAccessPage(user: AppUser, targetPage: Page) {
  const allowed = pageAccess[targetPage] || [];
  return user.role === ADMIN_ROLE || allowed.includes('*') || allowed.includes(user.role);
}

function firstAllowedPage(user: AppUser): Page {
  return (Object.keys(pageAccess) as Page[]).find(p => canAccessPage(user, p)) || 'dashboard';
}

const seafarerNav: NavItem[] = [
  { label: 'Seafarer Registry', page: 'seafarer-list', icon: '👥' },
  { label: 'Registration', page: 'seafarer-registration', icon: '📝' },
  { label: 'Training Records', page: 'training', icon: '🎓' },
  { label: 'Medical Records', page: 'medical', icon: '🏥' },
  { label: 'Sea Service Records', page: 'sea-service', icon: '⚓' },
  { label: 'Certifications', page: 'certifications', icon: '📜' },
  { label: "Seafarer's Books", page: 'books', icon: '📕' },
];
const bioNav: NavItem[] = [
  { label: 'Enrollment', page: 'bio-enrollment', icon: '🖐' },
  { label: 'Verification', page: 'bio-verification', icon: 'V' },
  { label: 'Operations', page: 'bio-operations', icon: 'O' },
];
const examNav: NavItem[] = [
  { label: 'Applications', page: 'exam-applications', icon: '📋' },
  { label: 'Question Bank', page: 'question-bank', icon: '❓' },
  { label: 'Schedules', page: 'exam-schedules', icon: '📅' },
  { label: 'Results', page: 'exam-results', icon: '🏆' },
  { label: 'Operations', page: 'exam-operations', icon: 'O' },
];
const vesselNav: NavItem[] = [
  { label: 'Vessel Owners', page: 'vessel-owners', icon: '🏢' },
  { label: 'Vessel Registry', page: 'vessel-list', icon: '🚢' },
  { label: 'Inspections', page: 'vessel-inspections', icon: '🔎' },
  { label: 'Permits & Licenses', page: 'vessel-permits', icon: '📋' },
];

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  'seafarer-list': 'Seafarer Registry', 'seafarer-detail': 'Seafarer Profile',
  'seafarer-registration': 'Seafarer Registration',
  training: 'Training Records', medical: 'Medical Records',
  'sea-service': 'Sea Service Records', certifications: 'Certifications',
  books: "Seafarer's Books",
  'bio-enrollment': 'Biometric Enrollment', 'bio-verification': 'Biometric Verification',
  'bio-operations': 'Biometric Operations',
  'exam-applications': 'Exam Applications', 'question-bank': 'Question Bank',
  'exam-schedules': 'Exam Schedules', 'exam-results': 'Exam Results',
  'exam-operations': 'Exam Operations',
  logistics: 'Logistics Operators',
  'vessel-owners': 'Vessel Owners', 'vessel-list': 'Vessel Registry',
  'vessel-inspections': 'Vessel Inspections', 'vessel-permits': 'Permits & Licenses',
  reports: 'Reports & Analytics', audit: 'Audit Logs', users: 'User Management',
};

const roleColors: Record<string, string> = {
  'System Administrator':   '#7c3aed',
  'Management User':        '#0369a1',
  'Auditor':                '#92400e',
  'Registration Officer':   '#1e40af',
  'Verification Officer':   '#065f46',
  'Medical Officer':        '#be185d',
  'Certification Officer':  '#b45309',
  "Seafarer's Book Officer":'#6b21a8',
  'Biometric Officer':      '#0f766e',
  'Exam Administrator':     '#dc2626',
  'Inspection Officer':     '#7c3aed',
  'Licensing Officer':      '#1d4ed8',
  'Seafarer':               '#15803d',
  'Vessel Owner':           '#b45309',
  'Logistics Operator':     '#0f766e',
};

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedSeafarerId, setSelectedSeafarerId] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('appearance');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const unread = mockNotifications.filter(n => !n.read).length;

  if (!currentUser) {
    return <Login onLogin={user => { setCurrentUser(user); setPage(firstAllowedPage(user)); }} />;
  }

  function navigate(p: Page) {
    setPage(canAccessPage(currentUser!, p) ? p : firstAllowedPage(currentUser!));
    setShowNotifs(false);
    setShowUserMenu(false);
    setSidebarOpen(false);
  }

  function NavSection({ title, items }: { title: string; items: NavItem[] }) {
    const visibleItems = items.filter(item => canAccessPage(currentUser!, item.page));
    if (visibleItems.length === 0) return null;
    return (
      <div className="sidebar-section">
        <div className="sidebar-section-label">{title}</div>
        {visibleItems.map(item => (
          <div key={item.page} className={`sidebar-item${page === item.page ? ' active' : ''}`} onClick={() => navigate(item.page)}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </div>
    );
  }

  function renderPage() {
    if (!canAccessPage(currentUser!, page)) {
      return (
        <div className="page">
          <div className="card">
            <div className="card-body" style={{ padding: 32 }}>
              <div className="page-title">Access Restricted</div>
              <div className="page-subtitle" style={{ marginTop: 6 }}>
                Your role, {currentUser!.role}, does not have permission to open {pageTitles[page]}.
              </div>
              <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => navigate(firstAllowedPage(currentUser!))}>Go to Allowed Area</button>
            </div>
          </div>
        </div>
      );
    }

    switch (page) {
      case 'dashboard': return <Dashboard navigate={navigate} currentUser={currentUser} />;
      case 'seafarer-list': return <SeafarerList currentUser={currentUser} onView={id => { setSelectedSeafarerId(id); setPage('seafarer-detail'); }} onNew={() => navigate('seafarer-registration')} canCreate={canAccessPage(currentUser!, 'seafarer-registration')} />;
      case 'seafarer-detail': return <SeafarerDetail id={selectedSeafarerId || 'SF-2024-0001'} onBack={() => navigate('seafarer-list')} />;
      case 'seafarer-registration': return <SeafarerRegistration onBack={() => navigate('seafarer-list')} />;
      case 'training': return <TrainingRecords currentUser={currentUser} />;
      case 'medical': return <MedicalRecords currentUser={currentUser} />;
      case 'sea-service': return <SeaServiceRecords currentUser={currentUser} />;
      case 'certifications': return <CertificationApplications currentUser={currentUser} />;
      case 'books': return <SeafarerBooks currentUser={currentUser} />;
      case 'bio-enrollment': return <BiometricEnrollment currentUser={currentUser} />;
      case 'bio-verification': return <BiometricVerification currentUser={currentUser} />;
      case 'bio-operations': return <BiometricOperations currentUser={currentUser} />;
      case 'exam-applications': return <ExamApplications currentUser={currentUser} />;
      case 'question-bank': return <QuestionBank currentUser={currentUser} />;
      case 'exam-schedules': return <ExamSchedules currentUser={currentUser} />;
      case 'exam-results': return <ExamResults currentUser={currentUser} />;
      case 'exam-operations': return <ExamOperations currentUser={currentUser} />;
      case 'logistics': return <LogisticsOperators currentUser={currentUser} />;
      case 'vessel-owners': return <VesselOwners currentUser={currentUser} />;
      case 'vessel-list': return <VesselList currentUser={currentUser} />;
      case 'vessel-inspections': return <VesselInspections currentUser={currentUser} />;
      case 'vessel-permits': return <VesselPermits currentUser={currentUser} />;
      case 'reports': return <Reports />;
      case 'audit': return <AuditLogs />;
      case 'users': return <UserManagement />;
      default: return <Dashboard navigate={navigate} />;
    }
  }

  const parent = page.startsWith('seafarer') || page === 'training' || page === 'medical' || page === 'sea-service' || page === 'certifications' || page === 'books'
    ? 'Seafarer Management'
    : page.startsWith('bio') ? 'Biometrics'
    : page.startsWith('exam') || page === 'question-bank' ? 'Examination'
    : page === 'logistics' ? 'Logistics'
    : page.startsWith('vessel') ? 'Vessel Management'
    : '';

  const avatarColor = roleColors[currentUser.role] || '#374151';

  return (
    <div className="app-layout">
      {/* Mobile sidebar overlay */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar${sidebarOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">M</div>
          <div>
            <div className="logo-text">MLMS</div>
            <div className="logo-sub">Maritime & Logistics System</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className={`sidebar-item${page === 'dashboard' ? ' active' : ''}`} onClick={() => navigate('dashboard')}>
            <span>🏠</span> Dashboard
          </div>
        </div>

        <NavSection title="Seafarer Management" items={seafarerNav} />
        <NavSection title="Biometrics" items={bioNav} />
        <NavSection title="Examination" items={examNav} />

        <NavSection title="Logistics" items={[{ label: 'Logistics Operators', page: 'logistics', icon: '🚛' }]} />

        <NavSection title="Vessel Management" items={vesselNav} />

        <NavSection title="Administration" items={[
          { label: 'Reports & Analytics', page: 'reports', icon: '📊' },
          { label: 'Audit Logs', page: 'audit', icon: '🔒' },
          { label: 'User Management', page: 'users', icon: '👤' },
        ]} />
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="4" width="16" height="2" rx="1"/>
                <rect x="2" y="9" width="16" height="2" rx="1"/>
                <rect x="2" y="14" width="16" height="2" rx="1"/>
              </svg>
            </button>
            <div className="topbar-breadcrumb">
              {parent && <>{parent} / </>}<span>{pageTitles[page]}</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-notif" onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}>
              🔔
              {unread > 0 && <div className="notif-badge">{unread}</div>}
              {showNotifs && (
                <div style={{ position: 'absolute', top: 32, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, width: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 300 }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 14 }}>Notifications</div>
                  {mockNotifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: n.read ? '#fff' : '#eff6ff' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{n.type}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{n.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.15s' }}
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ textAlign: 'right' }} className="topbar-user-info">
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{currentUser.full_name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{currentUser.role}</div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                  {currentUser.avatar}
                </div>
              </div>
              {showUserMenu && (
                <div style={{ position: 'absolute', top: 44, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, width: 220, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 300, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{currentUser.full_name}</div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{currentUser.email}</div>
                    <span style={{ display: 'inline-block', marginTop: 6, fontSize: 11, padding: '2px 8px', borderRadius: 12, background: avatarColor, color: '#fff', fontWeight: 500 }}>{currentUser.role}</span>
                  </div>
                  <div style={{ padding: 6 }}>
                    <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => { setShowProfile(true); setShowUserMenu(false); }}>
                      👤 My Profile
                    </div>
                    <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => { setShowSettings(true); setShowUserMenu(false); }}>
                      ⚙ Settings
                    </div>
                    <div style={{ height: 1, background: '#e2e8f0', margin: '4px 0' }} />
                    <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#dc2626', fontWeight: 500 }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => { setCurrentUser(null); setShowUserMenu(false); }}>
                      🚪 Sign Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderPage()}
      </div>

      {/* ── My Profile Modal ── */}
      {showProfile && currentUser && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowProfile(false)}>
          <div className="modal" style={{ width: 520 }}>
            <div className="modal-header">
              <div className="modal-title">👤 My Profile</div>
              <button className="modal-close" onClick={() => setShowProfile(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                  {currentUser.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{currentUser.full_name}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{currentUser.email}</div>
                  <span style={{ display: 'inline-block', marginTop: 6, fontSize: 11.5, padding: '3px 10px', borderRadius: 12, background: avatarColor, color: '#fff', fontWeight: 500 }}>{currentUser.role}</span>
                </div>
              </div>

              {/* Details */}
              <div className="info-grid" style={{ marginBottom: 20 }}>
                {[
                  ['User ID',    currentUser.id],
                  ['Username',   currentUser.username],
                  ['Department', currentUser.department],
                  ['Role',       currentUser.role],
                  ['Email',      currentUser.email],
                  ['Status',     'Active'],
                ].map(([k, v]) => (
                  <div className="info-item" key={k}>
                    <label>{k}</label>
                    <div className="info-value">{k === 'Status' ? <span className="badge badge-green">{v}</span> : v}</div>
                  </div>
                ))}
              </div>

              {/* Permissions */}
              <div className="form-section-title" style={{ marginBottom: 10 }}>Permissions</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {currentUser.permissions.map(p => (
                  <span key={p} className="badge badge-blue" style={{ fontSize: 11 }}>{p}</span>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowProfile(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Settings Modal ── */}
      {showSettings && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowSettings(false)}>
          <div className="modal" style={{ width: 560 }}>
            <div className="modal-header">
              <div className="modal-title">⚙ Settings</div>
              <button className="modal-close" onClick={() => setShowSettings(false)}>×</button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              {/* Settings tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                {[
                  { key: 'appearance', label: '🎨 Appearance' },
                  { key: 'notifications', label: '🔔 Notifications' },
                  { key: 'security', label: '🔒 Security' },
                ].map(t => (
                  <div key={t.key} onClick={() => setSettingsTab(t.key)}
                    style={{ padding: '12px 18px', fontSize: 13, fontWeight: settingsTab === t.key ? 600 : 400, color: settingsTab === t.key ? '#1e40af' : '#64748b', borderBottom: `2px solid ${settingsTab === t.key ? '#1e40af' : 'transparent'}`, cursor: 'pointer', marginBottom: -1 }}>
                    {t.label}
                  </div>
                ))}
              </div>

              <div style={{ padding: 22 }}>
                {settingsTab === 'appearance' && (
                  <>
                    <div className="form-section-title" style={{ marginBottom: 14 }}>Display Preferences</div>
                    <div className="form-group">
                      <label>Theme</label>
                      <select value={theme} onChange={e => setTheme(e.target.value)}>
                        <option value="light">Light</option>
                        <option value="dark">Dark (coming soon)</option>
                        <option value="system">Use system setting</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Language</label>
                      <select value={language} onChange={e => setLanguage(e.target.value)}>
                        <option>English</option>
                        <option>Amharic (አማርኛ)</option>
                        <option>French</option>
                        <option>Arabic</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date Format</label>
                      <select defaultValue="YYYY-MM-DD">
                        <option>YYYY-MM-DD</option>
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Timezone</label>
                      <select defaultValue="Africa/Addis_Ababa">
                        <option>Africa/Addis_Ababa (EAT +3)</option>
                        <option>UTC</option>
                        <option>Europe/London</option>
                      </select>
                    </div>
                  </>
                )}

                {settingsTab === 'notifications' && (
                  <>
                    <div className="form-section-title" style={{ marginBottom: 14 }}>Notification Preferences</div>
                    {[
                      { label: 'Email Notifications', sub: 'Receive updates and alerts via email', val: notifEmail, set: setNotifEmail },
                      { label: 'SMS Notifications',   sub: 'Receive critical alerts via SMS',      val: notifSMS,   set: setNotifSMS },
                      { label: 'Push Notifications',  sub: 'Browser push notifications',           val: notifPush,  set: setNotifPush },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 500, color: '#0f172a' }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.sub}</div>
                        </div>
                        <div onClick={() => item.set(!item.val)}
                          style={{ width: 42, height: 24, borderRadius: 12, background: item.val ? '#1e40af' : '#cbd5e1', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                          <div style={{ position: 'absolute', top: 3, left: item.val ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {settingsTab === 'security' && (
                  <>
                    <div className="form-section-title" style={{ marginBottom: 14 }}>Change Password</div>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                    <div className="form-section-title" style={{ marginBottom: 14, marginTop: 8 }}>Session</div>
                    <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: '#64748b' }}>Current session</span>
                        <span className="badge badge-green">Active</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Logged in as</span>
                        <span style={{ fontWeight: 500 }}>{currentUser?.username}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowSettings(false); }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
