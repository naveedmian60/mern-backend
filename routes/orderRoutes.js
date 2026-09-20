const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect, admin } = require('../middlewares/authMiddleware');

// POST /api/orders - Naya order place karna
router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, shippingInfo, paymentMethod, totalPrice } = req.body;

  if (items && items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Frontend ke 'items' ko backend ke 'orderItems' format mein convert karna
    const orderItems = items.map(item => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingInfo,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}));

// GET /api/orders/myorders - User ka apna order history dekhne ke liye
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// GET /api/orders - Admin ke liye sare orders dekhne ke liye
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
}));

// PUT /api/orders/:id/status - Admin order status update karne ke liye
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

module.exports = router;