const express = require('express');
const {
  getMenuSettings,
  getEnabledMenuItems,
  toggleMenuItem,
  updateMenuItem,
  initializeMenuItems,
  bulkToggleMenuItems
} = require('../controllers/menuSettingsController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/enabled', getEnabledMenuItems);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getMenuSettings);

router.post('/initialize', initializeMenuItems);
router.patch('/bulk-toggle', bulkToggleMenuItems);

router.route('/:id')
  .put(updateMenuItem);

router.patch('/:id/toggle', toggleMenuItem);

module.exports = router;
