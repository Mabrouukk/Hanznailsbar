import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
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
            <p>Reset your password</p>
          </div>
          {sent ? (
            <div style={{textAlign:'center'}}>
              <p style={{color:'var(--gold)', fontSize:'40px', marginBottom:'16px'}}>✉️</p>
              <p style={{color:'var(--gray-light)', lineHeight:'1.8', marginBottom:'24px'}}>
                If that email is registered, a reset link has been sent. Check your inbox.
              </p>
              <Link to="/login" className="btn btn-outline" style={{display:'inline-block'}}>Back to Login</Link>
            </div>
          ) : (
            <>
              <p style={{color:'var(--gray)', fontSize:'13px', marginBottom:'24px', lineHeight:'1.7'}}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-gold auth-submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="auth-link">
                <Link to="/login">Back to Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
