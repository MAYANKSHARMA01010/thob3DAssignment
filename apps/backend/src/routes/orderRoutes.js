const express = require("express");
const { authenticate } = require("../utils/auth");
const { placeOrder, getMyOrders } = require("../controllers/orderController");
const orderRouter = express.Router();

orderRouter.post("/place", authenticate, placeOrder);
orderRouter.get("/my", authenticate, getMyOrders);

module.exports = orderRouter;
