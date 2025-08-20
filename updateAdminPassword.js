const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const connectDB = require('./server/config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

async function updatePassword() {
  try {
    // Connect to database
    await connectDB();
    console.log('MongoDB Connected');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@uscis.gov' });
    
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123!', salt);
    
    // Update admin password
    adminUser.password = hashedPassword;
    await adminUser.save();
    
    console.log('Admin password updated successfully to admin123!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin password:', error);
    process.exit(1);
  }
}

updatePassword();
