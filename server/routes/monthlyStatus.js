const express = require('express');
const router = express.Router();

const {
  listMonthlyStatus,
  getMonthlyStatus,
  createMonthlyStatus,
  updateMonthlyStatus,
  deleteMonthlyStatus
} = require('../controllers/monthlyStatus');

const { protect, authorize } = require('../middleware/auth');

// Public read for now can be protected if needed
router.get('/', protect, listMonthlyStatus);
router.get('/:id', protect, getMonthlyStatus);

router.post('/', protect, createMonthlyStatus);
router.put('/:id', protect, updateMonthlyStatus);
router.delete('/:id', protect, authorize('admin'), deleteMonthlyStatus);

module.exports = router;
