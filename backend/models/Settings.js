const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  offerEnabled: { type: Boolean, default: false },
  offerPercentage: { type: Number, default: 15 }
});

module.exports = mongoose.model('Settings', settingsSchema);
