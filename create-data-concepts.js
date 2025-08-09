/**
 * Seed script for Data Concepts
 * 
 * This script populates the dataconcepts collection with sample data.
 * It can be run with: node create-data-concepts.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define DataConcept model directly in the script to avoid circular dependencies
const dataConceptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Concept name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['approved', 'draft', 'deprecated'],
      message: 'Status must be either: approved, draft, or deprecated'
    },
    default: 'draft'
  },
  steward: {
    type: String,
    required: [true, 'Data steward is required'],
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  relatedConcepts: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

const DataConcept = mongoose.model('DataConcept', dataConceptSchema);

// Sample data
const sampleDataConcepts = [
  {
    name: 'Customer',
    description: 'An individual or entity that purchases goods or services from the organization',
    domain: 'Customer Management',
    status: 'approved',
    steward: 'John Smith',
    lastUpdated: new Date('2025-07-28'),
    relatedConcepts: ['Lead', 'Account', 'Contact'],
    tags: ['core', 'business', 'customer']
  },
  {
    name: 'Account',
    description: 'A formal business relationship between a customer and the company',
    domain: 'Customer Management',
    status: 'approved',
    steward: 'Emily Johnson',
    lastUpdated: new Date('2025-08-01'),
    relatedConcepts: ['Customer', 'Contract', 'Billing'],
    tags: ['core', 'finance', 'customer']
  },
  {
    name: 'Product',
    description: 'Any item or service that is offered for sale',
    domain: 'Product Management',
    status: 'approved',
    steward: 'Michael Davis',
    lastUpdated: new Date('2025-07-15'),
    relatedConcepts: ['SKU', 'Inventory', 'Price'],
    tags: ['core', 'product']
  },
  {
    name: 'Order',
    description: 'A request from a customer to purchase one or more products',
    domain: 'Sales',
    status: 'approved',
    steward: 'Sarah Wilson',
    lastUpdated: new Date('2025-07-20'),
    relatedConcepts: ['Customer', 'Product', 'Invoice'],
    tags: ['core', 'sales', 'transaction']
  },
  {
    name: 'Revenue',
    description: 'Income generated from business activities',
    domain: 'Finance',
    status: 'approved',
    steward: 'Robert Brown',
    lastUpdated: new Date('2025-07-25'),
    relatedConcepts: ['Sales', 'Profit', 'Income'],
    tags: ['finance', 'metrics']
  },
  {
    name: 'Employee',
    description: 'A person who works for the organization under an employment contract',
    domain: 'Human Resources',
    status: 'approved',
    steward: 'Jennifer Lee',
    lastUpdated: new Date('2025-08-02'),
    relatedConcepts: ['Department', 'Position', 'Compensation'],
    tags: ['hr', 'personnel']
  },
  {
    name: 'Lead',
    description: 'A potential customer who has shown interest in the company\'s products or services',
    domain: 'Sales',
    status: 'draft',
    steward: 'David Garcia',
    lastUpdated: new Date('2025-08-03'),
    relatedConcepts: ['Customer', 'Prospect', 'Opportunity'],
    tags: ['sales', 'marketing']
  },
  {
    name: 'Asset',
    description: 'Any resource owned or controlled by the company with economic value',
    domain: 'Finance',
    status: 'approved',
    steward: 'Linda Martinez',
    lastUpdated: new Date('2025-07-30'),
    relatedConcepts: ['Property', 'Equipment', 'Investment'],
    tags: ['finance', 'accounting']
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB Connected...');
  
  try {
    // Clean existing data
    await DataConcept.deleteMany({});
    console.log('Deleted existing data concepts');
    
    // Insert new data
    const createdConcepts = await DataConcept.create(sampleDataConcepts);
    console.log(`Created ${createdConcepts.length} data concepts`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('Connection error:', err.message);
});
