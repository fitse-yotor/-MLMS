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
const pageAccess: Record<Page, string[]> = {
  dashboard: ALL_ROLES,
  'seafarer-list': [ADMIN_ROLE, 'Seafarer'],
  'seafarer-detail': [ADMIN_ROLE, 'Seafarer'],
  'seafarer-registration': [ADMIN_ROLE, 'Seafarer'],
  training: [ADMIN_ROLE, 'Seafarer'],
  medical: [ADMIN_ROLE, 'Seafarer'],
  'sea-service': [ADMIN_ROLE, 'Seafarer'],
  certifications: [ADMIN_ROLE, 'Seafarer'],
  books: [ADMIN_ROLE, 'Seafarer'],
  'bio-enrollment': [ADMIN_ROLE],
  'bio-verification': [ADMIN_ROLE],
  'bio-operations': [ADMIN_ROLE],
  'exam-applications': [ADMIN_ROLE, 'Seafarer'],
  'question-bank': [ADMIN_ROLE],
  'exam-schedules': [ADMIN_ROLE, 'Seafarer'],
  'exam-results': [ADMIN_ROLE, 'Seafarer'],
  'exam-operations': [ADMIN_ROLE, 'Seafarer'],
  logistics: [ADMIN_ROLE, 'Logistics Operator'],
  'vessel-owners': [ADMIN_ROLE, 'Vessel Owner'],
  'vessel-list': [ADMIN_ROLE, 'Vessel Owner'],
  'vessel-inspections': [ADMIN_ROLE, 'Vessel Owner'],
  'vessel-permits': [ADMIN_ROLE, 'Vessel Owner'],
  reports: [ADMIN_ROLE],
  audit: [ADMIN_ROLE],
  users: [ADMIN_ROLE],
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
  'System Administrator': '#7c3aed',
  'Seafarer': '#15803d', 'Vessel Owner': '#b45309', 'Logistics Operator': '#0f766e',
};

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedSeafarerId, setSelectedSeafarerId] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unread = mockNotifications.filter(n => !n.read).length;

  if (!currentUser) {
    return <Login onLogin={user => { setCurrentUser(user); setPage(firstAllowedPage(user)); }} />;
  }

  function navigate(p: Page) {
    setPage(canAccessPage(currentUser!, p) ? p : firstAllowedPage(currentUser!));
    setShowNotifs(false);
    setShowUserMenu(false);
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
      <aside className="sidebar">
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

        <div className="sidebar-section">
          <div className="sidebar-section-label">Logistics</div>
          {canAccessPage(currentUser, 'logistics') && (
          <div className={`sidebar-item${page === 'logistics' ? ' active' : ''}`} onClick={() => navigate('logistics')}>
            <span>🚛</span> Logistics Operators
          </div>
                  )}
        </div>

        <NavSection title="Vessel Management" items={vesselNav} />

        <div className="sidebar-section">
          <div className="sidebar-section-label">Administration</div>
          {canAccessPage(currentUser, 'reports') && (
          <div className={`sidebar-item${page === 'reports' ? ' active' : ''}`} onClick={() => navigate('reports')}>
            <span>📊</span> Reports & Analytics
          </div>
                    )}
          {canAccessPage(currentUser, 'audit') && (
          <div className={`sidebar-item${page === 'audit' ? ' active' : ''}`} onClick={() => navigate('audit')}>
            <span>🔒</span> Audit Logs
          </div>
                    )}
          {canAccessPage(currentUser, 'users') && (
          <div className={`sidebar-item${page === 'users' ? ' active' : ''}`} onClick={() => navigate('users')}>
            <span>👤</span> User Management
          </div>
                  )}
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
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
                <div style={{ textAlign: 'right' }}>
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
                    <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }} onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      👤 My Profile
                    </div>
                    <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#374151' }} onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
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
    </div>
  );
}

export default App;
