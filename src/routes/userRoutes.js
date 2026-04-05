const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
  changeUserRole,
  changeUserStatus
} = require('../controllers/userController');

const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');




router.get('/', authenticate, authorize('admin'), getUsers);


router.get('/:id', authenticate, authorize('admin'), getUser);

router.patch('/:id/role', authenticate, authorize('admin'), changeUserRole);


router.patch('/:id/status', authenticate, authorize('admin'), changeUserStatus);

module.exports = router;