const express = require('express');
const router = express.Router();

const services = [
  {
    category: "Nail Services",
    icon: "💅",
    items: [
      { name: "Hardgel New Set", price: 850, duration: "120 mins"},
      { name: "Hardgel On Natural Nails", price: 700, duration: "90 min"},
      { name: "polygel", price: 1200, duration: "90 min"},
      { name: "Refill Hardgel", price: 250, duration: "60 min" },
      { name: "Nail Art Design", price: 20, duration: "30 min" },
      { name: "Nail Art Design (Complex)", price: 50, duration: "30 min" },
      { name: "Classic Pedicure", price: 250, duration: "60 min"},
      { name: "VIP Pedicure", price: 500, duration: "30 min" },
      { name: "SoftGel Extention", price: 700, duration: "75 min"},
      { name: "Refill SoftGel ", price: 500, duration: "75 min"},
      { name: "Treatment + GelPolish ", price: 700, duration: "75 min" },
      { name: "Gel Polish", price: 500, duration: "45 min" },
      { name: "Fake Nails + Nail Polish", price: 450, duration: "45 min" },
      { name: "Fake Nails + Gel Polish", price: 600, duration: "60 min" },
      { name: "Fake Nails Feet + Gel Polish", price: 550, duration: "30 min" },
      { name: "Gel Feet", price: 500, duration: "30 min" },
      { name: "Remove + Nail Polish", price: 350, duration: "30 min" },
      { name: "Nail Polish", price: 200, duration: "30 min" },
      { name: "French", price: 200, duration: "30 min" },
      { name: "Chrome", price: 100, duration: "30 min" },
      { name: "Fixing", price: 75, duration: "30 min" },
      { name: "Ombre", price: 200, duration: "30 min" },
      { name: "Cat eye", price: 150, duration: "30 min" },
      { name: "3D Design One Finger", price: 75, duration: "30 min" }
    ]
  },
];

router.get('/', (req, res) => {
  res.json(services);
});

module.exports = router;
