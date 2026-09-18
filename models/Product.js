const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: 0 }, // Discount wali purani price
    discount: { type: Number, default: 0 },       // Discount percent
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    brand: { type: String, default: '' },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);