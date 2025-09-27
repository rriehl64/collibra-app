const express = require('express');
const {
  getDataQualityMetrics,
  getAssetQualityBreakdown,
  getDomainQualityScores
} = require('../controllers/dataQualityController');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Data Quality Metrics Routes
router.route('/metrics')
  .get(authorize('admin', 'data-steward'), getDataQualityMetrics);

router.route('/assets-breakdown')
  .get(authorize('admin', 'data-steward'), getAssetQualityBreakdown);

router.route('/domain-scores')
  .get(authorize('admin', 'data-steward'), getDomainQualityScores);

module.exports = router;
