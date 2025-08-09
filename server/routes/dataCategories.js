const express = require('express');
const router = express.Router();
const dataCategoryController = require('../controllers/dataCategoryController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Base routes
router
  .route('/')
  .get(dataCategoryController.getAllDataCategories)
  .post(dataCategoryController.createDataCategory);

// Individual item routes
router
  .route('/:id')
  .get(dataCategoryController.getDataCategory)
  .put(dataCategoryController.updateDataCategory)
  .delete(dataCategoryController.deleteDataCategory);

// Get status options
router.get('/statuses', dataCategoryController.getDataCategoryStatuses);

// Get owner options
router.get('/owners', dataCategoryController.getDataCategoryOwners);

module.exports = router;
