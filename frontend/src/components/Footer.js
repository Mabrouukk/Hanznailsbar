import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">💅</span>
              <div>
                <h3>HÄNZ NAILS</h3>
                <p>The Art of Timeless Polish</p>
              </div>
            </div>
            <p className="footer-desc">
              Cairo's premier nail bar. We blend artistry with precision to deliver beauty experiences that last.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/hanznailssalon" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/hanz_nailbar?igsh=Zm4xZTBzazhlMXE1" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.tiktok.com/@hnz.nails.bar?_r=1&_t=ZS-974v2If71vU" target="_blank" rel="noreferrer" aria-label="TikTok" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
              </a>
              <a href="https://wa.me/201020564047" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-btn social-btn-green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/booking">Book Appointment</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Opening Hours</h4>
            <ul className="hours-list">
              <li><span>All the week</span><span>11:00 AM – 9:00 PM</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-icon">📍</span>
                <span>19 Ali Amer St, Nasr City, Cairo, Egypt</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+201020564047">+20 10 2056 4047</a>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+201013666610">+20 10 1366 6610</a>
              </li>
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:hanznailsbar@gmail.com">hanznailsbar@gmail.com</a>
              </li>
            </ul>
            <a href="https://maps.app.goo.gl/NNRYdS7a87aFaNta9" target="_blank" rel="noreferrer" className="btn btn-outline map-btn">
              📍 View on Google Maps
            </a>
          </div>
        </div>

        <div className="footer-map">
  <iframe
    title="HANZ Nails Location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.1367724879346!2d31.339670775645825!3d30.061613774915017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583feb0512dcc7%3A0x326c049df8cc69e8!2sH%C3%84NZ%20Nails%20Bar!5e0!3m2!1sen!2seg!4v1781044856326!5m2!1sen!2seg"
    width="100%"
    height="220"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HÄNZ Nails Bar · hanznailsbar.com · Official Website · All Rights Reserved.</p>
          <p className="footer-tagline">The Art of Timeless Polish 💅</p>
        </div>
      </div>
    </footer>
  );
}