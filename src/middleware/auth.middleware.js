const jwt = require("jsonwebtoken");

exports.verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });

        req.user = { userId: decoded.userId, role: decoded.role }; // Attach user data and role to request
        next();
    });
};