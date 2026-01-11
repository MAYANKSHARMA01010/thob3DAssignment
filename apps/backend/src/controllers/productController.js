const { prisma } = require("../configs/db");

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            imageUrl,
            category,
            stockQuantity,
        } = req.body;

        if (!name || !price || !imageUrl || !category || stockQuantity == null) {
            return res.status(400).json({ message: "All required fields missing" });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                category,
                stockQuantity,
                createdById: req.user.id,
            },
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.update({
            where: { id },
            data: req.body,
        });

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id },
        });

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const toggleProductVisibility = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                isVisible: !product.isVisible,
            },
        });

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getVisibleProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { isVisible: true },
            orderBy: { createdAt: "desc" },
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product || (!product.isVisible && req.user?.role !== "ADMIN")) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    getAllProductsAdmin,
    getVisibleProducts,
    getProductById,
};
