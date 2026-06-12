import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-orb"></div></div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>HÄNZ NAILS</h1>
            <p>Choose a new password</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
