const bcrypt = require('bcryptjs');
const db = require('./database');

function seedAdmin() {

  
  const existingAdmin = db.prepare(`
    SELECT id FROM users WHERE role = 'admin' LIMIT 1
  `).get();

  if (existingAdmin) {
    console.log('✅ Admin already exists, skipping seed');
    return;
  }

  const hashedPassword = bcrypt.hashSync('admin123', 10);

  //  first admin user
  db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run('Super Admin', 'admin@company.com', hashedPassword, 'admin');

  console.log('✅ Default admin created');
  console.log('   Email: admin@company.com');
  console.log('   Password: admin123');
}

module.exports = seedAdmin;