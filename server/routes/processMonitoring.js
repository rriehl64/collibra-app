const express = require('express');
const {
  getProcessMonitors,
  getProcessMonitor,
  createProcessMonitor,
  updateProcessMonitor,
  deleteProcessMonitor,
  getMonitoringDashboard,
  addPerformanceData,
  triggerAlert,
  acknowledgeAlert,
  resolveAlert,
  getAlertHistory,
  updateSLATargets
} = require('../controllers/processMonitoring');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Apply authorization - only admin and data-steward roles can access
router.use(authorize('admin', 'data-steward'));

// Main CRUD routes
router
  .route('/')
  .get(getProcessMonitors)
  .post(createProcessMonitor);

router
  .route('/:id')
  .get(getProcessMonitor)
  .put(updateProcessMonitor)
  .delete(authorize('admin'), deleteProcessMonitor); // Only admin can delete

// Analytics and dashboard routes
router
  .route('/analytics/dashboard')
  .get(getMonitoringDashboard);

// Performance data routes
router
  .route('/:id/performance')
  .post(addPerformanceData);

// Alert management routes
router
  .route('/:id/alerts')
  .post(triggerAlert);

router
  .route('/:id/alerts/history')
  .get(getAlertHistory);

router
  .route('/:id/alerts/:alertId/acknowledge')
  .patch(acknowledgeAlert);

router
  .route('/:id/alerts/:alertId/resolve')
  .patch(resolveAlert);

// SLA management routes
router
  .route('/:id/sla')
  .patch(updateSLATargets);

module.exports = router;
