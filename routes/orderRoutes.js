const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect, admin } = require('../middlewares/authMiddleware');
const { sendOrderConfirmationEmail, sendAdminOrderEmail } = require('../utils/sendEmail.js');

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

    // 🔥 EMAIL NOTIFICATION LOGIC 🔥
    try {
      const itemsList = orderItems.map(item => `<li>${item.name} (Qty: ${item.quantity}) - Rs ${item.price * item.quantity}</li>`).join('');
      
      const customerEmailHTML = `
        <h2>Thank you for your order, ${shippingInfo.fullName}!</h2>
        <p>Your order has been received and is being processed.</p>
        <h3>Order Details:</h3>
        <ul>${itemsList}</ul>
        <h3>Total Amount: Rs ${totalPrice}</h3>
        <p>Payment Method: ${paymentMethod}</p>
        <br>
        <p>Shipping Address: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}</p>
        <br>
        <p>Thank you for shopping with ShopZone!</p>
      `;

      const adminEmailHTML = `
        <h2>New Order Received!</h2>
        <p>A new order has been placed by ${shippingInfo.fullName}.</p>
        <h3>Order Details:</h3>
        <ul>${itemsList}</ul>
        <h3>Total Amount: Rs ${totalPrice}</h3>
        <p>Customer Email: ${shippingInfo.email}</p>
        <p>Customer Phone: ${shippingInfo.phone}</p>
        <p>Shipping Address: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}</p>
      `;
      // Customer ko email bhejna
      await sendOrderConfirmationEmail(shippingInfo.email, shippingInfo.fullName, orderItems, totalPrice, shippingInfo);
      
      // Admin ko email bhejna (Aapke email par)
      await sendAdminOrderEmail(orderItems, totalPrice, shippingInfo);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Agar email fail ho, toh order save hoga lekin email nahi jayega
    }

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

// PUT /api/orders/:id/cancel - User apna order cancel karene ke liye
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to cancel this order');
    }

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

// DELETE /api/orders/:id - User apna order history se delete karne ke liye
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to delete this order');
    }

    await order.deleteOne();
    res.json({ success: true, message: 'Order removed from history' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

module.exports = router;