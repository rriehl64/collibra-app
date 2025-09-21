const express = require('express');
const {
  getPriorities,
  getPriority,
  createPriority,
  updatePriority,
  deletePriority,
  getTeamCapacity,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  getEpics,
  createEpic,
  updateEpic,
  deleteEpic,
  getIntakeTemplate,
  bulkUpdatePriorities,
  getDashboardAnalytics
} = require('../controllers/dataStrategyPlanningController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes for testing (remove in production)
router.get('/priorities', getPriorities);
router.get('/team/capacity', getTeamCapacity);
router.get('/team/members', getTeamMembers);
router.get('/epics', getEpics);
router.get('/analytics', getDashboardAnalytics);

// Protected routes
router.post('/priorities', protect, authorize('admin', 'data-steward'), createPriority);
router.put('/priorities/bulk', protect, authorize('admin', 'data-steward'), bulkUpdatePriorities);
router.get('/priorities/:id', protect, authorize('admin', 'data-steward'), getPriority);
router.put('/priorities/:id', protect, authorize('admin', 'data-steward'), updatePriority);
router.delete('/priorities/:id', protect, authorize('admin'), deletePriority);

// Moved to public routes above
router.post('/team/members', protect, authorize('admin', 'data-steward'), createTeamMember);
router.put('/team/members/:id', protect, authorize('admin', 'data-steward'), updateTeamMember);

router.post('/epics', protect, authorize('admin', 'data-steward'), createEpic);
router.put('/epics/:id', protect, authorize('admin', 'data-steward'), updateEpic);
router.delete('/epics/:id', protect, authorize('admin'), deleteEpic);

router.get('/intake-template', protect, authorize('admin', 'data-steward'), getIntakeTemplate);

module.exports = router;
