/**
 * Seed Users Utility
 * Creates sample users for testing the Users page
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to Database - make sure we're using the correct database
connectDB();

// Log the database we're connected to
console.log('Database name:', mongoose.connection.name || 'Not connected yet');

// Sample user data
const users = [
  {
    name: 'Admin User',
    email: 'admin@uscis.gov',
    role: 'admin',
    password: 'password123',
    department: 'IT Department',
    jobTitle: 'System Administrator',
    assignedDomains: ['All Domains'],
    lastActive: new Date()
  },
  {
    name: 'Data Steward',
    email: 'steward@uscis.gov',
    role: 'data-steward',
    password: 'password123',
    department: 'Data Management',
    jobTitle: 'Senior Data Steward',
    assignedDomains: ['Customer Data', 'Product Data'],
    lastActive: new Date()
  },
  {
    name: 'Regular User',
    email: 'user@uscis.gov',
    role: 'user',
    password: 'password123',
    department: 'Operations',
    jobTitle: 'Business Analyst',
    assignedDomains: ['Customer Data'],
    lastActive: new Date()
  },
  {
    name: 'John Smith',
    email: 'john.smith@uscis.gov',
    role: 'user',
    password: 'password123',
    department: 'Immigration Services',
    jobTitle: 'Immigration Officer',
    assignedDomains: [],
    lastActive: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) // 40 days ago (inactive)
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@uscis.gov',
    role: 'data-steward',
    password: 'password123',
    department: 'Compliance',
    jobTitle: 'Compliance Officer',
    assignedDomains: ['Policy Data'],
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@uscis.gov',
    role: 'admin',
    password: 'password123',
    department: 'Executive',
    jobTitle: 'Department Director',
    assignedDomains: ['All Domains'],
    lastActive: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  }
];

// Seed the database
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users deleted');

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );

    // Insert users
    await User.insertMany(hashedUsers);
    console.log('Sample users created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seeder
seedUsers();
