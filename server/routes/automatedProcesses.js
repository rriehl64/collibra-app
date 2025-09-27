const express = require('express');
const {
  getAutomatedProcesses,
  getAutomatedProcess,
  createAutomatedProcess,
  updateAutomatedProcess,
  deleteAutomatedProcess,
  executeAutomatedProcess,
  getExecutionHistory,
  getDashboardAnalytics,
  toggleProcessStatus,
  updateProcessSchedule,
  getScheduledProcesses,
  getScheduleCalendar,
  validateCronExpression
} = require('../controllers/automatedProcesses');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Apply authorization middleware (admin and data-steward only)
router.use(authorize('admin', 'data-steward'));

// Dashboard analytics route (must be before /:id routes)
router.get('/analytics/dashboard', getDashboardAnalytics);

// Scheduling routes (must be before /:id routes)
router.get('/scheduled', getScheduledProcesses);
router.get('/schedule/calendar', getScheduleCalendar);
router.post('/schedule/validate-cron', validateCronExpression);

// Main CRUD routes
router
  .route('/')
  .get(getAutomatedProcesses)
  .post(createAutomatedProcess);

router
  .route('/:id')
  .get(getAutomatedProcess)
  .put(updateAutomatedProcess)
  .delete(authorize('admin'), deleteAutomatedProcess); // Only admins can delete

// Process execution routes
router.post('/:id/execute', executeAutomatedProcess);
router.get('/:id/executions', getExecutionHistory);

// Process management routes
router.patch('/:id/toggle-status', toggleProcessStatus);
router.patch('/:id/schedule', updateProcessSchedule);

module.exports = router;
