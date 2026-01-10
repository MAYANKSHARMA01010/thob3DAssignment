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
    getMeController,
} = require("../controllers/authController");

const { 
    authenticate 
} = require("../utils/auth");

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

authRouter.get(
    "/me", 
    authenticate, 
    getMeController
);

module.exports = authRouter;
