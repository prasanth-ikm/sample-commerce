const express = require("express");
const orderRouter = express.Router();
const orderController = require('../controllers/orders');
const { authMiddleware } = require("../controllers/common");

orderRouter.post("/orders/cart/add-product",authMiddleware, orderController.addToCart)
orderRouter.post("/orders/cart/delete-product",authMiddleware, orderController.deleteInCart)
orderRouter.post("/orders/cart/my-cart",authMiddleware, orderController.getCart)
orderRouter.post("/orders/buy-now",authMiddleware, orderController.buyNow)

module.exports = orderRouter;