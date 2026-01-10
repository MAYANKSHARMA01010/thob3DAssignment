const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET not set");

function createToken(payload) {
    return jwt.sign(payload, SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

async function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ ERROR: "No token provided" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            ERROR:
                err.name === "TokenExpiredError"
                    ? "Token expired"
                    : "Invalid or expired token",
        });
    }
}

module.exports = {
    createToken,
    verifyToken,
    authenticate,
};