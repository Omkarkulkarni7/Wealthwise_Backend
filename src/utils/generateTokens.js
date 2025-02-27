const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(
        { userId: user.id, role: user.role }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { userId: user.id }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

module.exports = { generateAccessToken, generateRefreshToken };