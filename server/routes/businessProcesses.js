const express = require('express');
const businessProcessController = require('../controllers/businessProcessController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth protection to all routes
router.use(protect);

// Business process routes
router
  .route('/')
  .get(businessProcessController.getAllBusinessProcesses)
  .post(businessProcessController.createBusinessProcess);

router
  .route('/:id')
  .get(businessProcessController.getBusinessProcess)
  .put(businessProcessController.updateBusinessProcess)
  .delete(businessProcessController.deleteBusinessProcess);

// Get unique categories and owners for filtering
router.get('/categories', businessProcessController.getBusinessProcessCategories);
router.get('/owners', businessProcessController.getBusinessProcessOwners);

module.exports = router;
