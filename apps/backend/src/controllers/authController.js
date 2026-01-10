const { prisma } = require("../configs/db");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/auth");

async function createUserController(req, res) {
    try {
        const { name, email, password } = req.body;

        if (req.userExists) {
            return res.status(409).json({
                ERROR: "Email already exists",
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return res.status(201).json({
            message: "✅ Registered successfully",
            user,
        });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ ERROR: "Register failed" });
    }
}

async function loginUserController(req, res) {
    try {
        if (!req.userExists) {
            return res.status(404).json({
                ERROR: "User not found",
            });
        }

        const user = req.existingUser;
        const { password } = req.body;

        if (!user.isActive) {
            return res.status(403).json({
                ERROR: "User account is inactive",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                ERROR: "Invalid credentials",
            });
        }

        const token = createToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        return res.status(200).json({
            message: "✅ Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ ERROR: "Login failed" });
    }
}

module.exports = {
    createUserController,
    loginUserController,
};
