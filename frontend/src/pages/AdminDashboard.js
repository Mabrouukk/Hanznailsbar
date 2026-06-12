import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const TABS = ['Overview', 'Bookings', 'Customers', 'Prices', 'Offer', 'Schedule'];

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

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/admin/stats`),
      axios.get(`${API}/admin/bookings`),
      axios.get(`${API}/admin/users`),
      axios.get(`${API}/admin/services`),
      axios.get(`${API}/admin/settings`),
      axios.get(`${API}/admin/blocked-slots`)
    ]).then(([s, b, u, sv, st, bs]) => {
      setStats(s.data);
      setBookings(b.data);
      setUsers(u.data);
      setServices(sv.data);
      setOfferSettings(st.data);
      setOfferInput(st.data.offerPercentage);
      setBlockedSlots(bs.data);
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
