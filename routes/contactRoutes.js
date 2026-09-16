const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const contact = new Contact({ name, email, subject, message });
  const saved = await contact.save();
  res.status(201).json({ success: true, message: 'Message sent successfully', contact: saved });
}));

module.exports = router;