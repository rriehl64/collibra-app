/**
 * Script to create sample data categories
 * Run this script to populate the datacategories collection
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the DataCategory model
const DataCategory = require('./server/models/DataCategory');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data categories to insert
const dataCategories = [
  {
    name: 'Customer Data',
    description: 'All data related to customer information and interactions',
    owner: 'Customer Success Team',
    assetCount: 24,
    status: 'active',
    tags: ['PII', 'customer', 'gdpr']
  },
  {
    name: 'Product Data',
    description: 'All product catalog and inventory information',
    owner: 'Product Team',
    assetCount: 15,
    status: 'active',
    tags: ['products', 'inventory', 'specs']
  },
  {
    name: 'Financial Data',
    description: 'All financial and accounting information',
    owner: 'Finance Department',
    assetCount: 18,
    status: 'active',
    tags: ['financial', 'confidential', 'quarterly']
  },
  {
    name: 'Marketing Assets',
    description: 'All marketing campaign and analytics data',
    owner: 'Marketing Team',
    assetCount: 12,
    status: 'active',
    tags: ['marketing', 'campaigns', 'analytics']
  },
  {
    name: 'HR Records',
    description: 'Employee and HR-related information',
    owner: 'Human Resources',
    assetCount: 8,
    status: 'active',
    tags: ['HR', 'employees', 'confidential', 'PII']
  },
  {
    name: 'Supply Chain Data',
    description: 'Vendor, logistics, and supply chain information',
    owner: 'Operations',
    assetCount: 14,
    status: 'active',
    tags: ['supply chain', 'vendors', 'logistics']
  }
];

// Function to seed the database
async function seedDataCategories() {
  try {
    // Delete existing data categories
    await DataCategory.deleteMany({});
    console.log('Deleted existing data categories');

    // Insert new data categories
    const createdCategories = await DataCategory.create(dataCategories);
    console.log(`Created ${createdCategories.length} data categories`);

    // Log the created categories
    createdCategories.forEach(category => {
      console.log(`- ${category.name} (${category._id})`);
    });

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDataCategories();
