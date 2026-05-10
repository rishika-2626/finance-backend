const User = require("../models/User");
const Organization = require("../models/Organization");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role, organization) => {
  return jwt.sign({ id, role, organization }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// Register
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, organizationName } = req.body;

    if (!username || !email || !password || !organizationName) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create organization
  // 🔥 Check if org exists, else create
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