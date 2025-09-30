const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader || !authHeader.startsWith("Bearer ") || !token) {
    return res.status(401).json({ message: "Unauthorized. No token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    console.error("Token error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;