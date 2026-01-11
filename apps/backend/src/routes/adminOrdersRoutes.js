const express = require("express");
const adminOrdersRouter = express.Router();
const { authenticate } = require("../utils/auth");
const { getAllOrdersForAdmin, updateOrderStatus } = require("../controllers/adminOrdersController");


adminOrdersRouter.get("/", authenticate, getAllOrdersForAdmin);
adminOrdersRouter.patch("/:orderId/status", authenticate, updateOrderStatus);

module.exports = adminOrdersRouter;
