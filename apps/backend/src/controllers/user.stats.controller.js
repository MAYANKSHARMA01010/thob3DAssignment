const { prisma } = require("../configs/db");

const getUserStats = async (req, res) => {
    const userId = req.user.id;

    try {
        const totalOrders = await prisma.order.count({
            where: { userId },
        });

        const cart = await prisma.cart.findUnique({
            where: { userId },
            select: {
                items: {
                    select: { quantity: true },
                },
            },
        });

        const totalCartItems = cart
            ? cart.items.reduce((sum, i) => sum + i.quantity, 0)
            : 0;

        return res.json({
            totalOrders,
            totalCartItems,
        });
    } catch (error) {
        console.error("User stats error:", error);
        return res.status(500).json({
            ERROR: "Failed to fetch user stats",
        });
    }
};

module.exports = {
    getUserStats,
};
