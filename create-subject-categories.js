/**
 * Script to create the subjectcategories collection and add sample data
 * This follows the SubjectCategory model schema for the E-Unify application
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

// Define the SubjectCategory schema
const subjectCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true },
  departmentCode: { type: String, required: true, trim: true },
  owner: { type: String, required: true, trim: true },
  status: { type: String, enum: ['active', 'inactive', 'draft', 'archived'], default: 'draft' },
  lastUpdated: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

// Create the model from the schema
const SubjectCategory = mongoose.model('SubjectCategory', subjectCategorySchema);

// Sample data that matches the schema
const sampleSubjectCategories = [
  {
    name: 'Immigration Services',
    description: 'Categories related to immigration service delivery and processing',
    departmentCode: 'IMMSVC-001',
    owner: 'Immigration Services Division',
    status: 'active',
    lastUpdated: new Date('2025-07-12'),
    tags: ['immigration', 'services', 'processing']
  },
  {
    name: 'Naturalization',
    description: 'Information related to the naturalization process and citizenship',
    departmentCode: 'NATRLZ-002',
    owner: 'Citizenship Division',
    status: 'active',
    lastUpdated: new Date('2025-07-15'),
    tags: ['citizenship', 'naturalization', 'processing']
  },
  {
    name: 'Application Management',
    description: 'Categories for application tracking, processing, and management',
    departmentCode: 'APPMGT-003',
    owner: 'Application Processing Department',
    status: 'active',
    lastUpdated: new Date('2025-07-18'),
    tags: ['applications', 'processing', 'forms']
  },
  {
    name: 'Policy Implementation',
    description: 'Categories related to policy implementation and enforcement',
    departmentCode: 'POLIMPL-004',
    owner: 'Policy Division',
    status: 'active',
    lastUpdated: new Date('2025-07-21'),
    tags: ['policy', 'implementation', 'guidelines']
  },
  {
    name: 'Legal Affairs',
    description: 'Legal aspects of immigration and citizenship processes',
    departmentCode: 'LEGAL-005',
    owner: 'Office of General Counsel',
    status: 'active',
    lastUpdated: new Date('2025-07-24'),
    tags: ['legal', 'compliance', 'regulations']
  },
  {
    name: 'Fraud Detection',
    description: 'Categories related to fraud detection and prevention',
    departmentCode: 'FRDDTC-006',
    owner: 'Fraud Detection Office',
    status: 'active',
    lastUpdated: new Date('2025-07-27'),
    tags: ['fraud', 'detection', 'security']
  },
  {
    name: 'International Operations',
    description: 'Categories for international offices and operations',
    departmentCode: 'INTOPS-007',
    owner: 'International Operations Division',
    status: 'active',
    lastUpdated: new Date('2025-07-30'),
    tags: ['international', 'operations', 'global']
  },
  {
    name: 'Field Operations',
    description: 'Categories for field office management and operations',
    departmentCode: 'FLDOPS-008',
    owner: 'Field Operations Support',
    status: 'active',
    lastUpdated: new Date('2025-08-02'),
    tags: ['field', 'operations', 'offices']
  }
];

const seedDatabase = async () => {
  try {
    // Delete existing records if any
    await SubjectCategory.deleteMany({});
    console.log('Cleared existing subject categories');

    // Insert sample subject categories
    const createdSubjectCategories = await SubjectCategory.create(sampleSubjectCategories);
    console.log(`Successfully created ${createdSubjectCategories.length} subject categories`);

    // Verify collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('\nAvailable collections in data-literacy-support database:');
    console.log(collectionNames);
    
    // Check if our collection exists
    if (collectionNames.includes('subjectcategories')) {
      console.log('\nSuccess! The subjectcategories collection has been created.');
      
      // Count documents
      const count = await SubjectCategory.countDocuments();
      console.log(`The collection contains ${count} documents.`);
    } else {
      console.log('\nWarning: The subjectcategories collection was not found!');
    }
    
    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding subject categories:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
