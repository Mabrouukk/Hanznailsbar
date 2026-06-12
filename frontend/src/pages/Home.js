import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const WHY_US = [
  { icon: '', title: 'Professional Technicians Only', desc: 'Every member of our team is a certified professional with years of experience. We never compromise on skill.' },
  { icon: '', title: 'Free Beverages', desc: 'Enjoy complimentary coffee, iced coffee, and matcha while you relax and let us take care of your beauty.' },
  { icon: '', title: '50% Birthday Discount', desc: 'Register with your birthday and receive an automatic 50% discount code on your special day. Our gift to you.' },
  { icon: '', title: 'Premium Products', desc: 'We use only high-quality, skin-safe products and the latest techniques for lasting, beautiful results.' },
  { icon: '', title: 'Online Booking', desc: 'Book your appointment 24/7 from the comfort of your home. Easy, fast, and confirmed instantly.' },
  { icon: '', title: 'Artistry & Precision', desc: 'From classic French tips to elaborate nail art and volume lashes — we craft each look with meticulous care.' },
];

const SERVICES_PREVIEW = [
  { icon: '', name: 'Hardgel & Extensions', desc: 'Hardgel, Polygel, SoftGel extensions and refills', price: 'From 500 EGP' },
  { icon: '', name: 'Gel Polish', desc: 'Long-lasting gel polish, treatments and nail art', price: 'From 100 EGP' },
  { icon: '', name: 'Pedicure', desc: 'Classic and VIP pedicure experiences', price: 'From 250 EGP' },
];
export default function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionsRef.current.forEach(s => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el); };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => <span key={i} className="particle" style={{ left: `${Math.random()*100}%`, animationDelay: `${Math.random()*8}s`, animationDuration: `${6+Math.random()*6}s` }}></span>)}
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-badge animate-fade-up">Nasr City's Premier Nails Bar</div>
          <h1 className="hero-title animate-fade-up" style={{animationDelay:'0.1s'}}>
            <span>The Art of</span>
            <span className="text-shimmer"> Timeless</span>
            <span> Polish</span>
          </h1>
          <p className="hero-sub animate-fade-up" style={{animationDelay:'0.2s'}}>
            Expert nail Technicians<br />
            Where precision meets artistry.
          </p>
          <div className="hero-actions animate-fade-up" style={{animationDelay:'0.3s'}}>
            <Link to="/booking" className="btn btn-gold btn-lg">Book Now</Link>
            <Link to="/services" className="btn btn-outline btn-lg">View Services</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Free Beverages Banner */}
      <div className="beverage-banner" ref={addRef}>
        <div className="container">
          <div className="beverage-inner reveal">
            <span>☕ Complimentary Beverages</span>
            <div className="bev-items">
              <span>☕ Coffee</span>
              <span>🧊 Iced Coffee</span>
              <span>🍵 Matcha</span>
            </div>
            <span>Free with every visit</span>
          </div>
        </div>
      </div>

      {/* Services Preview */}
      <section className="section" ref={addRef}>
        <div className="container">
          <div className="section-title reveal">
            <p>What We Offer</p>
            <h2>Our Services</h2>
            <div className="gold-line"></div>
          </div>
          <div className="services-preview-grid">
            {SERVICES_PREVIEW.map((s, i) => (
              <div key={i} className="service-preview-card reveal" style={{animationDelay: `${i*0.1}s`}}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="service-price">{s.price}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:'40px'}}>
            <Link to="/services" className="btn btn-outline">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* Our Salon */}
      <section className="salon-section" ref={addRef}>
        <div className="salon-bg" style={{backgroundImage: 'url(/gallery/img1.jpg)'}}></div>
        <div className="salon-overlay"></div>
        <div className="salon-content reveal">
          <p className="salon-label">Where Beauty Happens</p>
          <h2>Step Into Our World</h2>
          <div className="gold-line" style={{margin:'20px auto'}}></div>
          <p className="salon-desc">A space designed for you to relax, unwind, and leave feeling beautiful. Located in the heart of Nasr City, Cairo.</p>
          <Link to="/booking" className="btn btn-gold">Reserve Your Spot</Link>
        </div>
        <div className="salon-thumbnails">
          <div className="salon-thumb" style={{backgroundImage: 'url(/gallery/img2.jpg)'}}></div>
          <div className="salon-thumb" style={{backgroundImage: 'url(/gallery/img3.jpg)'}}></div>
          <div className="salon-thumb" style={{backgroundImage: 'url(/gallery/img4.jpg)'}}></div>
        </div>
      </section>

      {/* Why Hanz Nails */}
      <section className="section why-section" ref={addRef}>
        <div className="container">
          <div className="section-title reveal">
            <p>The Hanz Difference</p>
            <h2>Why Choose Hanz Nails?</h2>
            <div className="gold-line"></div>
          </div>
          <div className="grid-3">
            {WHY_US.map((item, i) => (
              <div key={i} className="why-card card reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Birthday CTA */}
      <section className="section birthday-section" ref={addRef}>
        <div className="container">
          <div className="birthday-card reveal">
            <div className="birthday-content">
              <div className="birthday-emoji">🎂</div>
              <h2>It's Your Birthday? We've Got You!</h2>
              <p>Register with your birthday and we'll automatically send you a <strong>50% discount code</strong> on your special day. Because you deserve to feel beautiful.</p>
              <Link to="/register" className="btn btn-gold btn-lg">Register & Get 50% Off Birthday</Link>
            </div>
            <div className="birthday-badge">
              <div className="badge-circle">
                <strong>50%</strong>
                <span>OFF</span>
                <small>Birthday Gift</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="section info-section" ref={addRef}>
        <div className="container">
          <div className="info-grid">
            <div className="info-card card reveal">
              <h3>⏰ Opening Hours</h3>
              <div className="hours-table">
                <div className="hour-row"><span>all the week</span><span>11:00 AM – 9:00 PM</span></div>
              </div>
            </div>
            <div className="info-card card reveal">
              <h3>📍 Find Us</h3>
              <p className="location-text">19 Ali Amer Street, Nasr City, Cairo, Egypt</p>
              <p className="location-sub">We're conveniently located in the heart of Nasr City, easily accessible from all major routes.</p>
              <div className="contact-btns">
                <a href="tel:+201020564047" className="btn btn-dark">📞 +20 10 2056 4047</a>
                <a href="https://wa.me/201020564047" target="_blank" rel="noreferrer" className="btn btn-dark">💬 WhatsApp</a>
              </div>
              <a
                href="https://maps.app.goo.gl/NNRYdS7a87aFaNta9?g_st=ic"
                target="_blank" rel="noreferrer"
                className="btn btn-outline map-link"
              >
                🗺️ Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section" ref={addRef}>
        <div className="container">
          <div className="cta-inner reveal">
            <h2>Ready to Look & Feel Amazing?</h2>
            <p>Book your appointment online in seconds — available 24/7</p>
            <Link to="https://www.hanznailsbar.com/booking" className="btn btn-gold btn-lg">Book Your Appointment Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
