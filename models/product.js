const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  offerPercentage: { type: Number, required: true },
  deliveryStatus: { type: String, required: true },
  reviews: { type: Number, required: true },        // converted to Number
  ratings: { type: Number, required: true },        // converted to Number
  category: [{ type: String, required: true }],
  mainCategory: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  product_details: {
    fabric: { type: String },
    color: { type: String },
    work: { type: String },
    occasion: { type: String },
    size: [{ type: String }]
  },
  images: [{ type: String }],
  sellerName: { type: String },
  combo_offer: {
    productId: { type: String },
    image: { type: String }
  }
},{
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);
