const { get } = require("http");
const { prisma } = require("../configs/db");

const placeOrder = async (req, res) => {
    const userId = req.user.id;

    try {
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

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                ERROR: "Cart is empty",
            });
        }

        let totalAmount = 0;

        for (const item of cart.items) {
            if (item.quantity > item.product.stockQuantity) {
                return res.status(400).json({
                    ERROR: `Insufficient stock for ${item.product.name}`,
                });
            }

            totalAmount +=
                Number(item.product.price) * item.quantity;
        }

        const order = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: "CONFIRMED",
                },
            });

            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        orderId: createdOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        priceAtPurchase: item.product.price,
                    },
                });

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            return createdOrder;
        });

        return res.status(201).json({
            message: "Order placed successfully",
            orderId: order.id,
        });
    } catch (error) {
        console.error("Place order error:", error);
        return res.status(500).json({
            ERROR: "Failed to place order",
        });
    }
};

const getMyOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                                category: true,
                            },
                        },
                    },
                },
            },
        });

        return res.json(orders);
    } catch (error) {
        console.error("Get my orders error:", error);
        return res.status(500).json({
            ERROR: "Failed to fetch orders",
        });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
};
