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

// PUT /api/orders/:id/cancel - User apna order cancel karene ke liye (NAYA ROUTE)
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check karein ke yeh order usi user ka hai jo request kar raha hai
    if (order.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to cancel this order');
    }

    // Order sirf tab cancel ho jab Pending ya Processing mein ho
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      res.status(400);
      throw new Error('Cannot cancel order that is already shipped or delivered');
    }

    order.status = 'Cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

module.exports = router;