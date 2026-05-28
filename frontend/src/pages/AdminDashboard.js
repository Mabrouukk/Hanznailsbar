import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const TABS = ['Overview', 'Bookings', 'Customers'];

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/admin/stats`),
      axios.get(`${API}/admin/bookings`),
      axios.get(`${API}/admin/users`)
    ]).then(([s, b, u]) => {
      setStats(s.data);
      setBookings(b.data);
      setUsers(u.data);
    }).catch(() => toast.error('Failed to load data'))
    .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/admin/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? {...b, status} : b));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API}/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filteredBookings = bookings.filter(b =>
    b.userName?.toLowerCase().includes(search.toLowerCase()) ||
    b.service?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <p>ADMIN PANEL</p>
          <h1>Hänz Nails Dashboard</h1>
          <div className="gold-line" style={{margin:'16px auto 0'}}></div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card card">
              <div className="stat-icon">👥</div>
              <div><strong>{stats.totalUsers}</strong><span>Total Customers</span></div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">📅</div>
              <div><strong>{stats.totalBookings}</strong><span>Total Bookings</span></div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">⏳</div>
              <div><strong>{stats.pendingBookings}</strong><span>Pending</span></div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">✅</div>
              <div><strong>{stats.confirmedBookings}</strong><span>Confirmed</span></div>
            </div>
            <div className="stat-card card">
              <div className="stat-icon">📆</div>
              <div><strong>{stats.todayBookings}</strong><span>Today</span></div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {TABS.map((t,i) => (
              <button key={i} className={`admin-tab ${tab===i?'active':''}`} onClick={() => setTab(i)}>{t}</button>
            ))}
            <input
              className="admin-search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Overview */}
          {tab === 0 && (
            <div className="admin-overview">
              <div className="overview-card card">
                <h3>Recent Bookings</h3>
                {bookings.slice(0,5).map((b,i) => (
                  <div key={i} className="overview-row">
                    <div><strong>{b.userName}</strong><span>{b.service}</span></div>
                    <div className="overview-row-right">
                      <span>{new Date(b.date).toLocaleDateString()}</span>
                      <span className={`badge ${b.status==='confirmed'?'badge-green':b.status==='pending'?'badge-blue':b.status==='cancelled'?'badge-red':'badge-gold'}`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="overview-card card">
                <h3>Recent Customers</h3>
                {users.slice(0,5).map((u,i) => (
                  <div key={i} className="overview-row">
                    <div><strong>{u.name}</strong><span>{u.email}</span></div>
                    <span style={{fontSize:'12px',color:'var(--gray)'}}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings */}
          {tab === 1 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b,i) => (
                    <tr key={i}>
                      <td>
                        <strong>{b.userName}</strong><br/>
                        <small>{b.userPhone}</small>
                      </td>
                      <td>{b.service}</td>
                      <td>{new Date(b.date).toLocaleDateString('en-GB')}</td>
                      <td>{b.time}</td>
                      <td>{b.finalPrice > 0 ? `${b.finalPrice} EGP` : '–'}</td>
                      <td>
                        <span className={`badge ${b.status==='confirmed'?'badge-green':b.status==='pending'?'badge-blue':b.status==='cancelled'?'badge-red':'badge-gold'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={b.status}
                          onChange={e => updateStatus(b._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customers */}
          {tab === 2 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Birthday</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u,i) => (
                    <tr key={i}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.birthday ? new Date(u.birthday).toLocaleDateString('en-GB', {day:'numeric',month:'long'}) : '–'}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                      <td>
                        <button className="btn-delete" onClick={() => deleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
