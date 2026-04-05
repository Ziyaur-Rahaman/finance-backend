const db = require('../config/database');


function getSummary() {


  const result = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COUNT(*) AS total_records
    FROM financial_records
  `).get();


  result.net_balance = result.total_income - result.total_expenses;

  return result;
}


function getCategoryBreakdown() {


  return db.prepare(`
    SELECT
      category,
      type,
      COALESCE(SUM(amount), 0)  AS total,
      COUNT(*)                   AS count
    FROM financial_records
    GROUP BY category, type
    ORDER BY total DESC
  `).all();
}


function getMonthlyTrends() {

 
  return db.prepare(`
    SELECT
      strftime('%Y-%m', date)                                               AS month,
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0)  AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)  AS expenses,
      COUNT(*)                                                               AS total_records
    FROM financial_records
    GROUP BY strftime('%Y-%m', date)
    ORDER BY month ASC
  `).all();
}

function getRecentTransactions(limit = 10) {
  return db.prepare(`
    SELECT
      r.id,
      r.amount,
      r.type,
      r.category,
      r.date,
      r.notes,
      r.created_at,
      u.name AS created_by_name
    FROM financial_records r
    JOIN users u ON r.created_by = u.id
    ORDER BY r.date DESC, r.created_at DESC
    LIMIT ?
  `).all(limit);
}

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentTransactions
};