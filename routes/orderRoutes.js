const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middlewares/authMiddleware');

// POST /api/orders - Create new order
router.post('/', protect, asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Verify stock
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.name}`);
        }
        if (product.stock < item.qty) {
            res.status(400);
            throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
        }
    }

    // Calculate prices
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice >= 5000 ? 0 : 200;
    const totalPrice = itemsPrice + shippingPrice;

    // Deduct stock
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'COD',
        itemsPrice,
        shippingPrice,
        totalPrice,
        notes: notes || ''
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
}));

// GET /api/orders - All orders (Admin)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
}));

// GET /api/orders/myorders - My orders
router.get('/myorders', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
}));

// GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    res.json(order);
}));

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
        order.isPaid = true;
        order.paidAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
}));

// PUT /api/orders/:id/pay - Mark as paid
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body.paymentResult || {};
    const updated = await order.save();
    res.json(updated);
}));

// DELETE /api/orders/:id - Delete order (Admin)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    // Restore stock
    for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }
    await order.deleteOne();
    res.json({ message: 'Order deleted and stock restore' });
}));

module.exports = router;