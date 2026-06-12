import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const TABS = ['Overview', 'Bookings', 'Customers', 'Prices', 'Offer', 'Schedule', 'Broadcast', 'Staff'];

const ALL_SLOTS = ['11:00 AM','12:30 PM','2:00 PM','3:30 PM','5:00 PM','6:30 PM','8:00 PM'];

const downloadCSV = (rows, filename) => {
  if (!rows.length) return toast.error('No data to export');
  const headers = Object.keys(rows[0]);
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [editingPrice, setEditingPrice] = useState({});
  const [offerSettings, setOfferSettings] = useState({ offerEnabled: false, offerPercentage: 15 });
  const [offerInput, setOfferInput] = useState(15);
  const [newService, setNewService] = useState({ name: '', price: '', category: 'Nail Services' });
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [blockForm, setBlockForm] = useState({ date: '', allDay: true, times: [], reason: '' });
  const [todayOnly, setTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [broadcast, setBroadcast] = useState({ subject: '', message: '' });
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loans, setLoans] = useState([]);
  const [payrollMonth, setPayrollMonth] = useState(new Date().toISOString().slice(0, 7));
  const [staffView, setStaffView] = useState('employees');
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', phone: '', salary: '', reportsTo: '' });
  const [newLoan, setNewLoan] = useState({ employeeId: '', amount: '', reason: '' });
  const [editingSalary, setEditingSalary] = useState({});

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/admin/stats`),
      axios.get(`${API}/admin/bookings`),
      axios.get(`${API}/admin/users`),
      axios.get(`${API}/admin/services`),
      axios.get(`${API}/admin/settings`),
      axios.get(`${API}/admin/blocked-slots`),
      axios.get(`${API}/admin/employees`),
    ]).then(([s, b, u, sv, st, bs, em]) => {
      setStats(s.data);
      setBookings(b.data);
      setUsers(u.data);
      setServices(sv.data);
      setOfferSettings(st.data);
      setOfferInput(st.data.offerPercentage);
      setBlockedSlots(bs.data);
      setEmployees(em.data);
    }).catch(() => toast.error('Failed to load data'))
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 7) {
      axios.get(`${API}/admin/loans?month=${payrollMonth}`)
        .then(r => setLoans(r.data))
        .catch(() => setLoans([]));
    }
  }, [tab, payrollMonth]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/admin/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? {...b, status} : b));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await axios.delete(`${API}/admin/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
      toast.success('Booking deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const saveOffer = async (patch) => {
    try {
      const res = await axios.put(`${API}/admin/settings`, { ...offerSettings, ...patch });
      setOfferSettings(res.data);
      setOfferInput(res.data.offerPercentage);
      toast.success('Offer updated');
    } catch { toast.error('Failed to update offer'); }
  };

  const savePrice = async (id, price) => {
    try {
      const res = await axios.put(`${API}/admin/services/${id}`, { price });
      setServices(prev => prev.map(s => s._id === id ? res.data : s));
      setEditingPrice(prev => { const n = {...prev}; delete n[id]; return n; });
      toast.success('Price updated');
    } catch { toast.error('Failed to update price'); }
  };

  const createService = async () => {
    if (!newService.name.trim() || !newService.price || !newService.category.trim()) {
      return toast.error('Fill in all fields');
    }
    try {
      const res = await axios.post(`${API}/admin/services`, newService);
      setServices(prev => [...prev, res.data]);
      setNewService({ name: '', price: '', category: 'Nail Services' });
      toast.success('Service added');
    } catch { toast.error('Failed to add service'); }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`${API}/admin/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      toast.success('Service deleted');
    } catch { toast.error('Failed to delete service'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API}/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const addEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.role.trim() || !newEmployee.salary) return toast.error('Name, role and salary are required');
    try {
      const res = await axios.post(`${API}/admin/employees`, newEmployee);
      setEmployees(prev => [...prev, res.data].sort((a,b) => a.name.localeCompare(b.name)));
      setNewEmployee({ name: '', role: '', phone: '', salary: '', reportsTo: '' });
      toast.success('Employee added');
    } catch { toast.error('Failed to add employee'); }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm('Remove this employee?')) return;
    try {
      await axios.delete(`${API}/admin/employees/${id}`);
      setEmployees(prev => prev.filter(e => e._id !== id));
      toast.success('Employee removed');
    } catch { toast.error('Failed to remove'); }
  };

  const saveSalary = async (id, salary) => {
    try {
      const res = await axios.put(`${API}/admin/employees/${id}`, { salary });
      setEmployees(prev => prev.map(e => e._id === id ? res.data : e));
      setEditingSalary(prev => { const n = {...prev}; delete n[id]; return n; });
      toast.success('Salary updated');
    } catch { toast.error('Failed to update salary'); }
  };

  const addLoan = async () => {
    if (!newLoan.employeeId || !newLoan.amount) return toast.error('Select employee and enter amount');
    try {
      const res = await axios.post(`${API}/admin/loans`, { employee: newLoan.employeeId, amount: newLoan.amount, reason: newLoan.reason, month: payrollMonth });
      setLoans(prev => [...prev, res.data]);
      setNewLoan({ employeeId: '', amount: '', reason: '' });
      toast.success('Loan recorded');
    } catch { toast.error('Failed to add loan'); }
  };

  const deleteLoan = async (id) => {
    try {
      await axios.delete(`${API}/admin/loans/${id}`);
      setLoans(prev => prev.filter(l => l._id !== id));
      toast.success('Loan removed');
    } catch { toast.error('Failed to remove loan'); }
  };

  const buildTree = (emps, parentId = null) =>
    emps
      .filter(e => {
        const rt = e.reportsTo ? String(e.reportsTo._id || e.reportsTo) : null;
        return rt === (parentId ? String(parentId) : null);
      })
      .map(e => ({ ...e, children: buildTree(emps, e._id) }));

  const renderTree = (nodes, depth = 0) =>
    nodes.map(node => (
      <div key={node._id} style={{ paddingLeft: depth > 0 ? '28px' : '0', marginBottom: '8px' }}>
        <div style={{
          background: 'var(--dark-3)',
          border: `1px solid ${depth === 0 ? 'rgba(212,175,55,0.6)' : 'var(--dark-4)'}`,
          borderLeft: depth > 0 ? '3px solid rgba(212,175,55,0.35)' : undefined,
          borderRadius: '10px', padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div>
            <strong style={{ color: 'var(--white)', display: 'block', fontSize: '14px' }}>{node.name}</strong>
            <span style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.5px' }}>{node.role}</span>
          </div>
          <span style={{ marginLeft: 'auto', color: 'var(--gray)', fontSize: '12px' }}>{node.salary?.toLocaleString()} EGP/mo</span>
        </div>
        {node.children?.length > 0 && (
          <div style={{ paddingLeft: '14px', borderLeft: '1px solid rgba(212,175,55,0.12)', marginLeft: '18px', marginTop: '4px' }}>
            {renderTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));

  const sendBroadcast = async () => {
    if (!broadcast.subject.trim() || !broadcast.message.trim()) return toast.error('Subject and message are required');
    if (!window.confirm(`Send this email to all ${users.length} customers?`)) return;
    setBroadcastSending(true);
    setBroadcastResult(null);
    try {
      const { data } = await axios.post(`${API}/admin/email/broadcast`, broadcast);
      setBroadcastResult(data);
      setBroadcast({ subject: '', message: '' });
      toast.success(`Sent to ${data.sent} customer${data.sent !== 1 ? 's' : ''}`);
    } catch { toast.error('Failed to send broadcast'); }
    finally { setBroadcastSending(false); }
  };

  const blockSlots = async () => {
    if (!blockForm.date) return toast.error('Select a date');
    if (!blockForm.allDay && blockForm.times.length === 0) return toast.error('Select at least one time slot');
    try {
      if (blockForm.allDay) {
        const res = await axios.post(`${API}/admin/blocked-slots`, { date: blockForm.date, time: null, reason: blockForm.reason });
        setBlockedSlots(prev => [...prev, res.data].sort((a,b) => a.date.localeCompare(b.date)));
      } else {
        const created = await Promise.all(
          blockForm.times.map(t => axios.post(`${API}/admin/blocked-slots`, { date: blockForm.date, time: t, reason: blockForm.reason }).then(r => r.data))
        );
        setBlockedSlots(prev => [...prev, ...created].sort((a,b) => a.date.localeCompare(b.date)));
      }
      setBlockForm({ date: '', allDay: true, times: [], reason: '' });
      toast.success('Blocked successfully');
    } catch { toast.error('Failed to block slot'); }
  };

  const unblockSlot = async (id) => {
    try {
      await axios.delete(`${API}/admin/blocked-slots/${id}`);
      setBlockedSlots(prev => prev.filter(s => s._id !== id));
      toast.success('Unblocked');
    } catch { toast.error('Failed to unblock'); }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings
    .filter(b => {
      const matchSearch = b.userName?.toLowerCase().includes(search.toLowerCase()) ||
        b.service?.toLowerCase().includes(search.toLowerCase());
      const matchToday = todayOnly
        ? new Date(b.date).toISOString().split('T')[0] === todayStr
        : true;
      return matchSearch && matchToday;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'name') return (a.userName || '').localeCompare(b.userName || '');
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
      return new Date(b.date) - new Date(a.date); // newest (default)
    });
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
          </div>
          <input
            className="admin-search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

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
            <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', flexWrap:'wrap'}}>
              <button
                className={`admin-tab ${!todayOnly ? 'active' : ''}`}
                style={{padding:'8px 18px', fontSize:'12px'}}
                onClick={() => setTodayOnly(false)}
              >All</button>
              <button
                className={`admin-tab ${todayOnly ? 'active' : ''}`}
                style={{padding:'8px 18px', fontSize:'12px'}}
                onClick={() => setTodayOnly(true)}
              >Today</button>
              <select
                className="status-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{marginLeft:'4px'}}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A–Z</option>
                <option value="status">Status</option>
              </select>
              <span style={{marginLeft:'auto', color:'var(--gray)', fontSize:'12px'}}>
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'16px'}}>
              <button className="btn-export" onClick={() => downloadCSV(
                filteredBookings.map(b => ({
                  Name: b.userName,
                  Phone: b.userPhone,
                  Email: b.userEmail,
                  Service: b.service,
                  Date: new Date(b.date).toLocaleDateString('en-GB'),
                  Time: b.time,
                  'Price (EGP)': b.finalPrice || 0,
                  'Discount %': b.discountPercent || 0,
                  Notes: b.notes || '',
                  Status: b.status,
                })),
                `bookings-${new Date().toISOString().slice(0,10)}.csv`
              )}>⬇ Export Bookings CSV</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Notes</th>
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
                        {b.notes ? (
                          <span className="booking-notes" title={b.notes}>
                            {b.notes.length > 40 ? b.notes.slice(0,40)+'…' : b.notes}
                          </span>
                        ) : <span style={{color:'var(--gray)'}}>–</span>}
                      </td>
                      <td>
                        <span className={`badge ${b.status==='confirmed'?'badge-green':b.status==='pending'?'badge-blue':b.status==='cancelled'?'badge-red':'badge-gold'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
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
                          <button className="btn-delete" onClick={() => deleteBooking(b._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* Customers */}
          {tab === 2 && (
            <div>
            <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'16px'}}>
              <button className="btn-export" onClick={() => downloadCSV(
                filteredUsers.map(u => ({
                  Name: u.name,
                  Email: u.email,
                  Phone: u.phone,
                  Birthday: u.birthday ? new Date(u.birthday).toLocaleDateString('en-GB', {day:'numeric', month:'long'}) : '',
                  'Registered Date': new Date(u.createdAt).toLocaleDateString('en-GB'),
                })),
                `customers-${new Date().toISOString().slice(0,10)}.csv`
              )}>⬇ Export Customers CSV</button>
            </div>
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
            </div>
          )}
          {/* Offer */}
          {tab === 4 && (
            <div className="offer-panel card">
              <h3 style={{fontFamily:'var(--font-serif)', fontSize:'24px', marginBottom:'8px', color:'var(--white)'}}>Announcement Bar Offer</h3>
              <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'32px'}}>
                When enabled, a gold banner appears at the top of the site and all service prices show the discounted amount.
              </p>

              <div className="offer-toggle-row">
                <span style={{color:'var(--gray-light)', fontSize:'14px'}}>Offer Status</span>
                <button
                  className={`offer-toggle ${offerSettings.offerEnabled ? 'active' : ''}`}
                  onClick={() => saveOffer({ offerEnabled: !offerSettings.offerEnabled })}
                >
                  {offerSettings.offerEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="offer-percentage-row">
                <span style={{color:'var(--gray-light)', fontSize:'14px'}}>Discount Percentage</span>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                  <input
                    type="number"
                    className="price-input"
                    min="1" max="99"
                    value={offerInput}
                    onChange={e => setOfferInput(e.target.value)}
                    style={{width:'80px'}}
                  />
                  <span style={{color:'var(--gray)'}}>%</span>
                  <button
                    className="btn-save"
                    onClick={() => saveOffer({ offerPercentage: offerInput })}
                    disabled={Number(offerInput) === offerSettings.offerPercentage}
                  >
                    Save
                  </button>
                </div>
              </div>

              {offerSettings.offerEnabled && (
                <div className="offer-preview">
                  <p style={{color:'var(--gray)', fontSize:'12px', marginBottom:'8px'}}>Preview — how it appears on site:</p>
                  <div style={{
                    background:'linear-gradient(90deg,#b8860b,#d4af37,#b8860b)',
                    color:'#000', borderRadius:'8px', padding:'10px 24px',
                    fontSize:'13px', textAlign:'center', fontWeight:'500'
                  }}>
                    🎉 Limited Time: Get <strong>{offerSettings.offerPercentage}% Off</strong> all services — Book now!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prices */}
          {tab === 3 && (
            <div>
              {/* Add Service Form */}
              <div className="add-service-form card" style={{marginBottom:'24px', padding:'20px', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'flex-end'}}>
                <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                  <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Service Name</label>
                  <input
                    className="price-input"
                    style={{width:'200px'}}
                    placeholder="e.g. Nail Art Design"
                    value={newService.name}
                    onChange={e => setNewService(p => ({...p, name: e.target.value}))}
                  />
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                  <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Category</label>
                  <input
                    className="price-input"
                    style={{width:'160px'}}
                    placeholder="e.g. Nail Services"
                    value={newService.category}
                    onChange={e => setNewService(p => ({...p, category: e.target.value}))}
                  />
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                  <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Price (EGP)</label>
                  <input
                    type="number"
                    className="price-input"
                    style={{width:'100px'}}
                    placeholder="0"
                    value={newService.price}
                    onChange={e => setNewService(p => ({...p, price: e.target.value}))}
                  />
                </div>
                <button
                  className="btn-save"
                  style={{padding:'8px 20px', fontSize:'13px'}}
                  onClick={createService}
                  disabled={!newService.name.trim() || !newService.price}
                >
                  + Add Service
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Category</th>
                      <th>Current Price</th>
                      <th>New Price</th>
                      <th>Save</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s._id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.category}</td>
                        <td style={{color:'var(--gold)'}}>{s.price} EGP</td>
                        <td>
                          <input
                            type="number"
                            className="price-input"
                            placeholder={s.price}
                            value={editingPrice[s._id] ?? ''}
                            onChange={e => setEditingPrice(prev => ({...prev, [s._id]: e.target.value}))}
                          />
                        </td>
                        <td>
                          <button
                            className="btn-save"
                            disabled={!editingPrice[s._id]}
                            onClick={() => savePrice(s._id, editingPrice[s._id])}
                          >
                            Save
                          </button>
                        </td>
                        <td>
                          <button className="btn-delete" onClick={() => deleteService(s._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Broadcast */}
          {tab === 6 && (
            <div style={{maxWidth:'640px'}}>
              <div className="card" style={{padding:'28px', marginBottom:'20px'}}>
                <h3 style={{fontFamily:'var(--font-serif)', fontSize:'20px', color:'var(--white)', marginBottom:'6px'}}>Send Email to All Customers</h3>
                <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px'}}>
                  {users.length} registered customer{users.length !== 1 ? 's' : ''} will receive this email.
                </p>

                <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                  <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                    <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Subject</label>
                    <input
                      className="admin-search"
                      style={{width:'100%', marginBottom:0}}
                      placeholder="e.g. Special offer this week!"
                      value={broadcast.subject}
                      onChange={e => setBroadcast(p => ({...p, subject: e.target.value}))}
                    />
                  </div>
                  <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                    <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Message</label>
                    <textarea
                      style={{
                        background:'var(--dark-3)', border:'1px solid var(--dark-4)', color:'var(--white)',
                        padding:'12px 16px', borderRadius:'8px', fontFamily:'var(--font-sans)',
                        fontSize:'13px', outline:'none', resize:'vertical', minHeight:'160px', lineHeight:'1.7'
                      }}
                      placeholder="Write your message here..."
                      value={broadcast.message}
                      onChange={e => setBroadcast(p => ({...p, message: e.target.value}))}
                      onFocus={e => e.target.style.borderColor='var(--gold)'}
                      onBlur={e => e.target.style.borderColor='var(--dark-4)'}
                    />
                  </div>
                  <button
                    className="btn-export"
                    style={{alignSelf:'flex-start', padding:'10px 28px', fontSize:'13px'}}
                    onClick={sendBroadcast}
                    disabled={broadcastSending || !broadcast.subject.trim() || !broadcast.message.trim()}
                  >
                    {broadcastSending ? 'Sending...' : `Send to ${users.length} Customer${users.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </div>

              {broadcastResult && (
                <div className="card" style={{padding:'20px', display:'flex', gap:'24px'}}>
                  <div style={{textAlign:'center'}}>
                    <strong style={{display:'block', fontSize:'28px', color:'#4caf50'}}>{broadcastResult.sent}</strong>
                    <span style={{fontSize:'12px', color:'var(--gray)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Sent</span>
                  </div>
                  {broadcastResult.failed > 0 && (
                    <div style={{textAlign:'center'}}>
                      <strong style={{display:'block', fontSize:'28px', color:'#dc3545'}}>{broadcastResult.failed}</strong>
                      <span style={{fontSize:'12px', color:'var(--gray)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Failed</span>
                    </div>
                  )}
                  <div style={{textAlign:'center'}}>
                    <strong style={{display:'block', fontSize:'28px', color:'var(--gold)'}}>{broadcastResult.total}</strong>
                    <span style={{fontSize:'12px', color:'var(--gray)', textTransform:'uppercase', letterSpacing:'0.5px'}}>Total</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Staff */}
          {tab === 7 && (
            <div>
              {/* Sub-nav */}
              <div style={{display:'flex', gap:'8px', marginBottom:'24px'}}>
                {['employees','payroll','chart'].map(v => (
                  <button key={v} className={`admin-tab ${staffView===v?'active':''}`}
                    style={{padding:'8px 20px', fontSize:'12px', textTransform:'capitalize'}}
                    onClick={() => setStaffView(v)}>
                    {v === 'chart' ? 'Org Chart' : v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>

              {/* ── Employees ── */}
              {staffView === 'employees' && (
                <div>
                  {/* Add form */}
                  <div className="card" style={{padding:'20px', marginBottom:'24px', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'flex-end'}}>
                    {[
                      {label:'Name', key:'name', placeholder:'Full name', width:'160px'},
                      {label:'Role', key:'role', placeholder:'e.g. Nail Technician', width:'160px'},
                      {label:'Phone', key:'phone', placeholder:'+20...', width:'140px'},
                      {label:'Salary (EGP)', key:'salary', placeholder:'0', width:'110px', type:'number'},
                    ].map(f => (
                      <div key={f.key} style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                        <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>{f.label}</label>
                        <input type={f.type||'text'} className="price-input" style={{width:f.width}}
                          placeholder={f.placeholder} value={newEmployee[f.key]}
                          onChange={e => setNewEmployee(p => ({...p, [f.key]: e.target.value}))} />
                      </div>
                    ))}
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Reports To</label>
                      <select className="status-select" style={{width:'160px'}} value={newEmployee.reportsTo}
                        onChange={e => setNewEmployee(p => ({...p, reportsTo: e.target.value}))}>
                        <option value="">— None (top level) —</option>
                        {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.role})</option>)}
                      </select>
                    </div>
                    <button className="btn-save" style={{padding:'8px 20px', fontSize:'13px'}} onClick={addEmployee}
                      disabled={!newEmployee.name.trim() || !newEmployee.role.trim() || !newEmployee.salary}>
                      + Add Employee
                    </button>
                  </div>

                  {/* Table */}
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Role</th><th>Phone</th><th>Monthly Salary</th><th>Reports To</th><th>Update Salary</th><th>Save</th><th>Delete</th></tr></thead>
                      <tbody>
                        {employees.length === 0 && (
                          <tr><td colSpan={8} style={{color:'var(--gray)', textAlign:'center', padding:'32px'}}>No employees yet.</td></tr>
                        )}
                        {employees.map(e => (
                          <tr key={e._id}>
                            <td><strong>{e.name}</strong></td>
                            <td>{e.role}</td>
                            <td>{e.phone || '–'}</td>
                            <td style={{color:'var(--gold)'}}>{e.salary?.toLocaleString()} EGP</td>
                            <td>{e.reportsTo ? `${e.reportsTo.name}` : <span style={{color:'var(--gray)'}}>Top level</span>}</td>
                            <td>
                              <input type="number" className="price-input" placeholder={e.salary}
                                value={editingSalary[e._id] ?? ''}
                                onChange={ev => setEditingSalary(p => ({...p, [e._id]: ev.target.value}))} />
                            </td>
                            <td>
                              <button className="btn-save" disabled={!editingSalary[e._id]}
                                onClick={() => saveSalary(e._id, editingSalary[e._id])}>Save</button>
                            </td>
                            <td>
                              <button className="btn-delete" onClick={() => deleteEmployee(e._id)}>Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Payroll ── */}
              {staffView === 'payroll' && (
                <div>
                  {/* Month picker + loan form */}
                  <div style={{display:'flex', gap:'16px', flexWrap:'wrap', marginBottom:'24px', alignItems:'flex-end'}}>
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Month</label>
                      <input type="month" className="price-input" style={{width:'160px'}} value={payrollMonth}
                        onChange={e => setPayrollMonth(e.target.value)} />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Employee</label>
                      <select className="status-select" style={{width:'180px'}} value={newLoan.employeeId}
                        onChange={e => setNewLoan(p => ({...p, employeeId: e.target.value}))}>
                        <option value="">Select employee</option>
                        {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                      </select>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Loan Amount (EGP)</label>
                      <input type="number" className="price-input" style={{width:'130px'}} placeholder="0"
                        value={newLoan.amount} onChange={e => setNewLoan(p => ({...p, amount: e.target.value}))} />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Reason (optional)</label>
                      <input className="price-input" style={{width:'160px'}} placeholder="e.g. Medical"
                        value={newLoan.reason} onChange={e => setNewLoan(p => ({...p, reason: e.target.value}))} />
                    </div>
                    <button className="btn-delete" style={{padding:'8px 20px', fontSize:'13px'}} onClick={addLoan}
                      disabled={!newLoan.employeeId || !newLoan.amount}>
                      + Record Loan
                    </button>
                  </div>

                  {/* Payroll table */}
                  <div className="admin-table-wrap" style={{marginBottom:'24px'}}>
                    <table className="admin-table">
                      <thead>
                        <tr><th>Employee</th><th>Role</th><th>Base Salary</th><th>Loans This Month</th><th style={{color:'#4caf50'}}>Net Pay</th></tr>
                      </thead>
                      <tbody>
                        {employees.length === 0 && (
                          <tr><td colSpan={5} style={{color:'var(--gray)', textAlign:'center', padding:'32px'}}>No employees yet.</td></tr>
                        )}
                        {employees.map(e => {
                          const empLoans = loans.filter(l => String(l.employee?._id || l.employee) === String(e._id));
                          const totalLoans = empLoans.reduce((s, l) => s + l.amount, 0);
                          const net = e.salary - totalLoans;
                          return (
                            <tr key={e._id}>
                              <td><strong>{e.name}</strong></td>
                              <td>{e.role}</td>
                              <td style={{color:'var(--gold)'}}>{e.salary?.toLocaleString()} EGP</td>
                              <td style={{color:'#dc3545'}}>{totalLoans > 0 ? `– ${totalLoans.toLocaleString()} EGP` : '–'}</td>
                              <td><strong style={{color: net < 0 ? '#dc3545' : '#4caf50', fontSize:'15px'}}>{net.toLocaleString()} EGP</strong></td>
                            </tr>
                          );
                        })}
                        {employees.length > 0 && (
                          <tr style={{borderTop:'2px solid rgba(212,175,55,0.3)'}}>
                            <td colSpan={2}><strong style={{color:'var(--white)'}}>Total</strong></td>
                            <td style={{color:'var(--gold)'}}><strong>{employees.reduce((s,e)=>s+e.salary,0).toLocaleString()} EGP</strong></td>
                            <td style={{color:'#dc3545'}}><strong>– {loans.reduce((s,l)=>s+l.amount,0).toLocaleString()} EGP</strong></td>
                            <td><strong style={{color:'#4caf50', fontSize:'15px'}}>{(employees.reduce((s,e)=>s+e.salary,0) - loans.reduce((s,l)=>s+l.amount,0)).toLocaleString()} EGP</strong></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Loans list */}
                  {loans.length > 0 && (
                    <div>
                      <h4 style={{fontFamily:'var(--font-serif)', color:'var(--gold)', marginBottom:'12px', fontSize:'16px'}}>Loans — {payrollMonth}</h4>
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead><tr><th>Employee</th><th>Amount</th><th>Reason</th><th>Date</th><th>Remove</th></tr></thead>
                          <tbody>
                            {loans.map(l => (
                              <tr key={l._id}>
                                <td><strong>{l.employee?.name || '–'}</strong></td>
                                <td style={{color:'#dc3545'}}>{l.amount?.toLocaleString()} EGP</td>
                                <td>{l.reason || <span style={{color:'var(--gray)'}}>–</span>}</td>
                                <td>{new Date(l.date).toLocaleDateString('en-GB')}</td>
                                <td><button className="btn-delete" onClick={() => deleteLoan(l._id)}>Remove</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Org Chart ── */}
              {staffView === 'chart' && (
                <div style={{maxWidth:'700px'}}>
                  {employees.length === 0
                    ? <p style={{color:'var(--gray)', fontSize:'13px'}}>No employees yet.</p>
                    : renderTree(buildTree(employees))
                  }
                </div>
              )}
            </div>
          )}

          {/* Schedule */}
          {tab === 5 && (
            <div>
              {/* Block form */}
              <div className="card" style={{padding:'28px', marginBottom:'24px', maxWidth:'600px'}}>
                <h3 style={{fontFamily:'var(--font-serif)', fontSize:'20px', color:'var(--white)', marginBottom:'20px'}}>Block a Date or Slot</h3>

                <div style={{display:'flex', flexWrap:'wrap', gap:'16px', marginBottom:'16px'}}>
                  <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                    <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Date</label>
                    <input
                      type="date"
                      className="price-input"
                      style={{width:'160px'}}
                      value={blockForm.date}
                      onChange={e => setBlockForm(p => ({...p, date: e.target.value}))}
                    />
                  </div>
                  <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                    <label style={{fontSize:'11px', color:'var(--gray)', letterSpacing:'0.5px', textTransform:'uppercase'}}>Reason (optional)</label>
                    <input
                      className="price-input"
                      style={{width:'200px'}}
                      placeholder="e.g. Holiday, Staff out"
                      value={blockForm.reason}
                      onChange={e => setBlockForm(p => ({...p, reason: e.target.value}))}
                    />
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', marginBottom:'16px'}}>
                  <button
                    className={`admin-tab ${blockForm.allDay ? 'active' : ''}`}
                    style={{padding:'8px 18px', fontSize:'12px'}}
                    onClick={() => setBlockForm(p => ({...p, allDay: true, times: []}))}
                  >Full Day</button>
                  <button
                    className={`admin-tab ${!blockForm.allDay ? 'active' : ''}`}
                    style={{padding:'8px 18px', fontSize:'12px'}}
                    onClick={() => setBlockForm(p => ({...p, allDay: false}))}
                  >Specific Slots</button>
                </div>

                {!blockForm.allDay && (
                  <div style={{display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'16px'}}>
                    {ALL_SLOTS.map(t => {
                      const selected = blockForm.times.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => setBlockForm(p => ({
                            ...p,
                            times: selected ? p.times.filter(x => x !== t) : [...p.times, t]
                          }))}
                          style={{
                            padding:'7px 14px', borderRadius:'6px', fontSize:'12px', cursor:'pointer',
                            fontFamily:'var(--font-sans)', transition:'all 0.2s',
                            background: selected ? 'rgba(220,53,69,0.15)' : 'var(--dark-3)',
                            border: selected ? '1px solid rgba(220,53,69,0.5)' : '1px solid var(--dark-4)',
                            color: selected ? '#dc3545' : 'var(--gray-light)'
                          }}
                        >{t}</button>
                      );
                    })}
                  </div>
                )}

                <button
                  className="btn-delete"
                  style={{padding:'9px 24px', fontSize:'13px'}}
                  onClick={blockSlots}
                  disabled={!blockForm.date || (!blockForm.allDay && blockForm.times.length === 0)}
                >
                  Block {blockForm.allDay ? 'Entire Day' : `${blockForm.times.length} Slot${blockForm.times.length !== 1 ? 's' : ''}`}
                </button>
              </div>

              {/* Existing blocked slots */}
              {blockedSlots.length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Blocked Slot</th>
                        <th>Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockedSlots.map(s => (
                        <tr key={s._id}>
                          <td><strong>{new Date(s.date + 'T12:00:00').toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short', year:'numeric'})}</strong></td>
                          <td>{s.time ? s.time : <span style={{color:'var(--gold)'}}>Full Day</span>}</td>
                          <td>{s.reason || <span style={{color:'var(--gray)'}}>–</span>}</td>
                          <td>
                            <button className="btn-save" onClick={() => unblockSlot(s._id)}>Unblock</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{color:'var(--gray)', fontSize:'13px'}}>No blocked slots yet.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
