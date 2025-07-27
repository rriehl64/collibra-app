/**
 * Database Seeder
 * Script to populate database with sample data for development
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const DataAsset = require('./models/DataAsset');
const Policy = require('./models/Policy');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123!',
    role: 'admin',
    department: 'IT',
    jobTitle: 'System Administrator',
    assignedDomains: ['Finance', 'HR', 'IT']
  },
  {
    name: 'Data Steward',
    email: 'steward@example.com',
    password: 'password123',
    role: 'data-steward',
    department: 'Data Management',
    jobTitle: 'Data Governance Lead',
    assignedDomains: ['Finance', 'Sales']
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    department: 'Marketing',
    jobTitle: 'Marketing Analyst'
  }
];

// Sample Data Assets
const dataAssets = [
  {
    name: 'Customer Database',
    type: 'Database',
    domain: 'Sales',
    owner: 'John Smith',
    description: 'Primary customer database containing all customer information including contact details, preferences, and purchase history.',
    status: 'Production',
    tags: ['Customer', 'PII', 'Sales'],
    certification: 'certified',
    stewards: ['Data Steward'],
    governance: {
      complianceStatus: 'Compliant',
      policies: [
        {
          name: 'Data Retention Policy',
          description: 'Customer data must be retained for 7 years',
          status: 'Active'
        },
        {
          name: 'PII Protection Policy',
          description: 'Personal identifiable information must be encrypted',
          status: 'Active'
        }
      ]
    },
    qualityMetrics: {
      completeness: 95,
      accuracy: 90,
      consistency: 85
    }
  },
  {
    name: 'Sales Dashboard',
    type: 'Dashboard',
    domain: 'Sales',
    owner: 'Jane Doe',
    description: 'Executive dashboard showing real-time sales performance metrics and KPIs for the organization.',
    status: 'Production',
    tags: ['Sales', 'Analytics', 'KPI'],
    certification: 'certified',
    stewards: ['Data Steward'],
    governance: {
      complianceStatus: 'Compliant',
      policies: [
        {
          name: 'Data Accuracy Policy',
          description: 'Dashboard data must be updated hourly',
          status: 'Active'
        }
      ]
    },
    qualityMetrics: {
      completeness: 100,
      accuracy: 98,
      consistency: 90
    }
  },
  {
    name: 'Employee Records',
    type: 'Table',
    domain: 'HR',
    owner: 'HR Department',
    description: 'Central repository of employee records including personal information, employment history, and performance reviews.',
    status: 'Production',
    tags: ['HR', 'PII', 'Employees'],
    certification: 'certified',
    stewards: ['Admin User'],
    governance: {
      complianceStatus: 'Compliant',
      policies: [
        {
          name: 'HR Data Access Policy',
          description: 'Access restricted to HR personnel only',
          status: 'Active'
        }
      ]
    },
    qualityMetrics: {
      completeness: 92,
      accuracy: 95,
      consistency: 88
    }
  },
  {
    name: 'Marketing Campaign Report',
    type: 'Report',
    domain: 'Marketing',
    owner: 'Marketing Team',
    description: 'Detailed report on marketing campaign performance including reach, engagement, conversion, and ROI metrics.',
    status: 'Development',
    tags: ['Marketing', 'Analytics', 'Campaign'],
    certification: 'pending',
    stewards: ['Regular User'],
    governance: {
      complianceStatus: 'Non-Compliant',
      policies: []
    },
    qualityMetrics: {
      completeness: 75,
      accuracy: 80,
      consistency: 70
    }
  },
  {
    name: 'Product Catalog API',
    type: 'API',
    domain: 'Product',
    owner: 'Product Team',
    description: 'API providing access to the complete product catalog including specifications, pricing, and inventory levels.',
    status: 'Production',
    tags: ['API', 'Products', 'Inventory'],
    certification: 'certified',
    stewards: ['Data Steward'],
    governance: {
      complianceStatus: 'Compliant',
      policies: [
        {
          name: 'API Rate Limiting Policy',
          description: 'API calls limited to 1000 per minute',
          status: 'Active'
        }
      ]
    },
    qualityMetrics: {
      completeness: 98,
      accuracy: 97,
      consistency: 99
    }
  },
  {
    name: 'Financial Reports',
    type: 'Document',
    domain: 'Finance',
    owner: 'Finance Department',
    description: 'Collection of quarterly and annual financial reports including balance sheets, income statements, and cash flow statements.',
    status: 'Production',
    tags: ['Finance', 'Reports', 'Compliance'],
    certification: 'certified',
    stewards: ['Admin User', 'Data Steward'],
    governance: {
      complianceStatus: 'Compliant',
      policies: [
        {
          name: 'Financial Reporting Policy',
          description: 'Reports must be approved by CFO',
          status: 'Active'
        },
        {
          name: 'Audit Trail Policy',
          description: 'All changes must be tracked with audit trail',
          status: 'Active'
        }
      ]
    },
    qualityMetrics: {
      completeness: 100,
      accuracy: 100,
      consistency: 100
    }
  }
];

// Sample Policies
const policies = [
  {
    name: 'Data Retention Policy',
    description: 'Defines how long different types of data should be retained before being archived or deleted. This ensures regulatory compliance while optimizing storage costs.',
    category: 'Compliance',
    status: 'Active',
    version: '2.1',
    effectiveDate: new Date('2023-01-01'),
    affectedDomains: ['Finance', 'HR', 'Sales', 'Marketing'],
    affectedAssetTypes: ['Database', 'Table', 'Document'],
    controls: [
      {
        name: 'Automated Archiving',
        description: 'System automatically archives data older than retention period',
        implementationStatus: 'Implemented'
      },
      {
        name: 'Deletion Workflows',
        description: 'Approval workflow for data deletion',
        implementationStatus: 'Implemented'
      }
    ],
    relatedRegulations: [
      {
        name: 'GDPR',
        description: 'General Data Protection Regulation',
        url: 'https://gdpr.eu/'
      },
      {
        name: 'CCPA',
        description: 'California Consumer Privacy Act',
        url: 'https://oag.ca.gov/privacy/ccpa'
      }
    ]
  },
  {
    name: 'Data Access Policy',
    description: 'Defines who has access to what data and under what circumstances. This policy enforces the principle of least privilege to protect sensitive information.',
    category: 'Security',
    status: 'Active',
    version: '1.5',
    effectiveDate: new Date('2023-02-15'),
    affectedDomains: ['All'],
    affectedAssetTypes: ['All'],
    controls: [
      {
        name: 'Role-Based Access Control',
        description: 'Access based on defined roles',
        implementationStatus: 'Implemented'
      },
      {
        name: 'Access Auditing',
        description: 'Regular audits of access patterns',
        implementationStatus: 'Implemented'
      }
    ],
    relatedRegulations: [
      {
        name: 'SOX',
        description: 'Sarbanes-Oxley Act',
        url: 'https://www.sec.gov/spotlight/sarbanes-oxley.htm'
      }
    ]
  },
  {
    name: 'Data Quality Policy',
    description: 'Establishes standards and procedures for ensuring data quality across the organization, focusing on accuracy, completeness, and consistency.',
    category: 'Data Quality',
    status: 'Active',
    version: '1.0',
    effectiveDate: new Date('2023-03-10'),
    affectedDomains: ['All'],
    affectedAssetTypes: ['Database', 'Table', 'API'],
    controls: [
      {
        name: 'Data Profiling',
        description: 'Regular profiling of datasets',
        implementationStatus: 'Implemented'
      },
      {
        name: 'Quality Metrics',
        description: 'Tracking of quality KPIs',
        implementationStatus: 'In Progress'
      }
    ]
  },
  {
    name: 'Data Classification Policy',
    description: 'Defines the classification levels for data based on sensitivity and criticality, and outlines handling requirements for each level.',
    category: 'Security',
    status: 'Under Review',
    version: '2.0',
    effectiveDate: new Date('2023-04-01'),
    affectedDomains: ['All'],
    affectedAssetTypes: ['All'],
    controls: [
      {
        name: 'Data Labeling',
        description: 'Automated classification and labeling',
        implementationStatus: 'In Progress'
      },
      {
        name: 'Handling Procedures',
        description: 'Procedures for each classification level',
        implementationStatus: 'Not Started'
      }
    ]
  }
];

// Seed Database
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await DataAsset.deleteMany();
    await Policy.deleteMany();
    
    console.log('Database cleared...');
    
    // Create users with hashed passwords
    const hashedUsers = await Promise.all(users.map(async user => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      return user;
    }));
    
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`${createdUsers.length} users created`);
    
    // Create data assets
    const createdAssets = await DataAsset.insertMany(dataAssets);
    console.log(`${createdAssets.length} data assets created`);
    
    // Create policies with reference to admin user
    const adminUser = createdUsers.find(user => user.role === 'admin');
    
    const policiesWithOwner = policies.map(policy => {
      return { 
        ...policy, 
        owner: adminUser._id,
        approvers: [adminUser._id]
      };
    });
    
    const createdPolicies = await Policy.insertMany(policiesWithOwner);
    console.log(`${createdPolicies.length} policies created`);
    
    console.log('Data import completed successfully');
    process.exit(0);
  } catch (err) {
    console.error(`Error importing data: ${err.message}`);
    process.exit(1);
  }
};

// Delete all data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await DataAsset.deleteMany();
    await Policy.deleteMany();
    
    console.log('All data deleted successfully');
    process.exit(0);
  } catch (err) {
    console.error(`Error deleting data: ${err.message}`);
    process.exit(1);
  }
};

// Check command line arguments for action
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete');
  process.exit(1);
}
