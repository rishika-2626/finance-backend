const Record = require("../models/Record");

// Summary
const calculateSummary = async (organizationId) => {

  const records = await Record.find({
    organization: organizationId
  }).lean();

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
  }).lean();

  const categoryTotals = {};

  records.forEach((r) => {

    if (!categoryTotals[r.category]) {
      categoryTotals[r.category] = {
        income: 0,
        expense: 0,
        total: 0
      };
    }

    // Separate income + expense
    if (r.type === "income") {
      categoryTotals[r.category].income += r.amount;
    } else {
      categoryTotals[r.category].expense += r.amount;
    }

    // Overall total
    categoryTotals[r.category].total += r.amount;

  });

  return categoryTotals;
};


// Monthly Trends
const calculateMonthlyTrends = async (organizationId) => {

  const records = await Record.find({
    organization: organizationId
  }).lean();

  // Month order map
  const monthOrder = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };

  const monthlyData = {};

  records.forEach((r) => {

    const month = new Date(r.date).toLocaleString(
      "default",
      { month: "short" }
    );

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

  // Proper month sorting
  const sortedMonths = Object.keys(monthlyData)
    .sort((a, b) => monthOrder[a] - monthOrder[b]);

  const sortedMonthlyData = {};

  sortedMonths.forEach((month) => {
    sortedMonthlyData[month] = monthlyData[month];
  });

  return sortedMonthlyData;
};


// Recent Activity
const getRecentRecords = async (organizationId) => {

  return await Record.find({
    organization: organizationId
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("createdBy", "username email")
    .lean();

};


module.exports = {
  calculateSummary,
  calculateCategoryBreakdown,
  calculateMonthlyTrends,
  getRecentRecords
};