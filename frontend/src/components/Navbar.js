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

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* Backdrop — always in DOM, shown/hidden via CSS */}
      <div className={`menu-backdrop ${menuOpen ? 'visible' : ''}`} onClick={close} />

      {/* Mobile drawer — outside <nav> to avoid backdrop-filter stacking context */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <button className="menu-close" onClick={close} aria-label="Close menu">✕</button>
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

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link to="/" className="navbar-brand">
            <span className="brand-icon"></span>
            <div className="brand-text">
              <span className="brand-name">HÄNZ NAILS</span>
              <span className="brand-tagline">The Art of Timeless Polish</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="navbar-menu">
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
    </>
  );
}
