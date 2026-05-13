const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      organization: req.user.organization
    }).select("-password"); // u only fetch users from the logged-in users organization

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;

    // ONLY USERS FROM SAME ORGANIZATION
    const user = await User.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Optional safety check
    // Prevent admin from modifying themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot modify yourself"
      });
    }

    if (role) {
      user.role = role;
    }

    if (status) {
      user.status = status;
    }

    await user.save();

    await AuditLog.create({
       action: `Updated user ${user.username}`,
       user: req.user._id,
       targetUser: user._id,
       organization: req.user.organization
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      organization: user.organization
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {

    // Find user from same organization
    const user = await User.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Prevent self-delete
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete yourself"
      });
    }

    // Delete user
    await user.deleteOne();

    // Create audit log
    await AuditLog.create({
      action: `Deleted user ${user.username}`,
      user: req.user._id,
      targetUser: user._id,
      organization: req.user.organization
    });

    res.json({
      message: "User deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser
};