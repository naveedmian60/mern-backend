const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// POST /api/reviews
router.post('/', asyncHandler(async (req, res) => {
  const { name, product, rating, message } = req.body;

  if (!name || !product || !rating || !message) {
    res.status(400);
    throw new Error('Please fill all fields and give a rating');
  }

  const review = new Review({ name, product, rating: Number(rating), message });
  const saved = await review.save();
  res.status(201).json({ success: true, message: 'Review submitted successfully', review: saved });
}));

// GET /api/reviews (Taake aap website par reviews show kar sakein)
router.get('/', asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, reviews });
}));

module.exports = router;