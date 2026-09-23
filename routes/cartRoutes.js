const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const { protect } = require('../middlewares/authMiddleware');

// Helper function to get cart by user ID
const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, cartItems: [] });
  }
  return cart;
};

// GET /api/cart - User ki cart laane ke liye
router.get('/', protect, asyncHandler(async (req, res) => {
  const cart = await getCartByUserId(req.user.id);
  res.json(cart);
}));

// POST /api/cart - Cart mein item add ya update karne ke liye
router.post('/', protect, asyncHandler(async (req, res) => {
  const { product, name, image, price, qty } = req.body;
  const cart = await getCartByUserId(req.user.id);

  const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === product);

  if (itemIndex > -1) {
    // Agar product pehle se hai toh qty update karein
    cart.cartItems[itemIndex].qty = qty;
  } else {
    // Naya product add karein
    cart.cartItems.push({ product, name, image, price, qty });
  }

  const updatedCart = await cart.save();
  res.status(201).json(updatedCart);
}));

// DELETE /api/cart/:productId - Cart se koi item delete karne ke liye
router.delete('/:productId', protect, asyncHandler(async (req, res) => {
  const cart = await getCartByUserId(req.user.id);
  cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
}));

// DELETE /api/cart - Poori cart clear karne ke liye
router.delete('/', protect, asyncHandler(async (req, res) => {
  const cart = await getCartByUserId(req.user.id);
  cart.cartItems = [];
  await cart.save();
  res.json(cart);
}));

module.exports = router;