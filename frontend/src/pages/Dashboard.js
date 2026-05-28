import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const STATUS_COLORS = {
  pending: 'badge-blue', confirmed: 'badge-green',
  cancelled: 'badge-red', completed: 'badge-gold'
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/bookings/my`),
      axios.get(`${API}/discounts/my`)
    ]).then(([b, d]) => {
      setBookings(b.data);
      setCodes(d.data);
    }).finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.put(`${API}/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? {...b, status:'cancelled'} : b));
      toast.success('Booking cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="container">
          <p>YOUR ACCOUNT</p>
          <h1>Welcome, {user?.name}! 💅</h1>
          <div className="gold-line" style={{margin:'16px auto 0'}}></div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="dashboard-grid">
            {/* Profile Card */}
            <div className="dash-sidebar">
              <div className="card profile-card">
                <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <p>{user?.phone}</p>
                {user?.birthday && (
                  <div className="profile-birthday">
                    🎂 {new Date(user.birthday).toLocaleDateString('en-GB', {day:'numeric',month:'long'})}
                  </div>
                )}
                <Link to="/booking" className="btn btn-gold" style={{width:'100%',justifyContent:'center',marginTop:'20px'}}>
                  + New Booking
                </Link>
              </div>

              {/* Discount Codes */}
              {codes.length > 0 && (
                <div className="card">
                  <h4 className="section-label">🎟️ Your Discount Codes</h4>
                  {codes.map((c, i) => (
                    <div key={i} className="discount-code-item">
                      <div className="code-value">{c.code}</div>
                      <div className="code-meta">
                        <span className="badge badge-gold">{c.discount}% OFF</span>
                        <span style={{fontSize:'11px',color:'var(--gray)'}}>
                          Exp: {new Date(c.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings */}
            <div className="dash-main">
              <div className="dash-section-header">
                <h2>My Appointments</h2>
                <span className="bookings-count">{bookings.length} total</span>
              </div>
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No appointments yet</h3>
                  <p>Ready to treat yourself? Book your first appointment!</p>
                  <Link to="/booking" className="btn btn-gold">Book Now</Link>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((b, i) => (
                    <div key={i} className="booking-item card">
                      <div className="booking-item-header">
                        <div>
                          <h4>{b.service}</h4>
                          <p className="booking-category">{b.serviceCategory}</p>
                        </div>
                        <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                      </div>
                      <div className="booking-item-meta">
                        <span>📅 {new Date(b.date).toLocaleDateString('en-GB', {weekday:'short',day:'numeric',month:'short',year:'numeric'})}</span>
                        <span>⏰ {b.time}</span>
                        {b.finalPrice > 0 && <span>💰 {b.finalPrice} EGP</span>}
                        {b.discountPercent > 0 && <span className="text-gold">🎟️ {b.discountPercent}% off applied</span>}
                      </div>
                      {b.notes && <p className="booking-notes">📝 {b.notes}</p>}
                      {b.status === 'pending' && (
                        <button className="btn btn-dark" style={{marginTop:'12px',fontSize:'11px',padding:'6px 16px'}} onClick={() => cancelBooking(b._id)}>
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
