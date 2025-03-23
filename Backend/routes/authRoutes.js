const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied, token missing" });
    }

    try {
        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) { 
        res.status(400).json({ error: "Invalid token" });
    }
};




// Middleware for authorization
const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: Access Denied" });
    }
    next();
};

// User registration route
router.post("/register", async (req, res) => {
    try {
        const { username, password, role = "user" } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User login route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.role,user:user.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export router and middleware correctly
module.exports = router;
module.exports.authenticate = authenticate;
module.exports.authorize = authorize;
