const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Team Roster Picklist Model
const teamRosterPicklistSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['role', 'branch', 'positionTitle'],
    unique: true
  },
  values: [{
    value: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  }],
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

const TeamRosterPicklist = mongoose.model('TeamRosterPicklist', teamRosterPicklistSchema);

// Initialize picklists
const initializePicklists = async () => {
  try {
    await connectDB();

    const defaultPicklists = [
      {
        type: 'role',
        values: [
          // Leadership & Management
          { value: 'Chief Data Officer', displayOrder: 1, isActive: true },
          { value: 'Director', displayOrder: 2, isActive: true },
          { value: 'Deputy Director', displayOrder: 3, isActive: true },
          { value: 'Program Manager', displayOrder: 4, isActive: true },
          { value: 'Project Manager', displayOrder: 5, isActive: true },
          { value: 'Product Manager', displayOrder: 6, isActive: true },
          { value: 'Scrum Master', displayOrder: 7, isActive: true },
          
          // Data Engineering
          { value: 'Data Engineer', displayOrder: 8, isActive: true },
          { value: 'Senior Data Engineer', displayOrder: 9, isActive: true },
          { value: 'Lead Data Engineer', displayOrder: 10, isActive: true },
          { value: 'Principal Data Engineer', displayOrder: 11, isActive: true },
          { value: 'ETL Developer', displayOrder: 12, isActive: true },
          { value: 'Database Administrator', displayOrder: 13, isActive: true },
          
          // Data Analytics & Science
          { value: 'Data Analyst', displayOrder: 14, isActive: true },
          { value: 'Senior Data Analyst', displayOrder: 15, isActive: true },
          { value: 'Lead Data Analyst', displayOrder: 16, isActive: true },
          { value: 'Data Scientist', displayOrder: 17, isActive: true },
          { value: 'Senior Data Scientist', displayOrder: 18, isActive: true },
          { value: 'Principal Data Scientist', displayOrder: 19, isActive: true },
          { value: 'Machine Learning Engineer', displayOrder: 20, isActive: true },
          { value: 'AI/ML Specialist', displayOrder: 21, isActive: true },
          
          // Business Analysis
          { value: 'Business Analyst', displayOrder: 22, isActive: true },
          { value: 'Senior Business Analyst', displayOrder: 23, isActive: true },
          { value: 'Business Intelligence Analyst', displayOrder: 24, isActive: true },
          { value: 'Requirements Analyst', displayOrder: 25, isActive: true },
          
          // Architecture & Design
          { value: 'Data Architect', displayOrder: 26, isActive: true },
          { value: 'Enterprise Architect', displayOrder: 27, isActive: true },
          { value: 'Solution Architect', displayOrder: 28, isActive: true },
          { value: 'Cloud Architect', displayOrder: 29, isActive: true },
          
          // Governance & Quality
          { value: 'Data Steward', displayOrder: 30, isActive: true },
          { value: 'Data Governance Manager', displayOrder: 31, isActive: true },
          { value: 'Data Quality Analyst', displayOrder: 32, isActive: true },
          { value: 'Metadata Manager', displayOrder: 33, isActive: true },
          { value: 'Privacy Officer', displayOrder: 34, isActive: true },
          
          // Development & Engineering
          { value: 'Software Engineer', displayOrder: 35, isActive: true },
          { value: 'Senior Software Engineer', displayOrder: 36, isActive: true },
          { value: 'Full Stack Developer', displayOrder: 37, isActive: true },
          { value: 'Frontend Developer', displayOrder: 38, isActive: true },
          { value: 'Backend Developer', displayOrder: 39, isActive: true },
          { value: 'DevOps Engineer', displayOrder: 40, isActive: true },
          { value: 'Site Reliability Engineer', displayOrder: 41, isActive: true },
          
          // Design & UX
          { value: 'UX Designer', displayOrder: 42, isActive: true },
          { value: 'UI Designer', displayOrder: 43, isActive: true },
          { value: 'UX Researcher', displayOrder: 44, isActive: true },
          { value: 'Product Designer', displayOrder: 45, isActive: true },
          
          // Quality & Testing
          { value: 'Quality Assurance Analyst', displayOrder: 46, isActive: true },
          { value: 'Test Engineer', displayOrder: 47, isActive: true },
          { value: 'Automation Engineer', displayOrder: 48, isActive: true },
          
          // Support & Operations
          { value: 'Technical Writer', displayOrder: 49, isActive: true },
          { value: 'Systems Administrator', displayOrder: 50, isActive: true },
          { value: 'Support Specialist', displayOrder: 51, isActive: true },
          { value: 'Training Specialist', displayOrder: 52, isActive: true }
        ],
        modifiedBy: 'system'
      },
      {
        type: 'branch',
        values: [
          { value: 'Front Office', displayOrder: 1, isActive: true },
          { value: 'Data Management', displayOrder: 2, isActive: true },
          { value: 'Data Analytics', displayOrder: 3, isActive: true },
          { value: 'Data Engineering', displayOrder: 4, isActive: true },
          { value: 'Data Science', displayOrder: 5, isActive: true },
          { value: 'Business Intelligence', displayOrder: 6, isActive: true },
          { value: 'Data Governance', displayOrder: 7, isActive: true },
          { value: 'Product & Design', displayOrder: 8, isActive: true },
          { value: 'Enterprise Architecture', displayOrder: 9, isActive: true },
          { value: 'Cloud & Infrastructure', displayOrder: 10, isActive: true },
          { value: 'Quality Assurance', displayOrder: 11, isActive: true },
          { value: 'Program Management Office', displayOrder: 12, isActive: true }
        ],
        modifiedBy: 'system'
      },
      {
        type: 'positionTitle',
        values: [
          // Executive & Senior Leadership
          { value: 'Chief Data Officer', displayOrder: 1, isActive: true },
          { value: 'Director of Data Strategy', displayOrder: 2, isActive: true },
          { value: 'Deputy Director of Data Operations', displayOrder: 3, isActive: true },
          { value: 'Associate Director', displayOrder: 4, isActive: true },
          
          // Program & Project Management
          { value: 'Senior Program Manager', displayOrder: 5, isActive: true },
          { value: 'Program Manager', displayOrder: 6, isActive: true },
          { value: 'Senior Project Manager', displayOrder: 7, isActive: true },
          { value: 'Project Manager', displayOrder: 8, isActive: true },
          { value: 'Senior Product Manager', displayOrder: 9, isActive: true },
          { value: 'Product Manager', displayOrder: 10, isActive: true },
          { value: 'Agile Coach', displayOrder: 11, isActive: true },
          { value: 'Scrum Master', displayOrder: 12, isActive: true },
          
          // Data Engineering
          { value: 'Principal Data Engineer', displayOrder: 13, isActive: true },
          { value: 'Lead Data Engineer', displayOrder: 14, isActive: true },
          { value: 'Senior Data Engineer', displayOrder: 15, isActive: true },
          { value: 'Data Engineer II', displayOrder: 16, isActive: true },
          { value: 'Data Engineer I', displayOrder: 17, isActive: true },
          { value: 'Senior ETL Developer', displayOrder: 18, isActive: true },
          { value: 'ETL Developer', displayOrder: 19, isActive: true },
          { value: 'Senior Database Administrator', displayOrder: 20, isActive: true },
          { value: 'Database Administrator', displayOrder: 21, isActive: true },
          
          // Data Analytics & Science
          { value: 'Principal Data Scientist', displayOrder: 22, isActive: true },
          { value: 'Lead Data Scientist', displayOrder: 23, isActive: true },
          { value: 'Senior Data Scientist', displayOrder: 24, isActive: true },
          { value: 'Data Scientist II', displayOrder: 25, isActive: true },
          { value: 'Data Scientist I', displayOrder: 26, isActive: true },
          { value: 'Lead Data Analyst', displayOrder: 27, isActive: true },
          { value: 'Senior Data Analyst', displayOrder: 28, isActive: true },
          { value: 'Data Analyst II', displayOrder: 29, isActive: true },
          { value: 'Data Analyst I', displayOrder: 30, isActive: true },
          { value: 'Senior Machine Learning Engineer', displayOrder: 31, isActive: true },
          { value: 'Machine Learning Engineer', displayOrder: 32, isActive: true },
          { value: 'AI/ML Research Scientist', displayOrder: 33, isActive: true },
          
          // Business Analysis
          { value: 'Lead Business Analyst', displayOrder: 34, isActive: true },
          { value: 'Senior Business Analyst', displayOrder: 35, isActive: true },
          { value: 'Business Analyst II', displayOrder: 36, isActive: true },
          { value: 'Business Analyst I', displayOrder: 37, isActive: true },
          { value: 'Senior BI Analyst', displayOrder: 38, isActive: true },
          { value: 'Business Intelligence Analyst', displayOrder: 39, isActive: true },
          { value: 'Requirements Analyst', displayOrder: 40, isActive: true },
          
          // Architecture
          { value: 'Chief Data Architect', displayOrder: 41, isActive: true },
          { value: 'Principal Data Architect', displayOrder: 42, isActive: true },
          { value: 'Senior Data Architect', displayOrder: 43, isActive: true },
          { value: 'Data Architect', displayOrder: 44, isActive: true },
          { value: 'Enterprise Architect', displayOrder: 45, isActive: true },
          { value: 'Solution Architect', displayOrder: 46, isActive: true },
          { value: 'Cloud Solutions Architect', displayOrder: 47, isActive: true },
          
          // Data Governance & Quality
          { value: 'Data Governance Manager', displayOrder: 48, isActive: true },
          { value: 'Senior Data Steward', displayOrder: 49, isActive: true },
          { value: 'Data Steward', displayOrder: 50, isActive: true },
          { value: 'Senior Data Quality Analyst', displayOrder: 51, isActive: true },
          { value: 'Data Quality Analyst', displayOrder: 52, isActive: true },
          { value: 'Metadata Manager', displayOrder: 53, isActive: true },
          { value: 'Metadata Analyst', displayOrder: 54, isActive: true },
          { value: 'Chief Privacy Officer', displayOrder: 55, isActive: true },
          { value: 'Privacy Analyst', displayOrder: 56, isActive: true },
          
          // Software Development
          { value: 'Staff Software Engineer', displayOrder: 57, isActive: true },
          { value: 'Principal Software Engineer', displayOrder: 58, isActive: true },
          { value: 'Senior Software Engineer', displayOrder: 59, isActive: true },
          { value: 'Software Engineer II', displayOrder: 60, isActive: true },
          { value: 'Software Engineer I', displayOrder: 61, isActive: true },
          { value: 'Senior Full Stack Developer', displayOrder: 62, isActive: true },
          { value: 'Full Stack Developer', displayOrder: 63, isActive: true },
          { value: 'Senior Frontend Developer', displayOrder: 64, isActive: true },
          { value: 'Frontend Developer', displayOrder: 65, isActive: true },
          { value: 'Senior Backend Developer', displayOrder: 66, isActive: true },
          { value: 'Backend Developer', displayOrder: 67, isActive: true },
          
          // DevOps & Infrastructure
          { value: 'Principal DevOps Engineer', displayOrder: 68, isActive: true },
          { value: 'Senior DevOps Engineer', displayOrder: 69, isActive: true },
          { value: 'DevOps Engineer', displayOrder: 70, isActive: true },
          { value: 'Senior Site Reliability Engineer', displayOrder: 71, isActive: true },
          { value: 'Site Reliability Engineer', displayOrder: 72, isActive: true },
          { value: 'Cloud Engineer', displayOrder: 73, isActive: true },
          { value: 'Senior Systems Administrator', displayOrder: 74, isActive: true },
          { value: 'Systems Administrator', displayOrder: 75, isActive: true },
          
          // Design & UX
          { value: 'Lead UX Designer', displayOrder: 76, isActive: true },
          { value: 'Senior UX Designer', displayOrder: 77, isActive: true },
          { value: 'UX Designer', displayOrder: 78, isActive: true },
          { value: 'Senior UI Designer', displayOrder: 79, isActive: true },
          { value: 'UI Designer', displayOrder: 80, isActive: true },
          { value: 'UX Researcher', displayOrder: 81, isActive: true },
          { value: 'Senior Product Designer', displayOrder: 82, isActive: true },
          { value: 'Product Designer', displayOrder: 83, isActive: true },
          
          // Quality Assurance
          { value: 'QA Manager', displayOrder: 84, isActive: true },
          { value: 'QA Lead', displayOrder: 85, isActive: true },
          { value: 'Senior QA Analyst', displayOrder: 86, isActive: true },
          { value: 'QA Analyst', displayOrder: 87, isActive: true },
          { value: 'Senior Test Engineer', displayOrder: 88, isActive: true },
          { value: 'Test Engineer', displayOrder: 89, isActive: true },
          { value: 'Automation Engineer', displayOrder: 90, isActive: true },
          
          // Support & Operations
          { value: 'Senior Technical Writer', displayOrder: 91, isActive: true },
          { value: 'Technical Writer', displayOrder: 92, isActive: true },
          { value: 'Training Manager', displayOrder: 93, isActive: true },
          { value: 'Training Specialist', displayOrder: 94, isActive: true },
          { value: 'Technical Support Specialist', displayOrder: 95, isActive: true },
          { value: 'Data Operations Specialist', displayOrder: 96, isActive: true }
        ],
        modifiedBy: 'system'
      }
    ];

    console.log('Initializing Team Roster Picklists...');

    for (const picklistData of defaultPicklists) {
      const existing = await TeamRosterPicklist.findOne({ type: picklistData.type });
      
      if (existing) {
        console.log(`✓ Picklist '${picklistData.type}' already exists`);
      } else {
        await TeamRosterPicklist.create(picklistData);
        console.log(`✓ Created picklist '${picklistData.type}' with ${picklistData.values.length} values`);
      }
    }

    console.log('\n✅ Team Roster Picklists initialization complete!');
    console.log('\nYou can now manage these picklists at:');
    console.log('http://localhost:3008/admin/team-roster-picklists');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing picklists:', error);
    process.exit(1);
  }
};

// Run initialization
initializePicklists();
