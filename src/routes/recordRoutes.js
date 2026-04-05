const express = require('express');
const router = express.Router();

const {
  getRecords,
  getRecord,
  addRecord,
  editRecord,
  removeRecord
} = require('../controllers/recordController');

const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get(
  '/',
  authenticate,
  authorize('viewer', 'analyst', 'admin'),
  getRecords
);


router.get(
  '/:id',
  authenticate,
  authorize('viewer', 'analyst', 'admin'),
  getRecord
);


router.post(
  '/',
  authenticate,
  authorize('analyst', 'admin'),
  addRecord
);


router.patch(
  '/:id',
  authenticate,
  authorize('analyst', 'admin'),
  editRecord
);


router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  removeRecord
);

module.exports = router;