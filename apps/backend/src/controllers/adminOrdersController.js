const { prisma } = require("../configs/db");

const getAllOrdersForAdmin = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ ERROR: "Admin access only" });
        }

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedOrders = orders.map((order) => ({
            id: order.id,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            user: order.user,
            items: order.orderItems.map((item) => ({
                productId: item.productId,
                name: item.product.name,
                image: item.product.imageUrl,
                quantity: item.quantity,
                price: item.priceAtPurchase,
            })),
        }));

        return res.json({ orders: formattedOrders });
    } catch (error) {
        console.error("Admin get orders error:", error);
        return res.status(500).json({
            ERROR: "Failed to fetch orders",
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ ERROR: "Admin access only" });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                ERROR: "Invalid order status",
            });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return res.json({
            message: "Order status updated",
            order,
        });
    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json({
            ERROR: "Failed to update order status",
        });
    }
};

module.exports = {
    getAllOrdersForAdmin,
    updateOrderStatus,
};
