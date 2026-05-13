const Record = require("../models/Record");
const AuditLog = require("../models/AuditLog");


// Create Record (Admin + Analyst only)
const createRecord = async (req, res) => {
  try {

    // RBAC CHECK
    if (!["admin", "analyst"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    const { amount, type, category, date, notes } = req.body;

    // Better validation
    if (
      amount === undefined ||
      !type ||
      !category
    ) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    // Validate type
    const allowedTypes = ["income", "expense"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid record type"
      });
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

    // AUDIT LOG
    await AuditLog.create({
      action: `Created ${type} record`,
      user: req.user._id,
      record: record._id,
      organization: req.user.organization
    });

    res.status(201).json(record);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get Records (ALL roles allowed)
const getRecords = async (req, res) => {
  try {

    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 5,
      search
    } = req.query;

    // STRICT ORGANIZATION ISOLATION
    let filter = {
      organization: req.user.organization
    };

    // Filter by type
    if (type) {
      filter.type = type;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by date range
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Search category + notes
    if (search) {
      filter.$or = [
        {
          category: {
            $regex: search,
            $options: "i"
          }
        },
        {
          notes: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    // Pagination
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const skip = (pageNumber - 1) * pageSize;

    // Total records
    const totalRecords = await Record.countDocuments(filter);

    // Fetch records
    const records = await Record.find(filter)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.json({
      page: pageNumber,
      limit: pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      data: records
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Record (Admin only)
const updateRecord = async (req, res) => {
  try {

    // RBAC CHECK
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update records"
      });
    }

    // Find record within same organization
    const record = await Record.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!record) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    // Allowed fields only
    const allowedUpdates = [
      "amount",
      "type",
      "category",
      "date",
      "notes"
    ];

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        record[key] = req.body[key];
      }
    }

    // Validate type if updated
    if (
      record.type &&
      !["income", "expense"].includes(record.type)
    ) {
      return res.status(400).json({
        message: "Invalid record type"
      });
    }

    await record.save();

    // AUDIT LOG
    await AuditLog.create({
      action: `Updated ${record.type} record`,
      user: req.user._id,
      record: record._id,
      organization: req.user.organization
    });

    res.json(record);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Delete Record (Admin only)
const deleteRecord = async (req, res) => {
  try {

    // RBAC CHECK
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete records"
      });
    }

    // Find record within same organization
    const record = await Record.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!record) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    // Delete record
    await record.deleteOne();

    // AUDIT LOG
    await AuditLog.create({
      action: `Deleted ${record.type} record`,
      user: req.user._id,
      record: record._id,
      organization: req.user.organization
    });

    res.json({
      message: "Record deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};