const express = require('express');
const {
  getPortfolios,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  updatePortfolioKPIs,
  updatePortfolioOKR,
  updatePortfolioRisks,
  updatePortfolioInnovations,
  updatePortfolioProjects,
  updatePortfolioMilestones,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject
} = require('../controllers/portfolios');

const router = express.Router();

// Portfolio CRUD routes
router.route('/')
  .get(getPortfolios)
  .post(createPortfolio);

router.route('/:id')
  .get(getPortfolio)
  .put(updatePortfolio)
  .delete(deletePortfolio);

// Portfolio component update routes
router.put('/:id/kpis', updatePortfolioKPIs);
router.put('/:id/okr', updatePortfolioOKR);
router.put('/:id/risks', updatePortfolioRisks);
router.put('/:id/innovations', updatePortfolioInnovations);
router.put('/:id/projects', updatePortfolioProjects);
router.put('/:id/milestones', updatePortfolioMilestones);

// Individual project management routes
router.route('/:id/projects')
  .post(addPortfolioProject);

router.route('/:id/projects/:projectId')
  .put(updatePortfolioProject)
  .delete(deletePortfolioProject);

module.exports = router;
