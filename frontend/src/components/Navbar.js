import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon"></span>
          <div className="brand-text">
            <span className="brand-name">HÄNZ NAILS</span>
            <span className="brand-tagline">The Art of Timeless Polish</span>
          </div>
        </Link>

        {/* 20% Price Increase Badge */}
        <div style={{
          background: '#ffecb3',
          color: '#b8860b',
          fontWeight: 'bold',
          borderRadius: '20px',
          padding: '6px 18px',
          marginLeft: '24px',
          fontSize: '0.75rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          display: 'inline-block',
          letterSpacing: '0.5px',
        }}>
          Sign up now and get 15% off your service
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/booking" className="nav-link">Book Now</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">My Account</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link nav-link-admin">Admin</Link>
              )}
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-gold nav-cta">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
