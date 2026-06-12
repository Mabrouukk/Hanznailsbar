import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const TABS = ['Overview', 'Bookings', 'Customers', 'Prices', 'Offer'];

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

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/admin/stats`),
      axios.get(`${API}/admin/bookings`),
      axios.get(`${API}/admin/users`),
      axios.get(`${API}/admin/services`),
      axios.get(`${API}/admin/settings`)
    ]).then(([s, b, u, sv, st]) => {
      setStats(s.data);
      setBookings(b.data);
      setUsers(u.data);
      setServices(sv.data);
      setOfferSettings(st.data);
      setOfferInput(st.data.offerPercentage);
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
            <div>
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

        </div>
      </div>
    </div>
  );
}
