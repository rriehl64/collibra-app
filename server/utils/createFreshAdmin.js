/**
 * Create Fresh Admin User Script
 * Completely recreates the admin user with proper credentials
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to Database
async function createAdmin() {
  try {
    await connectDB();
    console.log('MongoDB Connected');

    // Delete any existing admin users with this email
    console.log('Removing existing admin@example.com users from database...');
    const result = await mongoose.connection.db.collection('users').deleteMany({ email: 'admin@example.com' });
    console.log('Delete result:', result);
    
    // Create a fresh admin user directly in the MongoDB collection
    console.log('Creating fresh admin user...');
    
    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123!', salt);
    
    // Insert user document directly
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      password: hashedPassword,
      department: 'IT Department',
      jobTitle: 'System Administrator',
      assignedDomains: ['All Domains'],
      lastActive: new Date(),
      createdAt: new Date()
    };
    
    const insertResult = await mongoose.connection.db.collection('users').insertOne(adminUser);
    console.log('Admin user created with ID:', insertResult.insertedId);
    
    // Verify the admin user was created
    const newAdmin = await mongoose.connection.db.collection('users').findOne({ email: 'admin@example.com' });
    console.log('New admin user found:', !!newAdmin);
    console.log('Password stored correctly:', !!newAdmin.password);
    
    // Test password verification directly
    const passwordMatch = await bcrypt.compare('admin123!', newAdmin.password);
    console.log('Manual password verification result:', passwordMatch);
    
    console.log('Admin user creation complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
