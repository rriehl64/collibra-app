const express = require('express');
const router = express.Router();
const SubjectCategory = require('../models/SubjectCategory');

// Error handler function for async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @desc    Get all subject categories
 * @route   GET /api/v1/subject-categories
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  // Set cache-control headers to prevent caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Handle search query if provided
  const search = req.query.search || '';
  let query = {};
  
  if (search) {
    query = { $text: { $search: search } };
  }
  
  const categories = await SubjectCategory.find(query);
  
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
}));

/**
 * @desc    Get single subject category
 * @route   GET /api/v1/subject-categories/:id
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const category = await SubjectCategory.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Subject category not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: category
  });
}));

/**
 * @desc    Update a subject category
 * @route   PUT /api/v1/subject-categories/:id
 * @access  Private
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  console.log(`Updating subject category ${id} with data:`, updatedData);
  
  try {
    // Set lastUpdated to current date
    updatedData.lastUpdated = new Date();
    
    // Get user ID from authenticated user if available
    const userId = req.user ? req.user.id : null;
    if (userId) {
      updatedData.updatedBy = userId;
    }
    
    // Find and update the category in MongoDB
    const category = await SubjectCategory.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: `Subject category with ID ${id} not found`
      });
    }
    
    console.log(`Successfully updated category ${id}. New data:`, category);
    
    // Set cache-control headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json({
      success: true,
      message: 'Subject category updated successfully',
      data: category
    });
  } catch (err) {
    console.error('Error updating subject category:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}));

module.exports = router;
