/**
 * Script to create the datadomains collection and add sample data
 * This follows the DataDomain model schema for the E-Unify application
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

// Define the DataDomain schema
const dataDomainSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['Business', 'Technical', 'Operational', 'Regulatory'], default: 'Business' },
  owner: { type: String, required: true, trim: true },
  status: { type: String, enum: ['active', 'inactive', 'draft', 'archived'], default: 'draft' },
  lastUpdated: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

// Create the model from the schema
const DataDomain = mongoose.model('DataDomain', dataDomainSchema);

// Sample data that matches the schema
const sampleDataDomains = [
  {
    name: 'Customer Data',
    description: 'All data related to customer profiles, interactions, and preferences',
    type: 'Business',
    owner: 'Customer Relations',
    status: 'active',
    lastUpdated: new Date('2025-07-15'),
    tags: ['customer', 'profile', 'CRM']
  },
  {
    name: 'Financial Data',
    description: 'All financial records, transactions, and reporting data',
    type: 'Regulatory',
    owner: 'Finance Department',
    status: 'active',
    lastUpdated: new Date('2025-07-20'),
    tags: ['finance', 'accounting', 'compliance']
  },
  {
    name: 'Product Information',
    description: 'All data related to products, specifications, and lifecycle',
    type: 'Business',
    owner: 'Product Management',
    status: 'active',
    lastUpdated: new Date('2025-07-25'),
    tags: ['product', 'catalog', 'inventory']
  },
  {
    name: 'Employee Records',
    description: 'Personnel information, performance data, and HR records',
    type: 'Operational',
    owner: 'Human Resources',
    status: 'active',
    lastUpdated: new Date('2025-07-10'),
    tags: ['HR', 'employee', 'personnel']
  },
  {
    name: 'System Logs',
    description: 'Application and system log data for monitoring and analysis',
    type: 'Technical',
    owner: 'IT Operations',
    status: 'active',
    lastUpdated: new Date('2025-08-01'),
    tags: ['logs', 'monitoring', 'security']
  },
  {
    name: 'Compliance Documentation',
    description: 'Regulatory compliance documentation and audit records',
    type: 'Regulatory',
    owner: 'Legal Department',
    status: 'active',
    lastUpdated: new Date('2025-07-05'),
    tags: ['compliance', 'legal', 'documentation']
  },
  {
    name: 'Marketing Data',
    description: 'Campaign data, marketing analytics, and audience information',
    type: 'Business',
    owner: 'Marketing Department',
    status: 'active',
    lastUpdated: new Date('2025-07-29'),
    tags: ['marketing', 'campaigns', 'analytics']
  },
  {
    name: 'Supply Chain',
    description: 'Supply chain, logistics, and inventory management data',
    type: 'Operational',
    owner: 'Operations',
    status: 'active',
    lastUpdated: new Date('2025-07-18'),
    tags: ['supply chain', 'logistics', 'inventory']
  }
];

const seedDatabase = async () => {
  try {
    // Delete existing records if any
    await DataDomain.deleteMany({});
    console.log('Cleared existing data domains');

    // Insert sample data domains
    const createdDataDomains = await DataDomain.create(sampleDataDomains);
    console.log(`Successfully created ${createdDataDomains.length} data domains`);

    // Verify collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('\nAvailable collections in data-literacy-support database:');
    console.log(collectionNames);
    
    // Check if our collection exists
    if (collectionNames.includes('datadomains')) {
      console.log('\nSuccess! The datadomains collection has been created.');
      
      // Count documents
      const count = await DataDomain.countDocuments();
      console.log(`The collection contains ${count} documents.`);
    } else {
      console.log('\nWarning: The datadomains collection was not found!');
    }
    
    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding data domains:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
