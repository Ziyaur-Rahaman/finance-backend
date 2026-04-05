const express = require('express');
const router = express.Router();

const {
  summary,
  categoryBreakdown,
  monthlyTrends,
  recentTransactions
} = require('../controllers/dashboardController');

const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');


const allRoles = authorize('viewer', 'analyst', 'admin');

router.get('/summary',            authenticate, allRoles, summary);
router.get('/category-breakdown', authenticate, allRoles, categoryBreakdown);
router.get('/monthly-trends',     authenticate, allRoles, monthlyTrends);
router.get('/recent',             authenticate, allRoles, recentTransactions);

module.exports = router;