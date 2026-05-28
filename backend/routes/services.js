const express = require('express');
const router = express.Router();
const services = [
  {
    category: "Nail Services",
    icon: "💅",
    items: [
      { name: "Hardgel New Set", price: 850, duration: "120 mins", description: "Full hardgel nail set" },
      { name: "Hardgel On Natural Nails", price: 700, duration: "90 mins", description: "Hardgel applied on natural nails" },
      { name: "Polygel", price: 1200, duration: "90 mins", description: "Polygel nail extensions" },
      { name: "Refill Hardgel", price: 550, duration: "60 mins", description: "Hardgel refill maintenance" },
      { name: "SoftGel Extension", price: 700, duration: "75 mins", description: "Soft gel nail extensions" },
      { name: "Refill SoftGel", price: 500, duration: "75 mins", description: "SoftGel refill maintenance" },
      { name: "Gel Polish", price: 500, duration: "45 mins", description: "Long-lasting gel polish" },
      { name: "Treatment + Gel Polish", price: 700, duration: "75 mins", description: "Nail treatment with gel polish" },
      { name: "Fake Nails + Gel Polish", price: 600, duration: "60 mins", description: "Fake nails with gel polish" },
      { name: "Fake Nails Feet + Gel Polish", price: 550, duration: "30 mins", description: "Feet fake nails with gel polish" },
      { name: "Gel Feet", price: 500, duration: "30 mins", description: "Gel polish for feet" },
      { name: "Remove + Nail Polish", price: 350, duration: "30 mins", description: "Removal with new nail polish" },
      { name: "Nail Polish", price: 200, duration: "30 mins", description: "Classic nail polish" },
      { name: "Fake Nails + Nail Polish", price: 450, duration: "45 mins", description: "Fake nails with nail polish" },
      { name: "French", price: 200, duration: "30 mins", description: "Classic French manicure" },
      { name: "Ombre", price: 200, duration: "30 mins", description: "Beautiful ombre nail effect" },
      { name: "Chrome", price: 100, duration: "30 mins", description: "Chrome nail finish" },
      { name: "Cat Eye", price: 150, duration: "30 mins", description: "Magnetic cat eye effect" },
      { name: "Nail Art Design", price: 20, duration: "30 mins", description: "Simple nail art design" },
      { name: "Nail Art Design (Complex)", price: 50, duration: "30 mins", description: "Complex nail art design" },
      { name: "3D Design One Finger", price: 75, duration: "30 mins", description: "3D nail art on one finger" },
      { name: "Fixing", price: 75, duration: "30 mins", description: "Nail fixing service" },
      { name: "Remove", price: 150, duration: "30 mins", description: "Nail removal service" },
      { name: "Classic Pedicure", price: 250, duration: "60 mins", description: "Classic relaxing pedicure" },
      { name: "VIP Pedicure", price: 500, duration: "30 mins", description: "Premium VIP pedicure experience" },
    ]
  }
];

router.get('/', (req, res) => {
  res.json(services);
});

router.get('/', (req, res) => {
  res.json(services);
});

module.exports = router;