const {
  calculateSummary,
  calculateCategoryBreakdown,
  calculateMonthlyTrends,
  getRecentRecords
} = require("../services/dashboardServices");

// GET /dashboard/summary
const getSummary = async (req, res) => {
  try {
    const summary = await calculateSummary(req.user.organization);

    res.json(summary);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET /dashboard/categories
const getCategoryBreakdown = async (req, res) => {
  try {
    const breakdown = await calculateCategoryBreakdown(
      req.user.organization
    );

    res.json(breakdown);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET /dashboard/trends
const getMonthlyTrends = async (req, res) => {
  try {
    const trends = await calculateMonthlyTrends(
      req.user.organization
    );

    res.json(trends);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET /dashboard/recent
const getRecentActivity = async (req, res) => {
  try {
    const records = await getRecentRecords(
      req.user.organization
    );

    res.json(records);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
};