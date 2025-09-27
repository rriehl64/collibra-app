const express = require('express');
const {
  getActiveProjectMetrics,
  getProjectBreakdown,
  getProjectsByDomain
} = require('../controllers/projectController');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Project Metrics Routes
router.route('/active-metrics')
  .get(authorize('admin', 'data-steward'), getActiveProjectMetrics);

router.route('/breakdown')
  .get(authorize('admin', 'data-steward'), getProjectBreakdown);

router.route('/by-domain')
  .get(authorize('admin', 'data-steward'), getProjectsByDomain);

module.exports = router;
