const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

const SEED_SERVICES = [
  { category: "Nail Services", name: "Hardgel New Set", price: 850 },
  { category: "Nail Services", name: "Hardgel On Natural Nails", price: 750 },
  { category: "Nail Services", name: "Refill Hardgel Extension", price: 750 },
  { category: "Nail Services", name: "Refill Hardgel", price: 550 },
  { category: "Nail Services", name: "Polygel", price: 1200 },
  { category: "Nail Services", name: "SoftGel Extension", price: 700 },
  { category: "Nail Services", name: "Refill SoftGel", price: 500 },
  { category: "Nail Services", name: "Gel Polish", price: 500 },
  { category: "Nail Services", name: "Treatment without color", price: 550 },
  { category: "Nail Services", name: "manicure VIP", price: 500 },
  { category: "Nail Services", name: "manicure", price: 250 },
  { category: "Nail Services", name: "Treatment + Gel Polish", price: 700 },
  { category: "Nail Services", name: "Fake Nails + Gel Polish", price: 600 },
  { category: "Nail Services", name: "Fake Nails Feet + Gel Polish", price: 550 },
  { category: "Nail Services", name: "Gel Feet", price: 500 },
  { category: "Nail Services", name: "Remove + Nail Polish", price: 350 },
  { category: "Nail Services", name: "Nail Polish", price: 200 },
  { category: "Nail Services", name: "Fake Nails + Nail Polish", price: 450 },
  { category: "Nail Services", name: "French", price: 200 },
  { category: "Nail Services", name: "Ombre", price: 200 },
  { category: "Nail Services", name: "Chrome", price: 100 },
  { category: "Nail Services", name: "Cat Eye", price: 150 },
  { category: "Nail Services", name: "Nail Art Design", price: 20 },
  { category: "Nail Services", name: "Nail Art Design (Complex)", price: 50 },
  { category: "Nail Services", name: "3D Design One Finger", price: 75 },
  { category: "Nail Services", name: "Fixing two fingers", price: 75 },
  { category: "Nail Services", name: "Remove", price: 100 },
  { category: "Nail Services", name: "Classic Pedicure", price: 250 },
  { category: "Nail Services", name: "VIP Pedicure", price: 500 },
  { category: "Nail Services", name: "Refill Hard Gel + Color", price: 650 },
];

router.get('/', async (req, res) => {
  try {
    let services = await Service.find().sort({ category: 1, name: 1 });
    if (services.length === 0) {
      services = await Service.insertMany(SEED_SERVICES);
    }
    // Group by category to match old format
    const grouped = services.reduce((acc, s) => {
      const cat = acc.find(c => c.category === s.category);
      const item = { _id: s._id, name: s.name, price: s.price };
      if (cat) cat.items.push(item);
      else acc.push({ category: s.category, icon: '💅', items: [item] });
      return acc;
    }, []);
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
module.exports.SEED_SERVICES = SEED_SERVICES;
