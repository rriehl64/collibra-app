/**
 * Script to create the businessprocesses collection and add sample data
 * This follows the BusinessProcess model schema defined in the application
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support';
console.log(`Connecting to MongoDB at ${mongoURI}`);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connection established successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import the BusinessProcess model - this creates the collection based on the schema
const BusinessProcess = require('./server/models/BusinessProcess');

// Sample data that matches the schema defined in BusinessProcess.js
const sampleProcesses = [
  {
    name: 'Customer Onboarding',
    description: 'Process for bringing new customers into the system',
    owner: 'Customer Success Team',
    category: 'Customer Management',
    status: 'active',
    tags: ['customer', 'onboarding', 'CRM']
  },
  {
    name: 'Order Processing',
    description: 'End-to-end order processing workflow',
    owner: 'Operations',
    category: 'Sales',
    status: 'active',
    tags: ['orders', 'fulfillment', 'inventory']
  },
  {
    name: 'Data Quality Assessment',
    description: 'Regular process to assess and report on data quality',
    owner: 'Data Governance',
    category: 'Data Management',
    status: 'active',
    tags: ['data quality', 'metrics', 'governance']
  },
  {
    name: 'Financial Reporting',
    description: 'Monthly financial reporting process',
    owner: 'Finance',
    category: 'Reporting',
    status: 'active',
    tags: ['financial', 'reporting', 'compliance']
  },
  {
    name: 'Data Warehouse ETL',
    description: 'Extract, Transform, Load process for the Data Warehouse',
    owner: 'Data Engineering',
    category: 'Data Management',
    status: 'active',
    tags: ['ETL', 'data warehouse', 'integration']
  },
  {
    name: 'Compliance Audit',
    description: 'Regular compliance auditing process',
    owner: 'Legal',
    category: 'Compliance',
    status: 'active',
    tags: ['audit', 'compliance', 'regulatory']
  }
];

const seedDatabase = async () => {
  try {
    // Delete existing records if any
    await BusinessProcess.deleteMany({});
    console.log('Cleared existing business processes');

    // Insert sample processes
    const createdProcesses = await BusinessProcess.create(sampleProcesses);
    console.log(`Successfully created ${createdProcesses.length} business processes`);

    // Verify collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('\nAvailable collections in data-literacy-support database:');
    console.log(collectionNames);
    
    // Check if our collection exists
    if (collectionNames.includes('businessprocesses')) {
      console.log('\nSuccess! The businessprocesses collection has been created.');
      
      // Count documents
      const count = await BusinessProcess.countDocuments();
      console.log(`The collection contains ${count} documents.`);
    } else {
      console.log('\nWarning: The businessprocesses collection was not found!');
    }
    
    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding business processes:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
