const express = require('express');
const router = express.Router();
const {
  getFederalDataStrategy,
  updateSection,
  addItem,
  deleteItem
} = require('../controllers/federalDataStrategyController');

// Middleware for authentication (optional - can be enabled later)
const authenticateUser = (req, res, next) => {
  // For now, we'll allow all requests
  // In production, implement proper authentication
  req.user = { name: 'Admin User' }; // Mock user
  next();
};

// Routes
router.get('/', getFederalDataStrategy);
router.put('/section', authenticateUser, updateSection);
router.post('/item', authenticateUser, addItem);
router.delete('/item', authenticateUser, deleteItem);

module.exports = router;
