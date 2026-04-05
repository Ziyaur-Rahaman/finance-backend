require('dotenv').config();

const express = require('express');
const app = express();

const initializeDatabase = require('./src/config/initDb');
const seedAdmin = require('./src/config/seed');

const authRoutes      = require('./src/routes/authRoutes');
const userRoutes      = require('./src/routes/userRoutes');
const recordRoutes    = require('./src/routes/recordRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

app.use(express.json());

initializeDatabase();
seedAdmin();

app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/records',   recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Finance Backend is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});