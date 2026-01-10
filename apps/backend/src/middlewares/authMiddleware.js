function createUserMiddleware(req, res, next) {
    let { name, email, password, confirm_password } = req.body;

    if (!name || !email || !password || !confirm_password) {
        return res.status(400).json({ ERROR: "All fields are required" });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ERROR: "Invalid email format" });
    }

    if (password !== confirm_password) {
        return res.status(400).json({
            ERROR: "Password and Confirm Password do not match",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            ERROR: "Password must be at least 8 characters long",
        });
    }

    req.body = { name, email, password };
    next();
}


function loginUserMiddleware(req, res, next) {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            ERROR: "Email and Password are required",
        });
    }

    email = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ERROR: "Invalid email format" });
    }

    req.body = { email, password };
    next();
}


module.exports = {
    createUserMiddleware,
    loginUserMiddleware,
};
