const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middlewares/authMiddleware');

// GET /api/products - All products (public)
router.get('/', asyncHandler(async (req, res) => {
  const { category, search, sort, page = 1, limit = 144 } = req.query;

  let query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  let sortOption = {};
  if (sort === 'price-low') sortOption = { price: 1 };
  if (sort === 'price-high') sortOption = { price: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };
  if (sort === 'name') sortOption = { name: 1 };

  const products = await Product.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    products,
    page: Number(page),
    pages: Math.ceil(total / limit),
    total
  });
}));

// GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
}));

// POST - Create product (Admin)
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { name, price, description, category, image, stock, brand } = req.body;

  if (!name || !price || !description || !category || !image) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const product = new Product({
    name,
    price: Number(price),
    description,
    category,
    image,
    stock: Number(stock) || 0,
    brand: brand || '',
    user: req.user.id
  });

  const saved = await product.save();
  res.status(201).json({ success: true, product: saved });
}));

// PUT - Update product (Admin)
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = req.body.name || product.name;
  product.price = req.body.price ? Number(req.body.price) : product.price;
  product.description = req.body.description || product.description;
  product.category = req.body.category || product.category;
  product.image = req.body.image || product.image;
  product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
  product.brand = req.body.brand !== undefined ? req.body.brand : product.brand;

  const updated = await product.save();
  res.json({ success: true, product: updated });
}));

// DELETE - Delete product (Admin)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
}));

module.exports = router;