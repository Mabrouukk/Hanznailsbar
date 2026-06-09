import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Services.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/services`).then(r => {
      setServices(r.data);
      // Open first category by default
      if (r.data.length > 0) setOpenCategories({ 0: true });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleCategory = (i) => {
    setOpenCategories(prev => ({ ...prev, [i]: !prev[i] }));
  };

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

          {/* Perks */}
          <div className="perks-row">
            <div className="perk-item"><span></span> Professional Technicians</div>
            <div className="perk-item"><span></span> Free Coffee & Matcha</div>
            <div className="perk-item"><span></span> 50% Birthday Discount</div>
            <div className="perk-item"><span></span> Online Booking</div>
          </div>

          {/* Accordion */}
          <div className="services-accordion">
            {services.map((cat, ci) => (
              <div key={ci} className={`accordion-item ${openCategories[ci] ? 'open' : ''}`}>
                <button className="accordion-header" onClick={() => toggleCategory(ci)}>
                  <div className="accordion-title">
                    <span className="accordion-icon">{cat.icon}</span>
                    <span>{cat.category}</span>
                    <span className="accordion-count">{cat.items.length} services</span>
                  </div>
                  <span className="accordion-arrow">{openCategories[ci] ? '▲' : '▼'}</span>
                </button>

                {openCategories[ci] && (
                  <div className="accordion-body">
                    <div className="accordion-services-grid">
                      {cat.items.map((item, ii) => (
                        <div key={ii} className="accordion-service-row">
                          <div className="accordion-service-info">
                            <span className="accordion-service-name">{item.name}</span>
                            <span className="accordion-service-duration"> {item.duration}</span>
                          </div>
                          <div className="accordion-service-right">
                            <span className="accordion-service-price">{item.price} EGP</span>
                            <Link to="/booking" className="btn-book-small">Book</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="services-cta">
            <h2>Ready to Book?</h2>
            <p>Choose multiple services in one booking — mix and match as you like!</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/booking" className="btn btn-gold btn-lg">Book Now</Link>
              <a href="https://wa.me/201020564047" target="_blank" rel="noreferrer" className="btn btn-outline">💬 WhatsApp Us</a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}