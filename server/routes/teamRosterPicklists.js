const express = require('express');
const router = express.Router();
const {
  getPicklists,
  getPicklistByType,
  updatePicklist,
  addPicklistValue,
  deletePicklistValue,
  initializePicklists
} = require('../controllers/teamRosterPicklists');

// Public routes for getting picklists (needed for dropdowns)
router.get('/', getPicklists);
router.get('/:type', getPicklistByType);

// Admin routes for managing picklists
router.post('/initialize', initializePicklists);
router.put('/:type', updatePicklist);
router.post('/:type/values', addPicklistValue);
router.delete('/:type/values/:valueId', deletePicklistValue);

module.exports = router;
