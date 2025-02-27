const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
// Import Sequelize User model
const User = require("../models/user.model");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } }); // Use Sequelize instead of pool.query
        if (!user) return res.status(400).json({ message: "User not found" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Exclude password from user object
        const { password: userPassword, ...userWithoutPassword } = user.toJSON();

        res.json({ message: "Login successful", accessToken, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 REGISTER (SIGNUP) LOGIC using Sequelize
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user using Sequelize
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Default role to 'user' if not provided
        });

        // Generate tokens
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        // Store refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Exclude password from user object
        const { password: userPassword, ...userWithoutPassword } = newUser.toJSON();

        res.status(201).json({ message: "User registered successfully", accessToken, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};