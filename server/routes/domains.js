const express = require('express');
const router = express.Router();
const {
  getDomains,
  getDomain,
  createDomain,
  updateDomain,
  deleteDomain
} = require('../controllers/domains');
const { protect } = require('../middleware/auth');

// Test endpoints without auth for development
router.get('/test', getDomains);
router.put('/test/:id', updateDomain);

// Apply auth middleware to all other routes
router.use(protect);

// Routes for /api/v1/domains
router
  .route('/')
  .get(getDomains)
  .post(createDomain);

router
  .route('/:id')
  .get(getDomain)
  .put(updateDomain)
  .delete(deleteDomain);

module.exports = router;
