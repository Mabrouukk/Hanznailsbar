import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnnouncementBar.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export default function AnnouncementBar() {
  const [offer, setOffer] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setOffer(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const showing = offer?.offerEnabled && !dismissed;
    document.documentElement.style.setProperty('--ann-height', showing ? '40px' : '0px');
  }, [offer, dismissed]);

  if (!offer?.offerEnabled || dismissed) return null;

  return (
    <div className="announcement-bar">
      <span className="ann-text">
        🎉 Limited Time: Get <strong>{offer.offerPercentage}% Off</strong> all services — Book now!
      </span>
      <button className="ann-close" onClick={() => setDismissed(true)} aria-label="Dismiss">✕</button>
    </div>
  );
}
