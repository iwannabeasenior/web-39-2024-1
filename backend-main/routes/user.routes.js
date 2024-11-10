const express = require("express");
const userMiddleware = require("../middlewares/user.middleware.js");
const userController = require("../controllers/user.controller.js");
const userUtil = require("../utils/user.util.js");
const authMiddware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post(
  "/signup",
  userUtil.validateSignUpSignUp,
  userMiddleware.checkUserExistsSignUp,
  userController.signUp
);

router.post("/login", userMiddleware.checkUserExistLogin, userController.login);

router.post("/refresh-token", userController.refreshToken);

module.exports = router;
