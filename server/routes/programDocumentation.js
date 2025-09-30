const express = require('express');
const {
  getProgramDocumentation,
  getPortfolioDocumentation,
  createProgramDocumentation,
  updateProgramDocumentation,
  updateDocumentationSection,
  deleteProgramDocumentation
} = require('../controllers/programDocumentation');

const router = express.Router();

// Routes
router.route('/')
  .post(createProgramDocumentation);

router.route('/:projectId')
  .get(getProgramDocumentation)
  .put(updateProgramDocumentation)
  .delete(deleteProgramDocumentation);

router.route('/:projectId/section/:sectionId')
  .put(updateDocumentationSection);

router.route('/portfolio/:portfolioId')
  .get(getPortfolioDocumentation);

module.exports = router;
