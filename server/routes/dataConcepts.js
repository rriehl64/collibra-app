/**
 * Data Concepts Routes
 * API routes for data concepts with authentication
 */

const express = require('express');
const router = express.Router();
const dataConceptController = require('../controllers/dataConceptController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes for /api/v1/data-concepts
router
  .route('/')
  .get(dataConceptController.getAllDataConcepts)
  .post(dataConceptController.createDataConcept);

// Routes for /api/v1/data-concepts/:id
router
  .route('/:id')
  .get(dataConceptController.getDataConcept)
  .put(dataConceptController.updateDataConcept)
  .delete(dataConceptController.deleteDataConcept);

// Routes for additional data concept resources
router.get('/statuses', dataConceptController.getDataConceptStatuses);
router.get('/domains', dataConceptController.getDataConceptDomains);

module.exports = router;
