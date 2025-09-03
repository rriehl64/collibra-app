const express = require('express');
const {
  getAssetLineage,
  createLineageRelationship,
  getAllLineage,
  updateLineageRelationship,
  deleteLineageRelationship,
  getLineageStats
} = require('../controllers/dataLineageController');

const router = express.Router();

// Apply auth middleware to all routes
const { protect } = require('../middleware/auth');
router.use(protect);

// Routes
router.route('/').get(getAllLineage).post(createLineageRelationship);
router.route('/stats').get(getLineageStats);
router.route('/:id').put(updateLineageRelationship).delete(deleteLineageRelationship);

module.exports = router;
