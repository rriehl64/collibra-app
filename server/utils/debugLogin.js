/**
 * Debug Login Script
 * Tests login functionality directly against the database
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to Database
async function debugLogin() {
  try {
    await connectDB();
    console.log('MongoDB Connected');

    const email = 'admin@example.com';
    const password = 'admin123!';

    console.log(`Attempting to find user with email: ${email}`);
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found in database');
      
      // Create a new admin user
      console.log('Creating new admin user...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = await User.create({
        name: 'Admin User',
        email,
        password: hashedPassword,
        role: 'admin',
        department: 'IT Department',
        jobTitle: 'System Administrator',
        assignedDomains: ['All Domains'],
        lastActive: new Date()
      });
      
      console.log('Admin user created successfully!');
      console.log('User ID:', newUser._id);
      process.exit(0);
    } else {
      console.log('User found in database');
      console.log('User ID:', user._id);
      console.log('Stored hashed password:', user.password);
      
      // Test password match
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      
      // Update password if doesn't match
      if (!isMatch) {
        console.log('Password does not match, updating password...');
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        console.log('Password updated successfully!');
        
        // Verify the new password works
        const updatedUser = await User.findOne({ email }).select('+password');
        const newMatch = await bcrypt.compare(password, updatedUser.password);
        console.log('New password match:', newMatch);
      }
      
      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugLogin();
