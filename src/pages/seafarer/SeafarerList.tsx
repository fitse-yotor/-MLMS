import React, { useState } from 'react';
import { mockSeafarers } from '../../mockData';

export default function SeafarerList({ currentUser, onView, onNew, canCreate }: { currentUser?: any; onView: (id: string) => void; onNew: () => void; canCreate?: boolean }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const visibleSeafarers = currentUser?.role === 'Seafarer'
    ? mockSeafarers.filter(s => s.id === currentUser.id)
    : mockSeafarers;

  const filtered = visibleSeafarers.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)) &&
    (!statusFilter || s.status === statusFilter)
  );

  return (
    <div className="page">
      <div className="flex-between page-header">
        <div>
          <div className="page-title">Seafarer Registry</div>
          <div className="page-subtitle">Manage all registered seafarers</div>
        </div>
        {canCreate && <button className="btn btn-primary" onClick={onNew}>+ New Registration</button>}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Seafarers', value: visibleSeafarers.length, color: 'blue' },
          { label: 'Active', value: visibleSeafarers.filter(s => s.status === 'Active').length, color: 'green' },
          { label: 'Pending', value: visibleSeafarers.filter(s => s.status === 'Pending').length, color: 'yellow' },
          { label: 'Suspended', value: visibleSeafarers.filter(s => s.status === 'Suspended').length, color: 'red' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${s.color}`}>👥</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Seafarer List</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm">⬇ Export</button>
          </div>
        </div>
        <div className="card-body">
          <div className="filter-row">
            <div className="search-input-wrap" style={{ flex: 1 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
              <input style={{ paddingLeft: 34 }} placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="">All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Seafarer ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Nationality</th>
                  <th>Mobile</th>
                  <th>Region</th>
                  <th>Reg. Date</th>
                  <th>Medical</th>
                  <th>Book Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{s.id}</span></td>
                    <td><div style={{ fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 11, color: '#64748b' }}>{s.email}</div></td>
                    <td>{s.gender}</td>
                    <td>{s.nationality}</td>
                    <td style={{ fontSize: 12.5 }}>{s.mobile}</td>
                    <td>{s.region}</td>
                    <td style={{ fontSize: 12.5 }}>{s.reg_date}</td>
                    <td><span className={`badge badge-${s.medical === 'Fit' ? 'green' : s.medical === 'Fit with Restrictions' ? 'yellow' : 'gray'}`}>{s.medical}</span></td>
                    <td><span className={`badge badge-${s.book_status === 'Active' ? 'green' : s.book_status === 'Expiring Soon' ? 'yellow' : s.book_status === 'Suspended' ? 'red' : 'gray'}`}>{s.book_status}</span></td>
                    <td><span className={`badge badge-${s.status === 'Active' ? 'green' : s.status === 'Pending' ? 'yellow' : 'red'}`}>{s.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-xs" onClick={() => onView(s.id)}>View</button>
                        <button className="btn btn-secondary btn-xs">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#64748b' }}>
            <span>Showing {filtered.length} of {visibleSeafarers.length} seafarers</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-secondary btn-xs">‹ Prev</button>
              <button className="btn btn-primary btn-xs">1</button>
              <button className="btn btn-secondary btn-xs">Next ›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
