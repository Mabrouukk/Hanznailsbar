import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const TIME_SLOTS = [
  '10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM',
  '6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM'
];

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceCategory: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    discountCode: '',
    originalPrice: 0
  });
  const [discount, setDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [activeCodes, setActiveCodes] = useState([]);

  useEffect(() => {
    axios.get(`${API}/services`).then(r => setServices(r.data));
    axios.get(`${API}/discounts/my`).then(r => setActiveCodes(r.data)).catch(() => {});
  }, []);

  const selectedCategory = services.find(c => c.category === form.serviceCategory);
  const selectedService = selectedCategory?.items.find(i => i.name === form.service);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'serviceCategory') setForm(prev => ({ ...prev, serviceCategory: value, service: '', originalPrice: 0 }));
    if (name === 'service') {
      const cat = services.find(c => c.category === form.serviceCategory);
      const svc = cat?.items.find(i => i.name === value);
      setForm(prev => ({ ...prev, service: value, originalPrice: svc?.price || 0 }));
    }
  };

  const applyDiscount = async () => {
    if (!form.discountCode) return;
    setDiscountLoading(true);
    try {
      const { data } = await axios.post(`${API}/discounts/validate`, { code: form.discountCode });
      setDiscount(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
      setDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  };

  const finalPrice = discount
    ? form.originalPrice * (1 - discount.discount / 100)
    : form.originalPrice;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, {
        ...form,
        finalPrice
      });
      toast.success('🎉 Booking confirmed! Check your email.');
setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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
          <div className="booking-layout">
            {/* Steps */}
            <div className="booking-form-wrap">
              {/* Progress */}
              <div className="booking-steps">
                {['Service','Date & Time','Confirm'].map((s,i) => (
                  <div key={i} className={`booking-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
                    <div className="step-num">{step > i+1 ? '✓' : i+1}</div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              {/* Step 1: Service */}
              {step === 1 && (
                <div className="booking-step-content">
                  <h2>Choose Your Service</h2>
                  <div className="form-group">
                    <label>Service Category</label>
                    <select name="serviceCategory" value={form.serviceCategory} onChange={handleChange}>
                      <option value="">-- Select Category --</option>
                      {services.map((c,i) => <option key={i} value={c.category}>{c.icon} {c.category}</option>)}
                    </select>
                  </div>
                  {selectedCategory && (
                    <div className="form-group">
                      <label>Select Service</label>
                      <select name="service" value={form.service} onChange={handleChange}>
                        <option value="">-- Select Service --</option>
                        {selectedCategory.items.map((s,i) => (
                          <option key={i} value={s.name}>{s.name} – {s.price} EGP ({s.duration})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedService && (
                    <div className="selected-service-info">
                      <h4>{selectedService.name}</h4>
                      <p>{selectedService.description}</p>
                      <div className="service-info-meta">
                        <span>⏱ {selectedService.duration}</span>
                        <span className="text-gold">{selectedService.price} EGP</span>
                      </div>
                    </div>
                  )}
                  <button
                    className="btn btn-gold" style={{width:'100%',marginTop:'24px'}}
                    onClick={() => setStep(2)}
                    disabled={!form.service}
                  >Continue →</button>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="booking-step-content">
                  <h2>Choose Date & Time</h2>
                  <div className="form-group">
                    <label>Select Date</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} min={minDate} />
                  </div>
                  {form.date && (
                    <div className="form-group">
                      <label>Select Time Slot</label>
                      <div className="time-slots">
                        {TIME_SLOTS.map((t,i) => (
                          <button
                            key={i}
                            className={`time-slot ${form.time === t ? 'selected' : ''}`}
                            onClick={() => setForm(prev => ({...prev, time: t}))}
                            type="button"
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Notes (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special requests or information?" />
                  </div>
                  <div style={{display:'flex',gap:'12px'}}>
                    <button className="btn btn-dark" style={{flex:1}} onClick={() => setStep(1)}>← Back</button>
                    <button
                      className="btn btn-gold" style={{flex:2}}
                      onClick={() => setStep(3)}
                      disabled={!form.date || !form.time}
                    >Continue →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="booking-step-content">
                  <h2>Confirm Your Booking</h2>
                  <div className="booking-summary">
                    <div className="summary-row"><span>Service</span><strong>{form.service}</strong></div>
                    <div className="summary-row"><span>Category</span><strong>{form.serviceCategory}</strong></div>
                    <div className="summary-row"><span>Date</span><strong>{new Date(form.date).toLocaleDateString('en-GB', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</strong></div>
                    <div className="summary-row"><span>Time</span><strong>{form.time}</strong></div>
                    {form.notes && <div className="summary-row"><span>Notes</span><strong>{form.notes}</strong></div>}
                    <div className="summary-row"><span>Original Price</span><strong>{form.originalPrice} EGP</strong></div>
                    {discount && <div className="summary-row text-gold"><span>Discount ({discount.discount}% off)</span><strong>-{(form.originalPrice - finalPrice).toFixed(0)} EGP</strong></div>}
                    <div className="summary-row summary-total"><span>Total</span><strong>{finalPrice.toFixed(0)} EGP</strong></div>
                  </div>

                  {/* Discount Code */}
                  {activeCodes.length > 0 && (
                    <div className="discount-codes-available">
                      <p>🎉 You have active discount codes:</p>
                      {activeCodes.map((c,i) => (
                        <button key={i} className="available-code" onClick={() => setForm(prev => ({...prev, discountCode: c.code}))}>
                          {c.code} ({c.discount}% OFF)
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="discount-input-row">
                    <div className="form-group" style={{flex:1, marginBottom:0}}>
                      <label>Discount Code</label>
                      <input
                        type="text" name="discountCode" value={form.discountCode}
                        onChange={handleChange} placeholder="Enter discount code"
                        style={{textTransform:'uppercase'}}
                      />
                    </div>
                    <button className="btn btn-outline apply-btn" onClick={applyDiscount} disabled={discountLoading}>
                      {discountLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {discount && <p className="discount-success">✅ {discount.message}</p>}

                  <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
                    <button className="btn btn-dark" style={{flex:1}} onClick={() => setStep(2)}>← Back</button>
                    <button className="btn btn-gold" style={{flex:2}} onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Confirming...' : '✅ Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="booking-sidebar">
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
                <p>Contact us directly:</p>
                <a href="tel:+201020564047" className="sidebar-contact">📞 +20 10 2056 4047</a>
                <a href="https://wa.me/201020564047" target="_blank" rel="noreferrer" className="btn btn-gold" style={{width:'100%',justifyContent:'center',marginTop:'12px'}}>💬 WhatsApp Us</a>
              </div>
              <div className="sidebar-card card">
                <h4>⏰ Opening Hours</h4>
                <div style={{fontSize:'13px', color:'var(--gray)'}}>
                  <p>Mon–Thu: 10AM–9PM</p>
                  <p>Friday: 2PM–9PM</p>
                  <p>Saturday: 10AM–10PM</p>
                  <p>Sunday: 10AM–9PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
