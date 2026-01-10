const express = require("express");
const authRouter = express.Router();

const {
    createUserMiddleware,
    loginUserMiddleware,
} = require("../middlewares/authMiddleware");

const {
    checkUserExists,
} = require("../middlewares/checkUserExists.middleware");

const {
    createUserController,
    loginUserController,
} = require("../controllers/authController");

authRouter.post(
    "/register",
    createUserMiddleware,
    checkUserExists,
    createUserController
);

authRouter.post(
    "/login",
    loginUserMiddleware,
    checkUserExists,
    loginUserController
);

module.exports = authRouter;
