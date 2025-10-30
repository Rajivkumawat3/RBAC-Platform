
const jwt = require('jsonwebtoken');
const User  = require('../model/User');
const SECRET = process.env.JWT_SECRET || 'DEV_SECRET';


const isAuthenticatedUser = async (req, res, next) => {
  try {

    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Please login to access this resource" });
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    const user = await User.findByPk(decodedData.id);
    if (!user) {
      return res.status(401).json({ error: "User not found or invalid token" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};



const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: `Access denied. Role "${req.user.role}" cannot access this resource.`,
        });
      }

      next();
    } catch (err) {
      console.error('authorizeRoles error:', err);
      res.status(500).json({ error: 'Internal server error during role check' });
    }
  };
};


module.exports = {
  isAuthenticatedUser,
  authorizeRoles,
  SECRET
};
