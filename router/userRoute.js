const express = require("express");
const { UserController } = require("../controller");
const { validateSession } = require("../utils/sessionUtil");
const userRouter = express.Router();

userRouter.get("/get-user", validateSession, UserController.getUser);
userRouter.post("/add-user", UserController.addUser);
userRouter.put("/update-user", validateSession, UserController.updateUser);
userRouter.put("/reset-Password", UserController.resetPassword)
userRouter.delete("/delete-user", validateSession, UserController.deleteUser);
userRouter.post("/login", UserController.login);
userRouter.post("/logout", validateSession, UserController.logout);
userRouter.post("/validate-session", validateSession, UserController.validateSession);

module.exports = userRouter;
