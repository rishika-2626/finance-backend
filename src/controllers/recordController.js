const Record = require("../models/Record");
const AuditLog = require("../models/AuditLog");


// Create Record (Admin + Analyst only)
const createRecord = async (req, res) => {
  try {
    // 🔐 RBAC CHECK
    if (!["admin", "analyst"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

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
      createdBy: req.user._id,
      organization: req.user.organization
    });

    // 🔥 AUDIT LOG
    await AuditLog.create({
      action: "CREATE",
      user: req.user._id,
      record: record._id,
      organization: req.user.organization
    });

    res.status(201).json(record);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Records (ALL roles allowed)
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 5, search } = req.query;

    let filter = {
      organization: req.user.organization // 🔥 STRICT ISOLATION
    };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

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
    // 🔐 RBAC CHECK
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update records" });
    }

    const record = await Record.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    Object.assign(record, req.body);

    await record.save();

    // 🔥 AUDIT LOG
    await AuditLog.create({
      action: "UPDATE",
      user: req.user._id,
      record: record._id,
      organization: req.user.organization
    });

    res.json(record);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Record (Admin only)
const deleteRecord = async (req, res) => {
  try {
    // 🔐 RBAC CHECK
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete records" });
    }

    const record = await Record.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    // 🔥 AUDIT LOG
    await AuditLog.create({
      action: "DELETE",
      user: req.user._id,
      record: req.params.id,
      organization: req.user.organization
    });

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