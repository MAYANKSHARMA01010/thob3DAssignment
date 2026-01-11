const express = require("express");
const adminUsersRouter = express.Router();
const { authenticate } = require("../utils/auth");
const { getAllUsersForAdmin } = require("../controllers/adminUsersController");

adminUsersRouter.get("/", authenticate, getAllUsersForAdmin);

module.exports = adminUsersRouter;
