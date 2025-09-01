const express = require('express');
const {
  getDashboardMetrics,
  getRecentActivities,
  getSystemHealth
} = require('../controllers/dashboard');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Dashboard routes
router.get('/metrics', protect, getDashboardMetrics);
// Temporary unprotected endpoint for debugging
router.get('/test-metrics', (req, res, next) => {
  // Skip auth for this test endpoint
  req.user = { _id: 'test-user' }; // Mock user
  getDashboardMetrics(req, res, next);
});
router.get('/activities', protect, getRecentActivities);
router.get('/health', protect, getSystemHealth);

module.exports = router;
