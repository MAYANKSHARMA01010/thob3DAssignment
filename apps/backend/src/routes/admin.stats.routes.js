const express = require("express");
const adminStatsRouter = express.Router();

const { authenticate } = require("../utils/auth");
const { getAdminStats } = require("../controllers/admin.stats.controller");

adminStatsRouter.get("/stats", authenticate, getAdminStats);

module.exports = adminStatsRouter;
