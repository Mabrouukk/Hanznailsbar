const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendBookingConfirmation, sendGuestBookingConfirmation, sendAdminBookingAlert } = require('../utils/emailService');

// @POST /api/bookings - Create booking (logged in users)
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
      service, serviceCategory,
      date: new Date(date),
      time, notes, discountCode, discountPercent, originalPrice, finalPrice
    });

    sendBookingConfirmation(user, booking).catch(err =>
      console.error('Booking confirmation email error:', err)
    );
    sendAdminBookingAlert(booking).catch(err =>
      console.error('Admin booking alert error:', err)
    );

    res.status(201).json({ message: 'Booking confirmed! See you soon 💅', booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @POST /api/bookings/guest - Guest booking
router.post('/guest', async (req, res) => {
  try {
    const { guestName, guestEmail, guestPhone, service, serviceCategory, date, time, notes, originalPrice } = req.body;

    if (!guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({ message: 'Name, email and phone are required' });
    }
    if (!service || !date || !time) {
      return res.status(400).json({ message: 'Service, date and time are required' });
    }

    const booking = await Booking.create({
      userName: guestName,
      userEmail: guestEmail,
      userPhone: guestPhone,
      isGuest: true,
      service, serviceCategory,
      date: new Date(date),
      time, notes,
      originalPrice: originalPrice || 0,
      finalPrice: originalPrice || 0
    });

    sendGuestBookingConfirmation(booking).catch(err =>
      console.error('Guest booking email error:', err)
    );
    sendAdminBookingAlert(booking).catch(err =>
      console.error('Admin booking alert error:', err)
    );

    res.status(201).json({ message: 'Booking request sent! We will confirm shortly 💅', booking });
  } catch (error) {
    console.error('Guest booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @GET /api/bookings/slots - Get booked slots for a date
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date required' });

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      date: { $gte: start, $lte: end },
      status: { $nin: ['cancelled'] }
    }).select('time');

    res.json(bookings.map(b => b.time));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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