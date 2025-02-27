const jwt = require("jsonwebtoken");

exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

        const newAccessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // 1 hour
        );

        res.json({ accessToken: newAccessToken });
    });
};
