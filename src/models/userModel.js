const db = require('../config/database');


function findUserByEmail(email) {
  return db.prepare(`
    SELECT * FROM users WHERE email = ?
  `).get(email);
}


function findUserById(id) {
  return db.prepare(`
    SELECT id, name, email, role, is_active, created_at 
    FROM users 
    WHERE id = ?
  `).get(id);

}


function createUser(name, email, hashedPassword) {
  const result = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, 'viewer')
  `).run(name, email, hashedPassword);


  return result.lastInsertRowid;
}


function getAllUsers() {
  return db.prepare(`
    SELECT id, name, email, role, is_active, created_at 
    FROM users
    ORDER BY created_at DESC
  `).all();
}

function updateUserRole(id, role) {
  return db.prepare(`
    UPDATE users SET role = ? WHERE id = ?
  `).run(role, id);
}


function updateUserStatus(id, is_active) {
  return db.prepare(`
    UPDATE users SET is_active = ? WHERE id = ?
  `).run(is_active, id);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getAllUsers,
  updateUserRole,
  updateUserStatus
};