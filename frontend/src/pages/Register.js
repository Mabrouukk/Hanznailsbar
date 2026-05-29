import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const COUNTRIES = [
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+963', flag: '🇸🇾', name: 'Syria' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', birthday: '' });
  const [countryCode, setCountryCode] = useState('+20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,12}$/.test(phoneNumber.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid phone number (7-12 digits)';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fullPhone = `${countryCode}${phoneNumber.replace(/\s/g, '')}`;
      await register({ ...form, phone: fullPhone });
      toast.success('Welcome to Hanz Nails! 🎉');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb"></div>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <span>💅</span>
            <h1>HÄNZ NAILS</h1>
            <p>Create your account</p>
          </div>

          <div className="birthday-promo-hint">
            🎂 Add your birthday to receive a <strong>50% discount</strong> on your special day!
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Full Name <span className="required-star">*</span></label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Your full name"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email Address <span className="required-star">*</span></label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number <span className="required-star">*</span></label>
              <div className="phone-input-row">
                <select
                  className="country-select"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => {
                    setPhoneNumber(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  placeholder="10 XXXX XXXX"
                  className={errors.phone ? 'input-error' : ''}
                />
              </div>
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Password <span className="required-star">*</span></label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Min. 6 characters"
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Birthday <span className="optional">(optional – get 50% off!)</span></label>
              <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}