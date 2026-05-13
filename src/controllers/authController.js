const User = require("../models/User");
const Organization = require("../models/Organization");
const jwt = require("jsonwebtoken");
const AuditLog = require("../models/AuditLog");

// Generate JWT
const generateToken = (id, role, organization) => {
  return jwt.sign({ id, role, organization }  /*this is what the token store */, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
  /* why store this?
  So later protected routes can know:

who user is
user role
user organization

without querying database repeatedly.
*/
};

// Register
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, organizationName } = req.body;

    if (!username || !email || !password || !organizationName) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });// to see if the user if unique or not we use email..
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create organization
  // Check if org exists, else create
let organization = await Organization.findOne({ name: organizationName });

if (!organization) { 
  organization = await Organization.create({
    name: organizationName
  });
}

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      organization: organization._id
    });

    await AuditLog.create({
  action: "User registered",
  user: user._id,
  targetUser: user._id,
  organization: user.organization
});

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      organization: user.organization,
      token: generateToken(user._id, user.role, user.organization)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ message: "User is inactive" });
    }

    if (await user.matchPassword(password)) {
      await AuditLog.create({
  action: "User logged in",
  user: user._id,
  targetUser: user._id,
  organization: user.organization
});
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        organization: user.organization,
        token: generateToken(user._id, user.role, user.organization)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };

/*
Registartion
Frontend form
      ↓
registerUser()
      ↓
Find/Create organization
      ↓
Create user
      ↓
Hash password automatically
      ↓
Generate JWT
      ↓
Send token
*/

/*
Login
Frontend login
      ↓
Find user
      ↓
Compare password
      ↓
Generate JWT
      ↓
Send token
 */

/*
Full flow usually

Frontend login form
        ↓
Backend verifies user
        ↓
Backend generates JWT
        ↓
Backend sends token to frontend
        ↓
Frontend stores token - localstorage and such
        ↓
Frontend sends token in future requests
        ↓
Backend verifies token
        ↓
Protected route access granted
 */