const express = require('express');
const {
  getPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy
} = require('../controllers/policies');

// Create router
const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getPolicies)
  .post(protect, authorize('admin', 'data-steward'), createPolicy);

router.route('/:id')
  .get(protect, getPolicy)
  .put(protect, authorize('admin', 'data-steward'), updatePolicy)
  .delete(protect, authorize('admin'), deletePolicy);

module.exports = router;
