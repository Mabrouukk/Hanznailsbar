const express = require('express');
const router = express.Router();
const services = [
  {
    category: "Nail Services",
    icon: "💅",
    items: [
      { name: "Hardgel New Set", price: 850},
      { name: "Hardgel On Natural Nails", price: 700},
      { name: "Polygel", price: 1200 },
      { name: "Refill Hardgel", price: 550},
      { name: "SoftGel Extension", price: 600 },
      { name: "Refill SoftGel", price: 500 },
      { name: "Gel Polish", price: 500,},
      { name: "Treatment without color", price: 300 },
      { name: "manicure VIP", price: 500 },
      { name: "manicure", price: 250},
      { name: "Treatment + Gel Polish", price: 700},
      { name: "Fake Nails + Gel Polish", price: 600 },
      { name: "Fake Nails Feet + Gel Polish", price: 550 },
      { name: "Gel Feet", price: 500},
      { name: "Remove + Nail Polish", price: 350},
      { name: "Nail Polish", price: 200},
      { name: "Fake Nails + Nail Polish", price: 450},
      { name: "French", price: 200 },
      { name: "Ombre", price: 200},
      { name: "Chrome", price: 100},
      { name: "Cat Eye", price: 100},
      { name: "Nail Art Design", price: 20},
      { name: "Nail Art Design (Complex)", price: 50},
      { name: "3D Design One Finger", price: 75 },
      { name: "Fixing", price: 75},
      { name: "Remove", price: 150},
      { name: "Classic Pedicure", price: 250},
      { name: "VIP Pedicure", price: 500},
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