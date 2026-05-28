const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendBookingConfirmation } = require('../utils/emailService');

// @POST /api/bookings - Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { service, serviceCategory, date, time, notes, discountCode, originalPrice } = req.body;
    const user = await User.findById(req.user.id);

    let discountPercent = 0;
    let finalPrice = originalPrice || 0;

    if (discountCode) {
      const discountEntry = user.discountCodes.find(
        d => d.code === discountCode && !d.used && new Date(d.expiresAt) > new Date()
      );
      if (discountEntry) {
        discountPercent = discountEntry.discount;
        finalPrice = originalPrice * (1 - discountPercent / 100);
        discountEntry.used = true;
        await user.save();
      }
    }

    const booking = await Booking.create({
      user: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      service,
      serviceCategory,
      date: new Date(date),
      time,
      notes,
      discountCode,
      discountPercent,
      originalPrice,
      finalPrice
    });

    // Send email in background - never blocks response
    sendBookingConfirmation(user, booking).catch(err =>
      console.error('Booking confirmation email error:', err)
    );

    res.status(201).json({
      message: 'Booking confirmed! See you soon 💅',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @GET /api/bookings/my - Get user's bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;