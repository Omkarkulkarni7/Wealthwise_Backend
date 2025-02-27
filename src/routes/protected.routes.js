const express = require("express");
const verifyAccessToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/dashboard", verifyAccessToken, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id}!` });
});

module.exports = router;
