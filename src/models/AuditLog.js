const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  record: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Record"
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);