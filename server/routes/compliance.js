const express = require('express');
const {
  getComplianceMetrics,
  getPolicyDetails,
  getComplianceFrameworks,
  getAuditHistory,
  getRiskAssessment
} = require('../controllers/complianceController');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Compliance Routes
router.route('/metrics')
  .get(authorize('admin', 'data-steward'), getComplianceMetrics);

router.route('/policies')
  .get(authorize('admin', 'data-steward'), getPolicyDetails);

router.route('/frameworks')
  .get(authorize('admin', 'data-steward'), getComplianceFrameworks);

router.route('/audit-history')
  .get(authorize('admin', 'data-steward'), getAuditHistory);

router.route('/risk-assessment')
  .get(authorize('admin', 'data-steward'), getRiskAssessment);

module.exports = router;
