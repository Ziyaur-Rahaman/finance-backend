const db = require('../config/database');


function getAllRecords(filters = {}) {

  
  let query = `
    SELECT 
      r.id,
      r.amount,
      r.type,
      r.category,
      r.date,
      r.notes,
      r.created_at,
      u.name as created_by_name
    FROM financial_records r
    JOIN users u ON r.created_by = u.id
    WHERE 1=1
  `;

 

  const params = [];


  if (filters.type) {
    query += ` AND r.type = ?`;
    params.push(filters.type);
  }


  if (filters.category) {
    query += ` AND r.category = ?`;
    params.push(filters.category);
  }


  if (filters.start_date) {
    query += ` AND r.date >= ?`;
    params.push(filters.start_date);
  }

 
  if (filters.end_date) {
    query += ` AND r.date <= ?`;
    params.push(filters.end_date);
  }

 
  query += ` ORDER BY r.date DESC, r.created_at DESC`;

  return db.prepare(query).all(...params);
}


function getRecordById(id) {
  return db.prepare(`
    SELECT
      r.id,
      r.amount,
      r.type,
      r.category,
      r.date,
      r.notes,
      r.created_at,
      u.name as created_by_name
    FROM financial_records r
    JOIN users u ON r.created_by = u.id
    WHERE r.id = ?
  `).get(id);
}

function createRecord({ amount, type, category, date, notes, created_by }) {
  const result = db.prepare(`
    INSERT INTO financial_records 
      (amount, type, category, date, notes, created_by)
    VALUES 
      (?, ?, ?, ?, ?, ?)
  `).run(amount, type, category, date, notes || null, created_by);


  return getRecordById(result.lastInsertRowid);
}


function updateRecord(id, fields) {

  
  const allowedFields = ['amount', 'type', 'category', 'date', 'notes'];

  const setClauses = [];
  const params = [];

  for (const field of allowedFields) {
    if (fields[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      params.push(fields[field]);
    }
  }

 
  if (setClauses.length === 0) {
    return null;
  }

  
  params.push(id);

  db.prepare(`
    UPDATE financial_records
    SET ${setClauses.join(', ')}
    WHERE id = ?
  `).run(...params);


  return getRecordById(id);
}


function deleteRecord(id) {
  const result = db.prepare(`
    DELETE FROM financial_records WHERE id = ?
  `).run(id);


  return result.changes > 0;
}

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
};