const Record = require("../models/Record");

// Summary
const calculateSummary = async () => {
  const records = await Record.find();

  let totalIncome = 0;
  let totalExpense = 0;

  records.forEach(r => {
    if (r.type === "income") totalIncome += r.amount;
    else totalExpense += r.amount;
  });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };
};

// Category Breakdown
const calculateCategoryBreakdown = async () => {
  const records = await Record.find();

  const categoryTotals = {};

  records.forEach(r => {
    if (!categoryTotals[r.category]) {
      categoryTotals[r.category] = 0;
    }
    categoryTotals[r.category] += r.amount;
  });

  return categoryTotals;
};

module.exports = {
  calculateSummary,
  calculateCategoryBreakdown
};