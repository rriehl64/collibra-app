const express = require('express');
const router = express.Router();

const {
  listWeeklyStatus,
  getWeeklyStatus,
  createWeeklyStatus,
  updateWeeklyStatus,
  deleteWeeklyStatus,
  getSlaReport
} = require('../controllers/weeklyStatus');

const { protect, authorize } = require('../middleware/auth');

// Public read for now can be protected if needed
router.get('/', protect, listWeeklyStatus);
router.get('/sla', protect, authorize('admin'), getSlaReport);
router.get('/:id', protect, getWeeklyStatus);

router.post('/', protect, createWeeklyStatus);
router.put('/:id', protect, updateWeeklyStatus);
router.delete('/:id', protect, authorize('admin'), deleteWeeklyStatus);

module.exports = router;
