const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    
    // Support text search if query provided
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { jobTitle: searchRegex }
      ];
    }
    
    // Filter by role if specified
    if (req.query.role && ['user', 'data-steward', 'admin'].includes(req.query.role)) {
      query.role = req.query.role;
    }
    
    // Add cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Fetch users from the database
    const users = await User.find(query).select('-password -resetPasswordToken -resetPasswordExpire');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    // Find user
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`
      });
    }
    
    // Fields that can be updated
    const updateableFields = [
      'name',
      'email',
      'role',
      'department',
      'jobTitle',
      'assignedDomains',
      'preferences'
    ];
    
    // Create update object with only allowed fields
    const updateData = {};
    for (const field of updateableFields) {
      if (req.body[field] !== undefined) {
        // Handle nested preferences object
        if (field === 'preferences' && typeof req.body[field] === 'object') {
          updateData[field] = {
            ...user.preferences || {},
            ...req.body[field]
          };
        } else {
          updateData[field] = req.body[field];
        }
      }
    }
    
    // Update user
    user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -resetPasswordToken -resetPasswordExpire');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user is trying to delete themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account'
      });
    }
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
