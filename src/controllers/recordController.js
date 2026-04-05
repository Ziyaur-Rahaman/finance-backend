const {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../models/recordModel');

const { successResponse, errorResponse } = require('../utils/response');

// ─────────────────────────────────────────
// GET ALL RECORDS
// GET /api/records
// Supports filters: ?type=income&category=Food&start_date=2026-01-01
// All roles
// ─────────────────────────────────────────
function getRecords(req, res) {
  try {
    // Query params come from the URL
    // e.g. /api/records?type=income&category=Salary
    const { type, category, start_date, end_date } = req.query;

    // Validate type if provided
    if (type && !['income', 'expense'].includes(type)) {
      return errorResponse(res, 'Type must be income or expense', 400);
    }

    // Validate date format if provided (must be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (start_date && !dateRegex.test(start_date)) {
      return errorResponse(res, 'start_date must be in YYYY-MM-DD format', 400);
    }
    if (end_date && !dateRegex.test(end_date)) {
      return errorResponse(res, 'end_date must be in YYYY-MM-DD format', 400);
    }

    // Pass filters to model
    const records = getAllRecords({ type, category, start_date, end_date });

    return successResponse(res, {
      count: records.length,
      records
    });

  } catch (error) {
    console.error('Get records error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

// ─────────────────────────────────────────
// GET SINGLE RECORD
// GET /api/records/:id
// All roles
// ─────────────────────────────────────────
function getRecord(req, res) {
  try {
    const recordId = parseInt(req.params.id);

    if (isNaN(recordId)) {
      return errorResponse(res, 'Invalid record ID', 400);
    }

    const record = getRecordById(recordId);

    if (!record) {
      return errorResponse(res, 'Record not found', 404);
    }

    return successResponse(res, { record });

  } catch (error) {
    console.error('Get record error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

// ─────────────────────────────────────────
// CREATE RECORD
// POST /api/records
// Analyst and Admin only
// ─────────────────────────────────────────
function addRecord(req, res) {
  try {
    const { amount, type, category, date, notes } = req.body;

    // ── Validation ──────────────────────────

    // Check required fields
    if (!amount || !type || !category || !date) {
      return errorResponse(
        res,
        'Amount, type, category and date are required',
        400
      );
    }

    // Amount must be a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return errorResponse(res, 'Amount must be a positive number', 400);
    }

    // Type must be income or expense
    if (!['income', 'expense'].includes(type)) {
      return errorResponse(res, 'Type must be income or expense', 400);
    }

    // Date format validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return errorResponse(res, 'Date must be in YYYY-MM-DD format', 400);
    }

    // ── Create record ────────────────────────

    // req.user.id comes from the auth middleware
    // This is how we know WHO created this record
    const record = createRecord({
      amount,
      type,
      category,
      date,
      notes,
      created_by: req.user.id
    });

    return successResponse(res, {
      message: 'Record created successfully',
      record
    }, 201);

  } catch (error) {
    console.error('Create record error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

// ─────────────────────────────────────────
// UPDATE RECORD
// PATCH /api/records/:id
// Analyst and Admin only
// ─────────────────────────────────────────
function editRecord(req, res) {
  try {
    const recordId = parseInt(req.params.id);

    if (isNaN(recordId)) {
      return errorResponse(res, 'Invalid record ID', 400);
    }

    // Check if record exists
    const existing = getRecordById(recordId);
    if (!existing) {
      return errorResponse(res, 'Record not found', 404);
    }

    const { amount, type, category, date, notes } = req.body;

    // Validate fields only if they are provided
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return errorResponse(res, 'Amount must be a positive number', 400);
      }
    }

    if (type !== undefined) {
      if (!['income', 'expense'].includes(type)) {
        return errorResponse(res, 'Type must be income or expense', 400);
      }
    }

    if (date !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return errorResponse(res, 'Date must be in YYYY-MM-DD format', 400);
      }
    }

    // Update only provided fields
    const updated = updateRecord(recordId, { amount, type, category, date, notes });

    if (!updated) {
      return errorResponse(res, 'No valid fields provided to update', 400);
    }

    return successResponse(res, {
      message: 'Record updated successfully',
      record: updated
    });

  } catch (error) {
    console.error('Update record error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

// ─────────────────────────────────────────
// DELETE RECORD
// DELETE /api/records/:id
// Admin only
// ─────────────────────────────────────────
function removeRecord(req, res) {
  try {
    const recordId = parseInt(req.params.id);

    if (isNaN(recordId)) {
      return errorResponse(res, 'Invalid record ID', 400);
    }

    // Check if record exists first
    const existing = getRecordById(recordId);
    if (!existing) {
      return errorResponse(res, 'Record not found', 404);
    }

    const deleted = deleteRecord(recordId);

    if (!deleted) {
      return errorResponse(res, 'Failed to delete record', 500);
    }

    return successResponse(res, {
      message: 'Record deleted successfully',
      recordId
    });

  } catch (error) {
    console.error('Delete record error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

module.exports = {
  getRecords,
  getRecord,
  addRecord,
  editRecord,
  removeRecord
};