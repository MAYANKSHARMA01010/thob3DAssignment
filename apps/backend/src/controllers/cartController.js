const { prisma } = require("../configs/db");

async function getOrCreateCart(userId) {
    let cart = await prisma.cart.findUnique({
        where: { userId },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
        });
    }

    return cart;
}

async function getCart(req, res) {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    return res.json(cart || { items: [] });
}

async function addToCart(req, res) {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            isVisible: true,
        },
    });

    if (!product) {
        return res.status(404).json({ message: "Product not available" });
    }

    if (product.stockQuantity < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
    }

    const cart = await getOrCreateCart(userId);

    await prisma.$transaction(async (tx) => {
        const existing = await tx.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (existing) {
            const newQuantity = existing.quantity + quantity;

            if (newQuantity > product.stockQuantity) {
                throw new Error("Stock limit exceeded");
            }

            await tx.cartItem.update({
                where: { id: existing.id },
                data: { quantity: newQuantity },
            });
        } else {
            await tx.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }
    });

    return res.json({ message: "Added to cart" });
}

async function updateCartItem(req, res) {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await getOrCreateCart(userId);

    if (quantity === 0) {
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId,
            },
        });

        return res.json({ message: "Item removed from cart" });
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product || product.stockQuantity < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
    }

    await prisma.cartItem.update({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
        data: { quantity },
    });

    return res.json({ message: "Cart updated" });
}

async function removeFromCart(req, res) {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId,
        },
    });

    return res.json({ message: "Item removed from cart" });
}

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};
