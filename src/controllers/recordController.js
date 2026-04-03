const Record = require("../models/Record");


// Create Record (Admin only)
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json(record);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Records (Analyst + Admin)
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 5 } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (req.query.search) {
  filter.$or = [
    { category: { $regex: req.query.search, $options: "i" } },
    { notes: { $regex: req.query.search, $options: "i" } }
  ];
}

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Total count (for frontend info)
    const totalRecords = await Record.countDocuments(filter);

    const records = await Record.find(filter)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      page: pageNumber,
      limit: pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      data: records
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Record (Admin only)
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    Object.assign(record, req.body);

    await record.save();

    res.json(record);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Record (Admin only)
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};