const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middlewares/authMiddleware');

// Image Upload Dependencies
const multer = require('multer');

// Multer Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload buffer to ImgBB
const uploadToImgBB = async (buffer) => {
  try {
    const base64Image = buffer.toString('base64');
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `image=${base64Image}`
    });
    
    const data = await response.json();
    if (!data.success) throw new Error('Image upload failed on ImgBB');
    return data.data.url; // Yeh image ki live link hai
  } catch (error) {
    throw new Error('Error uploading image');
  }
};

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
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, stock, brand } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    let imageUrl = req.body.image; // Agar URL paste kiya

    // Agar file upload ki hai
    if (req.file) {
      imageUrl = await uploadToImgBB(req.file.buffer);
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Please provide an image URL or upload a file' });
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      category,
      image: imageUrl,
      stock: Number(stock) || 0,
      brand: brand || '',
      user: req.user.id
    });

    const saved = await product.save();
    res.status(201).json({ success: true, product: saved });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ success: false, message: error.message || 'Server Error during product creation' });
  }
});

// PUT - Update product (Admin)
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let imageUrl = req.body.image || product.image;

    if (req.file) {
      imageUrl = await uploadToImgBB(req.file.buffer);
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.image = imageUrl;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.brand = req.body.brand !== undefined ? req.body.brand : product.brand;

    const updated = await product.save();
    res.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ success: false, message: error.message || 'Server Error during product update' });
  }
});

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