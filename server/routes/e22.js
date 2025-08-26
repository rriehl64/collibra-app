const express = require('express');
const { 
  getE22Overview,
  updateE22Overview,
  createE22Overview
} = require('../controllers/e22OverviewController');

const {
  getAllEligibility,
  getLatestEligibility,
  getEligibilityById,
  createEligibility,
  updateEligibility,
  deleteEligibility
} = require('../controllers/e22EligibilityController');

const {
  getAllApplicationRequirements,
  getLatestApplicationRequirements,
  getApplicationRequirementsById,
  createApplicationRequirements,
  updateApplicationRequirements,
  deleteApplicationRequirements
} = require('../controllers/e22ApplicationRequirementsController');

const {
  getAllLegalFoundation,
  getLatestLegalFoundation,
  getLegalFoundationById,
  createLegalFoundation,
  updateLegalFoundation,
  deleteLegalFoundation
} = require('../controllers/e22LegalFoundationController');

const {
  getAllUSCISRoles,
  getLatestUSCISRoles,
  getUSCISRolesById,
  createUSCISRoles,
  updateUSCISRoles,
  deleteUSCISRoles
} = require('../controllers/e22USCISRolesController');

const {
  getAllDataChallenges,
  getLatestDataChallenges,
  getDataChallengesById,
  createDataChallenges,
  updateDataChallenges,
  deleteDataChallenges
} = require('../controllers/e22DataChallengesController');

const {
  getAllCategoryReference,
  getLatestCategoryReference,
  getCategoryReferenceById,
  createCategoryReference,
  updateCategoryReference,
  deleteCategoryReference
} = require('../controllers/e22CategoryReferenceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// E22 Overview routes
router
  .route('/overview')
  .get(getE22Overview)
  .post(protect, authorize('admin'), createE22Overview);

router
  .route('/overview/latest')
  .get(getE22Overview);

router
  .route('/overview/:id')
  .put(protect, authorize('admin'), updateE22Overview);
  
// E22 Eligibility routes
router
  .route('/eligibility')
  .get(getAllEligibility)
  .post(protect, authorize('admin'), createEligibility);

router
  .route('/eligibility/latest')
  .get(getLatestEligibility);

router
  .route('/eligibility/:id')
  .get(getEligibilityById)
  .put(protect, authorize('admin'), updateEligibility)
  .delete(protect, authorize('admin'), deleteEligibility);

// E22 Application Requirements routes
router
  .route('/application-requirements')
  .get(getAllApplicationRequirements)
  .post(protect, authorize('admin'), createApplicationRequirements);

router
  .route('/application-requirements/latest')
  .get(getLatestApplicationRequirements);

router
  .route('/application-requirements/:id')
  .get(getApplicationRequirementsById)
  .put(protect, authorize('admin'), updateApplicationRequirements)
  .delete(protect, authorize('admin'), deleteApplicationRequirements);

// E22 Legal Foundation routes
router
  .route('/legal-foundation')
  .get(getAllLegalFoundation)
  .post(protect, authorize('admin'), createLegalFoundation);

router
  .route('/legal-foundation/latest')
  .get(getLatestLegalFoundation);

router
  .route('/legal-foundation/:id')
  .get(getLegalFoundationById)
  .put(protect, authorize('admin'), updateLegalFoundation)
  .delete(protect, authorize('admin'), deleteLegalFoundation);

// E22 USCIS Roles routes
router
  .route('/uscis-roles')
  .get(getAllUSCISRoles)
  .post(protect, authorize('admin'), createUSCISRoles);

router
  .route('/uscis-roles/latest')
  .get(getLatestUSCISRoles);

router
  .route('/uscis-roles/:id')
  .get(getUSCISRolesById)
  .put(protect, authorize('admin'), updateUSCISRoles)
  .delete(protect, authorize('admin'), deleteUSCISRoles);

// E22 Data & Challenges routes
router
  .route('/data-challenges')
  .get(getAllDataChallenges)
  .post(protect, authorize('admin'), createDataChallenges);

router
  .route('/data-challenges/latest')
  .get(getLatestDataChallenges);

router
  .route('/data-challenges/:id')
  .get(getDataChallengesById)
  .put(protect, authorize('admin'), updateDataChallenges)
  .delete(protect, authorize('admin'), deleteDataChallenges);

// E22 Category Reference routes
router
  .route('/category-reference')
  .get(getAllCategoryReference)
  .post(protect, authorize('admin'), createCategoryReference);

router
  .route('/category-reference/latest')
  .get(getLatestCategoryReference);

router
  .route('/category-reference/:id')
  .get(getCategoryReferenceById)
  .put(protect, authorize('admin'), updateCategoryReference)
  .delete(protect, authorize('admin'), deleteCategoryReference);

module.exports = router;
