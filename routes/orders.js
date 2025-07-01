const express = require("express");
const orderRouter = express.Router();
const orderController = require('../controllers/orders');
const paymentController = require('../controllers/payment');
const { authMiddleware } = require("../controllers/common");

orderRouter.post("/orders/cart/add-product",authMiddleware, orderController.addToCart)
orderRouter.post("/orders/cart/remove-product",authMiddleware, orderController.deleteInCart)
orderRouter.get("/orders/cart/my-cart",authMiddleware, orderController.getCart)
orderRouter.get("/orders/my-order",authMiddleware, orderController.getOrder)
orderRouter.post("/orders/place-order",authMiddleware, orderController.buyNow)
orderRouter.post("/orders/make-payment",authMiddleware, paymentController.makePayment)

module.exports = orderRouter;