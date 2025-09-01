const express = require('express');
const {
  getProjectTimeline,
  getProjectTimelineRecord,
  createProjectTimelineRecord,
  updateProjectTimelineRecord,
  deleteProjectTimelineRecord,
  getProjectTimelineStats,
  bulkUpdateProjectTimeline
} = require('../controllers/projectTimelineController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(getProjectTimeline)  // Allow unauthenticated GET for timeline data
  .post(protect, createProjectTimelineRecord);  // Require auth for POST

router
  .route('/stats')
  .get(getProjectTimelineStats);

router
  .route('/bulk')
  .put(protect, bulkUpdateProjectTimeline);

router
  .route('/:id')
  .get(getProjectTimelineRecord)
  .put(updateProjectTimelineRecord)  // Allow unauthenticated PUT for demo purposes
  .delete(protect, deleteProjectTimelineRecord);

module.exports = router;
