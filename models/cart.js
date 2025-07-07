const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      qty: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
      originalPrice: {
        type: Number,
        default: 0,
      },
      title: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      size: {
        type: String,
        default: '',
      },
      productCode: {
        type: String,
      },
    },
  ],
  totalQty: {
    type: Number,
    default: 0,
    required: true,
  },
  totalCost: {
    type: Number,
    default: 0,
    required: true,
  },
  originalCost: {
    type: Number,
    default: 0,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
  },
  discount: {
    type: Number,
    default: 0,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Cart", cartSchema);