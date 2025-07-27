const express = require('express');
const {
  getDataAssets,
  getDataAsset,
  createDataAsset,
  updateDataAsset,
  deleteDataAsset
} = require('../controllers/dataAssets');

// Create router
const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getDataAssets)
  .post(protect, authorize('admin', 'data-steward'), createDataAsset);

router.route('/:id')
  .get(getDataAsset)
  .put(protect, authorize('admin', 'data-steward'), updateDataAsset)
  .delete(protect, authorize('admin'), deleteDataAsset);

module.exports = router;
