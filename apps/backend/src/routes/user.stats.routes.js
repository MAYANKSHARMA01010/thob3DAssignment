const express = require("express");
const { authenticate } = require("../utils/auth");
const { getUserStats } = require("../controllers/user.stats.controller");
const userStatsRouter = express.Router();

userStatsRouter.get("/stats", authenticate, getUserStats);

module.exports = userStatsRouter;
