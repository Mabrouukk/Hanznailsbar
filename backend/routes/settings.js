const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

const getSettings = async () => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
};

// @GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    res.json(await getSettings());
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
module.exports.getSettings = getSettings;
