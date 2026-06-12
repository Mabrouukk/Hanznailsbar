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
    if (status === 'confirmed' || status === 'cancelled' || status === 'completed') { 
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

// @DELETE /api/admin/bookings/:id - Delete booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/admin/services - Get all services for editing
router.get('/services', async (req, res) => {
  try {
    const Service = require('../models/Service');
    let services = await Service.find().sort({ category: 1, name: 1 });
    if (services.length === 0) {
      const { SEED_SERVICES } = require('./services');
      services = await Service.insertMany(SEED_SERVICES);
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @POST /api/admin/services - Create a new service
router.post('/services', async (req, res) => {
  try {
    const Service = require('../models/Service');
    const { name, price, category } = req.body;
    if (!name || !price || !category) return res.status(400).json({ message: 'Name, price, and category are required' });
    const service = await Service.create({ name, price: Number(price), category });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/admin/services/:id - Update service price
router.put('/services/:id', async (req, res) => {
  try {
    const Service = require('../models/Service');
    const { price } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { price: Number(price) },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @DELETE /api/admin/services/:id - Delete a service
router.delete('/services/:id', async (req, res) => {
  try {
    const Service = require('../models/Service');
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/admin/settings
router.get('/settings', async (req, res) => {
  try {
    const { getSettings } = require('./settings');
    res.json(await getSettings());
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/admin/settings
router.put('/settings', async (req, res) => {
  try {
    const Settings = require('../models/Settings');
    const { offerEnabled, offerPercentage } = req.body;
    let s = await Settings.findOne();
    if (!s) s = new Settings();
    if (offerEnabled !== undefined) s.offerEnabled = offerEnabled;
    if (offerPercentage !== undefined) s.offerPercentage = Number(offerPercentage);
    await s.save();
    res.json(s);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/admin/blocked-slots
router.get('/blocked-slots', async (_req, res) => {
  try {
    const BlockedSlot = require('../models/BlockedSlot');
    const slots = await BlockedSlot.find().sort({ date: 1, time: 1 });
    res.json(slots);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// @POST /api/admin/blocked-slots
router.post('/blocked-slots', async (req, res) => {
  try {
    const BlockedSlot = require('../models/BlockedSlot');
    const { date, time, reason } = req.body;
    if (!date) return res.status(400).json({ message: 'Date required' });
    const slot = await BlockedSlot.create({ date, time: time || null, reason: reason || '' });
    res.status(201).json(slot);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// @DELETE /api/admin/blocked-slots/:id
router.delete('/blocked-slots/:id', async (req, res) => {
  try {
    const BlockedSlot = require('../models/BlockedSlot');
    await BlockedSlot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Unblocked' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;