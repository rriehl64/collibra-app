const express = require('express');
const {
  getTeamUtilizationMetrics,
  getTeamMemberDetails,
  getUtilizationByBranch,
  getCapacityForecast
} = require('../controllers/teamUtilizationController');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Team Utilization Routes
router.route('/metrics')
  .get(authorize('admin', 'data-steward'), getTeamUtilizationMetrics);

router.route('/members')
  .get(authorize('admin', 'data-steward'), getTeamMemberDetails);

router.route('/by-branch')
  .get(authorize('admin', 'data-steward'), getUtilizationByBranch);

router.route('/capacity-forecast')
  .get(authorize('admin', 'data-steward'), getCapacityForecast);

module.exports = router;
