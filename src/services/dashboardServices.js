const Record = require("../models/Record");

// Summary
const calculateSummary = async (organizationId) => {
  const records = await Record.find({
    organization: organizationId
  });

  let totalIncome = 0;
  let totalExpense = 0;

  records.forEach((r) => {
    if (r.type === "income") {
      totalIncome += r.amount;
    } else {
      totalExpense += r.amount;
    }
  });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };
};

// Category Breakdown
const calculateCategoryBreakdown = async (organizationId) => {
  const records = await Record.find({
    organization: organizationId
  });

  const categoryTotals = {};

  records.forEach((r) => {
    if (!categoryTotals[r.category]) {
      categoryTotals[r.category] = 0;
    }

    categoryTotals[r.category] += r.amount;
  });

  return categoryTotals;
};

// Monthly Trends
const calculateMonthlyTrends = async (organizationId) => {
  const records = await Record.find({
    organization: organizationId
  });

  const monthlyData = {};

  records.forEach((r) => {
    const month = new Date(r.date).toLocaleString("default", {
      month: "short"
    });

    if (!monthlyData[month]) {
      monthlyData[month] = {
        income: 0,
        expense: 0
      };
    }

    if (r.type === "income") {
      monthlyData[month].income += r.amount;
    } else {
      monthlyData[month].expense += r.amount;
    }
  });

  return monthlyData;
};

// Recent Activity
const getRecentRecords = async (organizationId) => {
  return await Record.find({
    organization: organizationId
  })
    .sort({ createdAt: -1 })
    .limit(5);
};

module.exports = {
  calculateSummary,
  calculateCategoryBreakdown,
  calculateMonthlyTrends,
  getRecentRecords
};