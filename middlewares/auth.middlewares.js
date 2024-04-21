const jwt = require("jsonwebtoken");

module.exports.checkAuth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const secret = process.env.JWT_SECRET || "secretKey";

  if (!secret) {
    return res
      .status(500)
      .json({ message: "Internal server error: JWT Secret is not defined" });
  }

  try {
    const decoded = await jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
