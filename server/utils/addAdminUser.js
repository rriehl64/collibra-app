/**
 * Add Admin User Script
 * Creates an admin user with the default credentials expected by the frontend
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  password: 'admin123!',
  department: 'IT Department',
  jobTitle: 'System Administrator',
  assignedDomains: ['All Domains'],
  lastActive: new Date()
};

// Add the admin user
const addAdminUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    
    if (existingUser) {
      console.log('Admin user already exists, updating password...');
      
      // Update password
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(adminUser.password, salt);
      await existingUser.save();
      
      console.log('Admin user password updated successfully!');
      process.exit();
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash(adminUser.password, salt);
      
      // Create user
      await User.create(adminUser);
      
      console.log('Admin user created successfully!');
      process.exit();
    }
  } catch (error) {
    console.error('Error adding admin user:', error);
    process.exit(1);
  }
};

// Run the function
addAdminUser();
