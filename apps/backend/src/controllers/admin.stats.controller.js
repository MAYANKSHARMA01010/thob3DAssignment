const { prisma } = require("../configs/db");

const getAdminStats = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                ERROR: "Admin access only",
            });
        }

        const [totalUsers, totalProducts, totalOrders] =
            await Promise.all([
                prisma.user.count(),
                prisma.product.count(),
                prisma.order.count(),
            ]);

        return res.json({
            totalUsers,
            totalProducts,
            totalOrders,
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return res.status(500).json({
            ERROR: "Failed to fetch admin stats",
        });
    }
};

module.exports = {
    getAdminStats,
};
