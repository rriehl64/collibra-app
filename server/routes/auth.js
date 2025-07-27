const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/auth');
const User = require('../models/User');

// Create router
const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', logout);

// Debug route - only available in development
if (process.env.NODE_ENV === 'development') {
  router.get('/debug/check-user/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with email ${email} not found in database`
        });
      }
      
      // Check if password would match
      const passwordMatch = await user.matchPassword('password123');
      
      res.status(200).json({
        success: true,
        message: `User ${email} exists`,
        userInfo: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          passwordMatch: passwordMatch
        }
      });
    } catch (error) {
      console.error('Debug route error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  });
}

module.exports = router;
