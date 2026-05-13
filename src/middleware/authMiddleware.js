const jwt = require("jsonwebtoken"); // to create and verify json web token
const User = require("../models/User"); // imports mongodb user model, needed to fetch user details from database

// Protect routes
const protect = async (req, res, next) => {
  
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user WITH organization
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" }); // possible case - token is valid but user was delete from the database
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token" });
  }
};

/*
summary of protect
Request comes
   ↓
Check token exists
   ↓
Verify token
   ↓
Get user from DB
   ↓
Attach user to req.user
   ↓
Allow access
*/

// Role-based access
const authorize = (...roles) => { //checks permission..
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { protect, authorize };