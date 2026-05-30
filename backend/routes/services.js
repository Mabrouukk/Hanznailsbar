const express = require('express');
const router = express.Router();
const services = [
  {
    category: "Nail Services",
    icon: "💅",
    items: [
      { name: "Hardgel New Set", price: 638},
      { name: "Hardgel On Natural Nails", price: 525},
      { name: "Polygel", price: 900 },
      { name: "Refill Hardgel", price: 413},
      { name: "SoftGel Extension", price: 525 },
      { name: "Refill SoftGel", price: 375 },
      { name: "Gel Polish", price: 375,},
      { name: "Treatment without color", price: 413 },
      { name: "manicure VIP", price: 375 },
      { name: "manicure", price: 188},
      { name: "Treatment + Gel Polish", price: 525},
      { name: "Fake Nails + Gel Polish", price: 450 },
      { name: "Fake Nails Feet + Gel Polish", price: 413 },
      { name: "Gel Feet", price: 375},
      { name: "Remove + Nail Polish", price: 263},
      { name: "Nail Polish", price: 150},
      { name: "Fake Nails + Nail Polish", price: 338},
      { name: "French", price: 150 },
      { name: "Ombre", price: 150},
      { name: "Chrome", price: 75},
      { name: "Cat Eye", price: 113},
      { name: "Nail Art Design", price: 15},
      { name: "Nail Art Design (Complex)", price: 38},
      { name: "3D Design One Finger", price: 56 },
      { name: "Fixing", price: 56},
      { name: "Remove", price: 113},
      { name: "Classic Pedicure", price: 188},
      { name: "VIP Pedicure", price: 375},
    ]
  }
];


router.get('/', (req, res) => {
  res.json(services);
});

router.get('/', (req, res) => {
  res.json(servicesWithUpdatedPrices);
});

module.exports = router;