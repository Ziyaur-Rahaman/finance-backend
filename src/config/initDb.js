const db = require('./database');


function initializeDatabase() {

  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      password    TEXT NOT NULL,
      role        TEXT NOT NULL DEFAULT 'viewer' CHECK(role IN ('viewer', 'analyst', 'admin')),
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ─────────────────────────────────────────
  // FINANCIAL RECORDS TABLE
  // ─────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS financial_records (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      amount      REAL NOT NULL CHECK(amount > 0),
      type        TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category    TEXT NOT NULL,
      date        TEXT NOT NULL,
      notes       TEXT,
      created_by  INTEGER NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),

      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  console.log('✅ Database tables ready');
}

module.exports = initializeDatabase;