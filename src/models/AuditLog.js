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
   targetUser: {
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

/*
Your backend is following a real multi-tenant architecture:

organizations separated
users tied to organizations
records tied to organizations
logs tied to organizations 

Organization
   ↓
Users
   ↓
Records
   ↓
Audit Logs

*/

/*
Organization → User
One organization can have MANY users.

Organization (1) ─────── (M) User
Organization → Record

One organization can have MANY records.
Organization (1) ─────── (M) Record

Organization → AuditLog
One organization can have MANY audit logs.

Organization (1) ─────── (M) AuditLog
User → Record

One user can create MANY records.
User (1) ─────── (M) Record

User → AuditLog
One user can perform MANY actions.

User (1) ─────── (M) AuditLog
Record → AuditLog

One record can appear in MANY audit logs.
Record (1) ─────── (M) AuditLog

 */

