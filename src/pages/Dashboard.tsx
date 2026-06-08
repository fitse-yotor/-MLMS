import React from 'react';
import { mockSeafarers, mockVessels, mockLogisticsOperators, mockExamApplications, mockCertifications, mockNotifications } from '../mockData';

export default function Dashboard({ navigate, currentUser }: { navigate: (p: any) => void; currentUser?: any }) {
  const visibleSeafarers = currentUser?.role === 'Seafarer' ? mockSeafarers.filter(s => s.id === currentUser.id) : mockSeafarers;
  const ownerVesselIds = currentUser?.role === 'Vessel Owner' ? mockVessels.filter(v => v.owner_id === currentUser.id).map(v => v.id) : null;
  const visibleVessels = ownerVesselIds ? mockVessels.filter(v => ownerVesselIds.includes(v.id)) : mockVessels;
  const visibleOperators = currentUser?.role === 'Logistics Operator' ? mockLogisticsOperators.filter(o => o.id === currentUser.id) : mockLogisticsOperators;
  const visibleExamApplications = currentUser?.role === 'Seafarer' ? mockExamApplications.filter(e => e.seafarer_id === currentUser.id) : mockExamApplications;
  const visibleCertifications = currentUser?.role === 'Seafarer' ? mockCertifications.filter(c => c.seafarer_id === currentUser.id) : mockCertifications;
  const activeSeafarers = visibleSeafarers.filter(s => s.status === 'Active').length;
  const activeVessels = visibleVessels.filter(v => v.reg_status === 'Active').length;
  const activeOperators = visibleOperators.filter(o => o.status === 'Active').length;
  const pendingExams = visibleExamApplications.filter(e => e.status === 'Under Review').length;
  const activeCerts = visibleCertifications.filter(c => c.status === 'Active').length;
  const expiring = visibleCertifications.filter(c => c.status === 'Expiring Soon').length + visibleOperators.filter(o => o.status === 'Expiring Soon').length;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const regData = [12, 19, 15, 22, 18, 25];
  const maxReg = Math.max(...regData);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">System Dashboard</div>
        <div className="page-subtitle">Maritime and Logistics Management System — Overview</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div><div className="stat-value">{visibleSeafarers.length}</div><div className="stat-label">Total Seafarers</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div><div className="stat-value">{activeSeafarers}</div><div className="stat-label">Active Seafarers</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">🚢</div>
          <div><div className="stat-value">{activeVessels}</div><div className="stat-label">Active Vessels</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🚛</div>
          <div><div className="stat-value">{activeOperators}</div><div className="stat-label">Active Operators</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📜</div>
          <div><div className="stat-value">{activeCerts}</div><div className="stat-label">Active Certificates</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⚠</div>
          <div><div className="stat-value">{expiring}</div><div className="stat-label">Expiring Soon</div></div>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 Seafarer Registrations (2024)</div>
          </div>
          <div className="card-body">
            <div className="bar-chart">
              {regData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div className="bar" style={{ height: `${(v / maxReg) * 100}%`, width: '100%' }}>{v}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{months[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Pending Actions</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Seafarer Registrations Pending', count: visibleSeafarers.filter(s => s.status === 'Pending').length, color: '#f59e0b', page: 'seafarer-list' },
                { label: 'Exam Applications Under Review', count: pendingExams, color: '#3b82f6', page: 'exam-applications' },
                { label: 'Vessel Inspections Pending', count: 1, color: '#8b5cf6', page: 'vessel-inspections' },
                { label: 'Certificates Expiring Soon', count: expiring, color: '#ef4444', page: 'certifications' },
              ].map((item, i) => (
                <div key={i} onClick={() => navigate(item.page as any)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 13.5, color: '#374151' }}>{item.label}</div>
                  <div style={{ background: item.color, color: '#fff', borderRadius: 999, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card-grid-3">
        <div className="card">
          <div className="card-header">
            <div className="card-title">👥 Recent Registrations</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('seafarer-list')}>View All</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Seafarer</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {visibleSeafarers.slice(0, 4).map(s => (
                  <tr key={s.id}>
                    <td><div style={{ fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{s.id}</div></td>
                    <td style={{ fontSize: 12.5 }}>{s.reg_date}</td>
                    <td><span className={`badge badge-${s.status === 'Active' ? 'green' : s.status === 'Pending' ? 'yellow' : 'red'}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">🚢 Vessel Status</div>
          </div>
          <div className="card-body">
            {[
              { label: 'Active', count: activeVessels, color: 'badge-green' },
              { label: 'Suspended', count: visibleVessels.filter(v => v.reg_status === 'Suspended').length, color: 'badge-red' },
              { label: 'Pending Inspection', count: visibleVessels.filter(v => v.inspection === 'Pending').length, color: 'badge-yellow' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13.5 }}>{item.label}</span>
                <span className={`badge ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">🔔 Notifications</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {mockNotifications.slice(0, 4).map(n => (
              <div key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: n.read ? '#fff' : '#eff6ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{n.type}</div>
                  <span className={`badge badge-${n.priority === 'High' ? 'red' : n.priority === 'Medium' ? 'yellow' : 'gray'}`} style={{ fontSize: 10 }}>{n.priority}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🏆 Module Overview</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Seafarers', value: visibleSeafarers.length, icon: '👥', page: 'seafarer-list' },
                { label: 'Vessels', value: visibleVessels.length, icon: '🚢', page: 'vessel-list' },
                { label: 'Operators', value: visibleOperators.length, icon: '🚛', page: 'logistics' },
                { label: 'Certificates', value: visibleCertifications.length, icon: '📜', page: 'certifications' },
                { label: 'Exam Apps', value: visibleExamApplications.length, icon: '📋', page: 'exam-applications' },
                { label: 'Inspections', value: 4, icon: '🔍', page: 'vessel-inspections' },
              ].map((item, i) => (
                <div key={i} onClick={() => navigate(item.page as any)} style={{ padding: '14px', background: '#f8fafc', borderRadius: 8, cursor: 'pointer', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div><div style={{ fontWeight: 700, fontSize: 18 }}>{item.value}</div><div style={{ fontSize: 12, color: '#64748b' }}>{item.label}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Exam Statistics</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Total Applications', value: visibleExamApplications.length },
                { label: 'Approved', value: visibleExamApplications.filter(e => e.status === 'Approved').length },
                { label: 'Scheduled Sessions', value: 3 },
                { label: 'Passed (Latest)', value: 2 },
                { label: 'Failed (Latest)', value: 1 },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: '#374151' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
