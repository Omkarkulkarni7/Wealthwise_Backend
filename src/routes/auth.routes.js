const express = require("express");
const { login, register } = require("../controllers/auth.controller");
const { refreshToken } = require("../controllers/refreshToken.controller");

const router = express.Router();

router.post("/login", login);
router.post("/register", register)
router.post("/refresh-token", refreshToken); // Add refresh token route

router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
    return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
