const express = require("express");
const cartRouter = express.Router();
const { authenticate } = require("../utils/auth");
const { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart 
} = require("../controllers/cartController");

cartRouter.get("/", authenticate, getCart);
cartRouter.post("/add", authenticate, addToCart);
cartRouter.put("/update", authenticate, updateCartItem);
cartRouter.delete("/remove/:productId", authenticate, removeFromCart);

module.exports = cartRouter;
