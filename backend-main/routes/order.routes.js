const express = require("express");
const userMiddleware = require("../middlewares/user.middleware.js");
const orderController = require("../controllers/order.controller.js");
const authMiddware = require("../middlewares/auth.middleware.js");
const { route } = require("./user.routes.js");
// const userUtil = require("../utils/user.util.js");
// const authMiddware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(authMiddware.authenticateToken);

router.get("/",orderController.getAllOrders);

router.get('/get-all-orders', authMiddware.authenticateToken, orderController.getAllOrdersOfCustomer);

router.post("/create-order", orderController.createOrder);

router.post("/update-evaluate/:orderId", orderController.updateEvaluate);
// router.patch("/update-reservation", orderController.updateOrder);

// router.delete("/delete-reservation", orderController.deleteOrder);

module.exports = router;
