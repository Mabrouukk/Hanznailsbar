import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const ALL_TIME_SLOTS = [
  '11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM',
  '6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM',
];

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [services, setServices] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingMode, setBookingMode] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [activeCodes, setActiveCodes] = useState([]);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (user) setBookingMode('user');
  }, [user]);

  useEffect(() => {
    axios.get(`${API}/services`).then(r => setServices(r.data));
    if (user) {
      axios.get(`${API}/discounts/my`).then(r => setActiveCodes(r.data)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (date) {
      axios.get(`${API}/bookings/slots?date=${date}`)
        .then(r => setBookedSlots(r.data))
        .catch(() => setBookedSlots([]));
    }
  }, [date]);

  const goToStep = (n) => {
    setStep(n);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const toggleService = (item, categoryName) => {
    const exists = selectedServices.find(s => s.name === item.name);
    if (exists) {
      setSelectedServices(prev => prev.filter(s => s.name !== item.name));
    } else {
      setSelectedServices(prev => [...prev, { ...item, category: categoryName }]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const finalPrice = discount ? totalPrice * (1 - discount.discount / 100) : totalPrice;

  const applyDiscount = async () => {
    if (!discountCode) return;
    setDiscountLoading(true);
    try {
      const { data } = await axios.post(`${API}/discounts/validate`, { code: discountCode });
      setDiscount(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
      setDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const serviceNames = selectedServices.map(s => s.name).join(', ');
      const categoryNames = [...new Set(selectedServices.map(s => s.category))].join(', ');

      if (bookingMode === 'guest') {
        await axios.post(`${API}/bookings/guest`, {
          guestName: guestInfo.name,
          guestEmail: guestInfo.email,
          guestPhone: guestInfo.phone,
          service: serviceNames,
          serviceCategory: categoryNames,
          date, time, notes,
          originalPrice: totalPrice,
          finalPrice: totalPrice
        });
        toast.success('Booking request sent! Check your email.');
        setTimeout(() => navigate('/'), 1500);
      } else {
        await axios.post(`${API}/bookings`, {
          service: serviceNames,
          serviceCategory: categoryNames,
          date, time, notes,
          discountCode,
          originalPrice: totalPrice,
          finalPrice
        });
        toast.success('Booking confirmed! Check your email.');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (!bookingMode) {
    return (
      <div className="booking-page">
        <div className="page-header">
          <div className="container">
            <p>ONLINE BOOKING</p>
            <h1>Reserve Your Appointment</h1>
            <div className="gold-line" style={{margin:'16px auto 0'}}></div>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <div className="booking-mode-select">
              <h2>How would you like to book?</h2>
              <div className="booking-mode-cards">
                <div className="booking-mode-card card" onClick={() => navigate('/login')}>
                  <div className="mode-icon">👤</div>
                  <h3>Login & Book</h3>
                  <p>Access your booking history, use discount codes and get birthday offers</p>
                  <Link to="/login" className="btn btn-gold" style={{marginTop:'16px'}}>Login</Link>
                </div>
                <div className="booking-mode-card card" onClick={() => setBookingMode('guest')}>
                  <div className="mode-icon">⚡</div>
                  <h3>Book as Guest</h3>
                  <p>Quick booking without an account. Just your name, email and phone</p>
                  <button className="btn btn-outline" style={{marginTop:'16px'}} onClick={() => setBookingMode('guest')}>Continue as Guest</button>
                </div>
              </div>
              <p style={{textAlign:'center', marginTop:'16px', color:'var(--gray)', fontSize:'13px'}}>
                Don't have an account? <Link to="/register" style={{color:'var(--gold)'}}>Register free</Link> and get birthday discounts!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="page-header">
        <div className="container">
          <p>ONLINE BOOKING</p>
          <h1>Reserve Your Appointment</h1>
          <div className="gold-line" style={{margin:'16px auto 0'}}></div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          {bookingMode === 'guest' && (
            <div style={{textAlign:'center', marginBottom:'24px'}}>
              <span style={{color:'var(--gray)', fontSize:'13px'}}>
                Booking as guest — <button onClick={() => setBookingMode(null)} style={{background:'none', border:'none', color:'var(--gold)', cursor:'pointer', fontSize:'13px'}}>change</button>
              </span>
            </div>
          )}
          <div className="booking-layout">
            <div className="booking-form-wrap" ref={formRef}>
              <div className="booking-steps">
                {['Services','Date & Time', bookingMode === 'guest' ? 'Your Details' : 'Discount','Confirm'].map((s,i) => (
                  <div key={i} className={`booking-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
                    <div className="step-num">{step > i+1 ? '✓' : i+1}</div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="booking-step-content">
                  <h2>Choose Your Services</h2>
                  <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px'}}>Select one or more services</p>
                  {selectedServices.length > 0 && (
                    <div className="selected-services-bar">
                      <strong style={{color:'var(--gold)'}}>Selected ({selectedServices.length}):</strong>
                      <div style={{display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px'}}>
                        {selectedServices.map((s,i) => (
                          <span key={i} className="selected-service-tag">
                            {s.name} — {s.price} EGP
                            <button onClick={() => toggleService(s, s.category)}>✕</button>
                          </span>
                        ))}
                      </div>
                      <div style={{marginTop:'12px', color:'var(--gold)', fontWeight:'600'}}>
                        Total: {totalPrice} EGP
                      </div>
                    </div>
                  )}
                  {services.map((cat, ci) => (
                    <div key={ci} className="service-category-section">
                      <h3 className="service-category-title">{cat.icon} {cat.category}</h3>
                      <div className="services-select-grid">
                        {cat.items.map((item, ii) => {
                          const isSelected = selectedServices.find(s => s.name === item.name);
                          return (
                            <div key={ii} className={`service-select-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleService(item, cat.category)}>
                              <div className="service-select-name">{item.name}</div>
                              <div className="service-select-meta">
                                <span>{item.duration}</span>
                                <span className="service-select-price">{item.price} EGP</span>
                              </div>
                              {isSelected && <div className="service-check">✓</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-gold" style={{width:'100%', marginTop:'24px'}} onClick={() => goToStep(2)} disabled={selectedServices.length === 0}>
                    Continue → ({selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} — {totalPrice} EGP)
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="booking-step-content">
                  <h2>Choose Date & Time</h2>
                  <div className="form-group">
                    <label>Select Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} min={minDate} />
                  </div>
                  {date && (
                    <div className="form-group">
                      <label>Select Time Slot</label>
                      <div className="time-slots">
                        {ALL_TIME_SLOTS.map((t,i) => {
                          const isBooked = bookedSlots.includes(t);
                          return (
                            <button key={i} className={`time-slot ${time === t ? 'selected' : ''} ${isBooked ? 'booked' : ''}`} onClick={() => !isBooked && setTime(t)} type="button" disabled={isBooked}>
                              {t}{isBooked ? ' ✗' : ''}
                            </button>
                          );
                        })}
                      </div>
                      <p style={{fontSize:'12px', color:'var(--gray)', marginTop:'8px'}}>✗ = already booked</p>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requests?" />
                  </div>
                  <div style={{display:'flex',gap:'12px'}}>
                    <button className="btn btn-dark" style={{flex:1}} onClick={() => goToStep(1)}>← Back</button>
                    <button className="btn btn-gold" style={{flex:2}} onClick={() => goToStep(3)} disabled={!date || !time}>Continue →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="booking-step-content">
                  {bookingMode === 'guest' ? (
                    <>
                      <h2>Your Details</h2>
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" value={guestInfo.name} onChange={e => setGuestInfo(p => ({...p, name: e.target.value}))} placeholder="Your full name" />
                      </div>
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input type="email" value={guestInfo.email} onChange={e => setGuestInfo(p => ({...p, email: e.target.value}))} placeholder="your@email.com" />
                      </div>
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" value={guestInfo.phone} onChange={e => setGuestInfo(p => ({...p, phone: e.target.value}))} placeholder="+20 10 XXXX XXXX" />
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>Discount Code</h2>
                      {activeCodes.length > 0 && (
                        <div className="discount-codes-available">
                          <p>Your active codes:</p>
                          {activeCodes.map((c,i) => (
                            <button key={i} className="available-code" onClick={() => setDiscountCode(c.code)}>
                              {c.code} ({c.discount}% OFF)
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="discount-input-row">
                        <div className="form-group" style={{flex:1, marginBottom:0}}>
                          <label>Discount Code</label>
                          <input type="text" value={discountCode} onChange={e => setDiscountCode(e.target.value.toUpperCase())} placeholder="Enter code" />
                        </div>
                        <button className="btn btn-outline apply-btn" onClick={applyDiscount} disabled={discountLoading}>
                          {discountLoading ? '...' : 'Apply'}
                        </button>
                      </div>
                      {discount && <p className="discount-success">✅ {discount.message}</p>}
                    </>
                  )}
                  <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
                    <button className="btn btn-dark" style={{flex:1}} onClick={() => goToStep(2)}>← Back</button>
                    <button className="btn btn-gold" style={{flex:2}} onClick={() => goToStep(4)} disabled={bookingMode === 'guest' && (!guestInfo.name || !guestInfo.email || !guestInfo.phone)}>
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="booking-step-content">
                  <h2>Confirm Your Booking</h2>
                  <div className="booking-summary">
                    {bookingMode === 'guest' && (
                      <>
                        <div className="summary-row"><span>Name</span><strong>{guestInfo.name}</strong></div>
                        <div className="summary-row"><span>Phone</span><strong>{guestInfo.phone}</strong></div>
                      </>
                    )}
                    <div className="summary-row">
                      <span>Services</span>
                      <strong style={{textAlign:'right', maxWidth:'60%'}}>{selectedServices.map(s => s.name).join(', ')}</strong>
                    </div>
                    <div className="summary-row"><span>Date</span><strong>{new Date(date).toLocaleDateString('en-GB', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</strong></div>
                    <div className="summary-row"><span>Time</span><strong>{time}</strong></div>
                    {notes && <div className="summary-row"><span>Notes</span><strong>{notes}</strong></div>}
                    <div className="summary-row"><span>Total</span><strong>{totalPrice} EGP</strong></div>
                    {discount && <div className="summary-row text-gold"><span>Discount ({discount.discount}% off)</span><strong>-{(totalPrice - finalPrice).toFixed(0)} EGP</strong></div>}
                    <div className="summary-row summary-total"><span>Final Total</span><strong>{bookingMode === 'guest' ? totalPrice : Math.round(finalPrice)} EGP</strong></div>
                  </div>
                  <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
                    <button className="btn btn-dark" style={{flex:1}} onClick={() => goToStep(3)}>← Back</button>
                    <button className="btn btn-gold" style={{flex:2}} onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Confirming...' : '✅ Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="booking-sidebar">
              {selectedServices.length > 0 && (
                <div className="sidebar-card card">
                  <h4>Your Selection</h4>
                  {selectedServices.map((s,i) => (
                    <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--dark-4)', fontSize:'13px'}}>
                      <span style={{color:'var(--gray-light)'}}>{s.name}</span>
                      <span style={{color:'var(--gold)'}}>{s.price} EGP</span>
                    </div>
                  ))}
                  <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', fontWeight:'600'}}>
                    <span style={{color:'var(--white)'}}>Total</span>
                    <span style={{color:'var(--gold)'}}>{totalPrice} EGP</span>
                  </div>
                </div>
              )}
              <div className="sidebar-card card">
                <h4>👑 Why Book With Us</h4>
                <ul>
                  <li>✓ Certified professional technicians</li>
                  <li>✓ Instant email confirmation</li>
                  <li>✓ Free coffee, iced coffee & matcha</li>
                  <li>✓ Birthday 50% discount</li>
                  <li>✓ Premium products only</li>
                </ul>
              </div>
              <div className="sidebar-card card">
                <h4>📞 Need Help?</h4>
                <a href="tel:+201020564047" className="sidebar-contact">📞 +20 10 2056 4047</a>
                <a href="https://wa.me/201020564047" target="_blank" rel="noreferrer" className="btn btn-gold" style={{width:'100%',justifyContent:'center',marginTop:'12px'}}>💬 WhatsApp Us</a>
              </div>
              <div className="sidebar-card card">
                <h4>⏰ Opening Hours</h4>
                <p style={{fontSize:'13px', color:'var(--gray)'}}>All week: 11AM–9:00PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}