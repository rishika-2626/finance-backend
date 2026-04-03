const express = require("express");
const router = express.Router();

const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require("../controllers/recordController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin only
router.post("/", protect, authorize("admin"), createRecord);
router.put("/:id", protect, authorize("admin"), updateRecord);
router.delete("/:id", protect, authorize("admin"), deleteRecord);

// Analyst + Admin
router.get("/", protect, authorize("admin", "analyst"), getRecords);

module.exports = router;