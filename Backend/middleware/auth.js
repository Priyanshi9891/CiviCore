const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =====================
   AUTH PROTECTION
===================== */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ msg: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ msg: "Not authorized, token failed" });
  }
};

/* =====================
   ROLE CHECK
===================== */
const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Access denied. Role '${req.user.role}' not allowed`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  roleCheck
};