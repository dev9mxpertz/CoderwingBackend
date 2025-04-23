const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); 
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET); 

        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(401).json({ msg: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = authMiddleware;
