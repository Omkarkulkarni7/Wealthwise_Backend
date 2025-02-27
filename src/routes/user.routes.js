const express = require("express");
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../middleware/auth.middleware");
const { User } = require("../models"); // Import the User model

const router = express.Router();

// Secure route for logged-in users (user or admin)
router.get("/user-dashboard", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ["name", "id", "role", "email"] // Include "email" attribute
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Welcome to your dashboard!", 
      userId: user.id, // Use "id" instead of "userId"
      role: user.role,
      name: user.name,
      email: user.email // Include email in the response
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected User Routes (Require Authentication)
router.get("/:id", verifyAccessToken, UserController.getUserById);
router.get("/", verifyAccessToken, UserController.getAllUsers);

module.exports = router;