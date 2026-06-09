import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const VALUES = [
  { icon: '✦', title: 'Certified Professionals Only', desc: 'Every technician on our team is certified and experienced. We never compromise on skill or quality.' },
  { icon: '☕', title: 'Free Beverages', desc: 'Complimentary coffee, iced coffee and matcha with every visit. Because you deserve to be treated from the moment you walk in.' },
  { icon: '🎂', title: '50% Birthday Discount', desc: 'Register with your birthday and receive an automatic 50% discount code on your special day. Our gift to you.' },
  { icon: '📱', title: 'Online Booking 24/7', desc: 'Book your appointment anytime, anywhere. Fast, easy and confirmed instantly.' },
];

const FOUNDERS = [
  {
    name: 'Mahmoud Mabrouk',
    role: 'Co-Founder',
    desc: 'Mahmoud built HÄNZ with a simple belief — that a nail salon should feel like a sanctuary, not just a service. He oversees operations and the overall experience to make sure every visit feels special.',
    initial: 'M',
  },
  {
    name: 'Marwan Mahrous',
    role: 'Co-Founder',
    desc: 'Marwan brings the creative vision behind HÄNZ. From the interior design to the brand identity, he crafted every detail to create a space where people genuinely want to spend time.',
    initial: 'M',
  },
  {
    name: 'Hana Elmasry',
        role: 'Branch Manager',
        desc: 'Hana oversees the day-to-day operations of our branch, ensuring that every guest receives the highest level of service and care.',
    initial: 'H',
  },
];

export default function About() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionsRef.current.forEach(s => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el); };

  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="about-orb about-orb-1"></div>
          <div className="about-orb about-orb-2"></div>
        </div>
        <div className="about-hero-content">
          <p className="about-eyebrow animate-fade-up">Our Story</p>
          <h1 className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            More Than a <span className="text-shimmer">Nail Salon</span>
          </h1>
          <p className="about-hero-sub animate-fade-up" style={{ animationDelay: '0.2s' }}>
            HÄNZ Nails Bar was born from a desire to create something different — a place where beauty meets comfort, and every visit feels like a treat.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section" ref={addRef}>
        <div className="container">
          <div className="about-story reveal">
            <div className="about-story-text">
              <p className="section-label">How It Started</p>
              <h2>Built for People, Not Just Profit</h2>
              <div className="gold-line" style={{ margin: '20px 0' }}></div>
              <p>HÄNZ Nails Bar opened its doors in the heart of Nasr City, Cairo with one mission — to create a comfortable space where people can truly unwind.</p>
              <p>We noticed that most nail salons were purely transactional. You come in, get your nails done, and leave. We wanted something different. A place where the experience matters just as much as the result.</p>
              <p>From the complimentary matcha and coffee to our carefully chosen team of certified professionals, every detail at HÄNZ was designed with you in mind.</p>
              <Link to="/booking" className="btn btn-gold" style={{ marginTop: '28px', display: 'inline-flex' }}>
                Book Your Experience
              </Link>
            </div>
            <div className="about-story-visual">
              <div className="about-visual-card">
                <div className="about-visual-icon">💅</div>
                <h3>HÄNZ NAILS BAR</h3>
                <p>Nasr City, Cairo</p>
                <div className="about-visual-stats">
                  <div className="about-stat">
                    <span className="about-stat-num">100%</span>
                    <span>Certified Team</span>
                  </div>
                  <div className="about-stat">
                    <span className="about-stat-num">24/7</span>
                    <span>Online Booking</span>
                  </div>
                  <div className="about-stat">
                    <span className="about-stat-num">50%</span>
                    <span>Birthday Discount</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section about-values-section" ref={addRef}>
        <div className="container">
          <div className="section-title reveal">
            <p>What We Stand For</p>
            <h2>The HÄNZ Difference</h2>
            <div className="gold-line"></div>
          </div>
          <div className="grid-2" style={{ marginTop: '48px' }}>
            {VALUES.map((v, i) => (
              <div key={i} className="about-value-card card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="about-value-icon">{v.icon}</div>
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="section" ref={addRef}>
        <div className="container">
          <div className="section-title reveal">
            <p>The People Behind HÄNZ</p>
            <h2>Meet the Founders</h2>
            <div className="gold-line"></div>
          </div>
          <div className="founders-grid">
            {FOUNDERS.map((f, i) => (
              <div key={i} className="founder-card card reveal" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="founder-avatar">{f.initial}</div>
                <h3>{f.name}</h3>
                <p className="founder-role">{f.role}</p>
                <div className="gold-line" style={{ margin: '16px auto', width: '40px' }}></div>
                <p className="founder-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" ref={addRef}>
        <div className="container">
          <div className="about-cta card reveal">
            <h2>Come Experience It Yourself</h2>
            <p>Words only go so far. The best way to understand what HÄNZ is about is to walk through our doors, grab a matcha, and let us take care of the rest.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
              <Link to="/booking" className="btn btn-gold btn-lg">Book Now</Link>
              <a href="https://wa.me/201020564047" target="_blank" rel="noreferrer" className="btn btn-outline btn-lg">WhatsApp Us</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}