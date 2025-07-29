const express = require('express');
const {
  getDashboardMetrics,
  getRecentActivities,
  getSystemHealth
} = require('../controllers/dashboard');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// All dashboard routes are protected
router.use(protect);

// Dashboard routes
router.get('/metrics', getDashboardMetrics);
router.get('/activities', getRecentActivities);
router.get('/health', getSystemHealth);

module.exports = router;
