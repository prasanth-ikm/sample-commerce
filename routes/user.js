const express = require("express");
const userRouter = express.Router();
const userController = require('../controllers/user');

userRouter.post("/user/register", userController.addUser)
userRouter.post("/user/login", userController.loginUser)
userRouter.put("/user/change-password/:id", userController.passwordChange)
userRouter.put("/user/update-details/:id", userController.updateUser)
userRouter.get("/user/get-all", userController.listUser)
userRouter.put("/user/get-user/:id", userController.getById)

module.exports = userRouter;