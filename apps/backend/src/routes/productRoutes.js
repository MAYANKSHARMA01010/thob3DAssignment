const express = require("express");
const productRoutes = express.Router();

const {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    getAllProductsAdmin,
    getVisibleProducts,
    getProductById,
} = require("../controllers/productController");

const { authenticate } = require("../utils/auth");
const adminOnly = require("../middlewares/adminMiddleware");

productRoutes.post("/", authenticate, adminOnly, createProduct);
productRoutes.put("/:id", authenticate, adminOnly, updateProduct);
productRoutes.delete("/:id", authenticate, adminOnly, deleteProduct);
productRoutes.patch("/:id/visibility", authenticate, adminOnly, toggleProductVisibility);
productRoutes.get("/admin/all", authenticate, adminOnly, getAllProductsAdmin);

productRoutes.get("/", getVisibleProducts);
productRoutes.get("/:id", authenticate, getProductById);

module.exports = productRoutes;
