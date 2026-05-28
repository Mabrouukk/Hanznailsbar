import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Services.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/services`).then(r => {
      setServices(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

  return (
    <div className="services-page">
      <div className="page-header">
        <div className="container">
          <p>HANZ NAILS SALON</p>
          <h1>Our Services Menu</h1>
          <div className="gold-line" style={{margin:'16px auto 0'}}></div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Perks Banner */}
          <div className="perks-row">
            <div className="perk-item"><span>👑</span> Professional Technicians Only</div>
            <div className="perk-item"><span>☕</span> Free Coffee, Iced Coffee & Matcha</div>
            <div className="perk-item"><span>🎂</span> 50% Birthday Discount</div>
            <div className="perk-item"><span>⏰</span> Online Booking Available</div>
          </div>

          {/* Category Tabs */}
          {services.length > 0 && (
            <div className="category-tabs">
              {services.map((cat, i) => (
                <button
                  key={i}
                  className={`tab-btn ${activeCategory === i ? 'active' : ''}`}
                  onClick={() => setActiveCategory(i)}
                >
                  {cat.icon} {cat.category}
                </button>
              ))}
            </div>
          )}

          {/* Services Grid */}
          {services[activeCategory] && (
            <div className="services-grid">
              {services[activeCategory].items.map((item, i) => (
                <div key={i} className="service-item-card">
                  <div className="service-item-header">
                    <h3>{item.name}</h3>
                    <div className="service-item-meta">
                      <span className="service-duration">⏱ {item.duration}</span>
                      <span className="service-item-price">{item.price} EGP</span>
                    </div>
                  </div>
                  <p>{item.description}</p>
                  <Link to="/booking" className="btn btn-outline service-book-btn">Book This</Link>
                </div>
              ))}
            </div>
          )}
          {/* CTA */}
          <div className="services-cta">
            <h2>Can't Decide? Let Us Help!</h2>
            <p>Contact us and our experts will recommend the perfect service for you.</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              <a href="https://wa.me/201020564047" target="_blank" rel="noreferrer" className="btn btn-gold">💬 WhatsApp Us</a>
              <Link to="/booking" className="btn btn-outline">Book Online</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
