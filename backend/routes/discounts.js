const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @POST /api/discounts/validate - Validate a discount code
router.post('/validate', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);
    
    const discountEntry = user.discountCodes.find(
      d => d.code === code && !d.used && new Date(d.expiresAt) > new Date()
    );

    if (!discountEntry) {
      return res.status(400).json({ valid: false, message: 'Invalid or expired discount code' });
    }

    res.json({
      valid: true,
      discount: discountEntry.discount,
      message: `${discountEntry.discount}% discount applied! 🎉`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/discounts/my - Get user's discount codes
router.get('/my', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('discountCodes');
    const activeCodes = user.discountCodes.filter(
      d => !d.used && new Date(d.expiresAt) > new Date()
    );
    res.json(activeCodes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
