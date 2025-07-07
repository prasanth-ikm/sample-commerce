const express = require("express");
const userRouter = express.Router();
const userController = require('../controllers/user');
const { authMiddleware } = require("../controllers/common");

userRouter.post("/user/register", userController.addUser)
userRouter.post("/user/login", userController.loginUser)
userRouter.put("/user/change-password/:id", authMiddleware, userController.passwordChange)
userRouter.put("/user/update-details/:id", authMiddleware, userController.updateUser)
userRouter.get("/user/get-all", authMiddleware, userController.listUser)
userRouter.put("/user/add-update-address", authMiddleware, userController.addUpdateAddress)
userRouter.post("/user/delete-address", authMiddleware, userController.deleteAddress)
userRouter.get("/user/my-address", authMiddleware, userController.myAddress)
userRouter.post("/user/set-default-address", authMiddleware, userController.defaultAddress)
userRouter.get("/user/get-user", authMiddleware, userController.getById)
userRouter.put("/user/product-wishlist", authMiddleware, userController.productWishlist)

module.exports = userRouter;