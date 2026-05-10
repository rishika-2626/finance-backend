const User = require("../models/User");

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      organization: req.user.organization
    }).select("-password");

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

    // 🔐 ONLY USERS FROM SAME ORGANIZATION
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
    // if (user._id.toString() === req.user._id.toString()) {
    //   return res.status(400).json({
    //     message: "You cannot modify yourself"
    //   });
    // }

    if (role) {
      user.role = role;
    }

    if (status) {
      user.status = status;
    }

    await user.save();

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
    // 🔐 ONLY DELETE USERS FROM SAME ORGANIZATION
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Optional safety check
    // Prevent self-delete
    // if (user._id.toString() === req.user._id.toString()) {
    //   return res.status(400).json({
    //     message: "You cannot delete yourself"
    //   });
    // }

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