const mongoose = require('mongoose');

const blockedSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },  // YYYY-MM-DD
  time: { type: String, default: null },   // null = full day blocked
  reason: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('BlockedSlot', blockedSlotSchema);
