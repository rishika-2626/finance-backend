const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true //removes extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["viewer", "analyst", "admin"],
    default: "viewer"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  // NEW FIELD (IMPORTANT)
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", //Your User model stores an Organization document’s ID, and ref: "Organization" tells Mongoose which model that ID belongs to.
    required: true
  }

}, { timestamps: true });


// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);