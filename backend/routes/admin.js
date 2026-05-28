const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All admin routes require auth + admin role
router.use(auth, adminAuth);

// @GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/admin/bookings - Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/admin/bookings/:id/status - Update booking status + send email
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email phone');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Send email when confirmed or cancelled
    if (status === 'confirmed' || status === 'cancelled') {
      const { sendBookingStatusEmail } = require('../utils/emailService');
      sendBookingStatusEmail(booking).catch(err =>
        console.error('Status email error:', err)
      );
    }

    res.json({ message: 'Status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/admin/stats - Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
    const todayBookings = await Booking.countDocuments({ date: { $gte: todayStart, $lte: todayEnd } });

    res.json({
      totalUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      todayBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;