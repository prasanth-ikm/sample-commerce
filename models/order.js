const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
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
  discount: {
    type: Number,
    default: 0,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
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
  address: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
  },
  deliveryStatus: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);