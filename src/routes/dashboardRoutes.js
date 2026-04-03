const express = require("express");
const router = express.Router();

const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
} = require("../controllers/dashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Analyst + Admin access
router.get("/summary", protect, authorize("admin", "analyst"), getSummary);
router.get("/categories", protect, authorize("admin", "analyst"), getCategoryBreakdown);
router.get("/trends", protect, authorize("admin", "analyst"), getMonthlyTrends);
router.get("/recent", protect, authorize("admin", "analyst"), getRecentActivity);

module.exports = router;