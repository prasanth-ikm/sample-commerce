const express = require("express");
const productRouter = express.Router();
const productController = require('../controllers/product');

productRouter.post("/product/add-product", productController.addProduct)
productRouter.put("/product/update-product/:id", productController.updateProduct)
productRouter.get("/product/list-all", productController.listAllProduct)
productRouter.get("/product/all-by-category/:mainCategory", productController.listByCategory)
productRouter.get("/product/product-by-id/:id", productController.getById)
productRouter.get("/product/product-by-code/:code", productController.getByCode)

module.exports = productRouter;