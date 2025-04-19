// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");

const verifyToken = (req, res, next) => {
  // Retrieve the Authorization header 
  const authHeader = req.headers.authorization;

  // If no Authorization header is present, deny access
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided." });
  }

  // Extract the token part after "Bearer"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // If token verification fails, deny access
      return res.status(403).json({ message: "Failed to authenticate token." });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
