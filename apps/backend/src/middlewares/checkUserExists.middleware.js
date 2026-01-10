const { prisma } = require("../configs/db");

async function checkUserExists(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            req.userExists = false;
            req.existingUser = null;
            return next();
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        req.userExists = Boolean(user);
        req.existingUser = user;

        next();
    } catch (error) {
        console.error("CHECK USER EXISTS ERROR:", error);
        return res.status(500).json({
            ERROR: "Internal server error",
        });
    }
}

module.exports = {
    checkUserExists,
};
