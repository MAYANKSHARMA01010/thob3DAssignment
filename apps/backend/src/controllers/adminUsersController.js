const { prisma } = require("../configs/db");

const getAllUsersForAdmin = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ ERROR: "Admin access only" });
        }

        const users = await prisma.user.findMany({
            where: { role: "USER" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                orders: {
                    select: {
                        totalAmount: true,
                    },
                },
            },
        });

        const formattedUsers = users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
            totalOrders: u.orders.length,
            totalSpent: u.orders.reduce(
                (sum, o) => sum + Number(o.totalAmount),
                0
            ),
        }));

        return res.json({ users: formattedUsers });
    } catch (error) {
        console.error("Admin get users error:", error);
        return res.status(500).json({
            ERROR: "Failed to fetch users",
        });
    }
};

module.exports = {
    getAllUsersForAdmin,
};
