const Record = require("../models/Record");

// GET /dashboard/summary
const getSummary = async (req, res) => {
  try {
    const records = await Record.find();

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach(r => {
      if (r.type === "income") totalIncome += r.amount;
      else totalExpense += r.amount;
    });

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /dashboard/categories
const getCategoryBreakdown = async (req, res) => {
  try {
    const records = await Record.find();

    const categoryTotals = {};

    records.forEach(r => {
      if (!categoryTotals[r.category]) {
        categoryTotals[r.category] = 0;
      }
      categoryTotals[r.category] += r.amount;
    });

    res.json(categoryTotals);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /dashboard/trends
const getMonthlyTrends = async (req, res) => {
  try {
    const records = await Record.find();

    const monthlyData = {};

    records.forEach(r => {
      const month = new Date(r.date).toLocaleString("default", { month: "short" });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (r.type === "income") {
        monthlyData[month].income += r.amount;
      } else {
        monthlyData[month].expense += r.amount;
      }
    });

    res.json(monthlyData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /dashboard/recent
const getRecentActivity = async (req, res) => {
  try {
    const records = await Record.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
};