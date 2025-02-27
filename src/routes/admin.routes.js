const express = require("express");
const { verifyAccessToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Secure route only for admin users
router.get("/admin-dashboard", verifyAccessToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    res.json({ message: "Welcome, Admin!", userId: req.user.userId });
});

module.exports = router;
