const express = require("express");
const {
  validateSignUpMiddleware,
  checkUserExistsMiddleware,
} = require("../middlewares/user.middleware.js");
const { getAllUsers, signUp } = require("../controllers/user.controller.js");

const router = express.Router();

router.get("/", getAllUsers);

router.post(
  "/signup",
  validateSignUpMiddleware,
  checkUserExistsMiddleware,
  signUp
);

module.exports = router;
