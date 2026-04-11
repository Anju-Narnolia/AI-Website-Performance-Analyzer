const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Auth check - Authorization header:", authHeader ? "Present" : "Missing");
  
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.warn("⚠️  No token found in Authorization header");
    console.log("Headers received:", Object.keys(req.headers));
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    console.log("🔍 Verifying token...");
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );
    req.userId = decoded.userId;
    console.log("✅ Token verified. UserId:", req.userId);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authMiddleware;