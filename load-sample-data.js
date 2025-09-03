/**
 * Sample Data Loader Script for Data Literacy Support Application
 * 
 * This script adds sample data assets and related entities to the MongoDB database
 * to demonstrate the various asset types available in a MATRIX-like data catalog.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URL
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Define schemas that match your existing models
const DataAssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Database', 'Data Warehouse', 'API', 'File', 'Report', 'Dashboard', 'Business Term', 'Policy', 'Schema', 'Table', 'Column']
  },
  domain: {
    type: String,
    required: true,
    enum: ['Customer', 'Finance', 'Marketing', 'Operations', 'Product', 'HR']
  },
  owner: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft', 'pending'],
    default: 'active'
  },
  tags: [String],
  certification: {
    type: String,
    enum: ['certified', 'pending', 'none'],
    default: 'none'
  },
  stewards: [String],
  relatedAssets: [{
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DataAsset'
    },
    relationshipType: String
  }],
  governance: {
    policies: [{
      name: String,
      description: String,
      status: String
    }],
    compliance: [{
      regulation: String,
      status: String,
      lastChecked: Date
    }],
    dataQuality: {
      score: Number,
      lastChecked: Date,
      dimensions: {
        completeness: Number,
        accuracy: Number,
        consistency: Number,
        timeliness: Number
      }
    }
  },
  lineage: {
    upstream: [{
      assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataAsset'
      },
      relationship: String
    }],
    downstream: [{
      assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataAsset'
      },
      relationship: String
    }]
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    version: {
      type: Number,
      default: 1
    },
    source: String,
    sourceUrl: String
  },
  technicalMetadata: {
    format: String,
    size: String,
    location: String,
    lastRefreshed: Date,
    schema: String
  },
  accessibility: {
    isAccessible: Boolean,
    accessLevel: {
      type: String,
      enum: ['public', 'internal', 'confidential', 'restricted'],
      default: 'internal'
    },
    accessInstructions: String
  }
});

// Create a model from the schema
const DataAsset = mongoose.model('DataAsset', DataAssetSchema);

// Sample data records for different asset types
const sampleDataAssets = [
  // Database assets
  {
    name: "Customer Data Warehouse 567",
    type: "Data Warehouse",
    domain: "Customer",
    owner: "Data Engineering Team",
    description: "Central repository for all customer data including profiles, interactions, and preferences.",
    status: "active",
    tags: ["customer", "warehouse", "profiles"],
    certification: "certified",
    stewards: ["Jane Doe", "John Smith"],
    governance: {
      policies: [
        {
          name: "Data Retention Policy",
          description: "Customer data is retained for 7 years after last activity",
          status: "active"
        }
      ],
      compliance: [
        {
          regulation: "GDPR",
          status: "compliant",
          lastChecked: new Date()
        },
        {
          regulation: "CCPA",
          status: "compliant",
          lastChecked: new Date()
        }
      ],
      dataQuality: {
        score: 0.92,
        lastChecked: new Date(),
        dimensions: {
          completeness: 0.95,
          accuracy: 0.9,
          consistency: 0.94,
          timeliness: 0.89
        }
      }
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      source: "Snowflake",
      sourceUrl: "snowflake://customer-warehouse"
    },
    technicalMetadata: {
      format: "SQL",
      size: "2.3 TB",
      location: "us-east-1",
      lastRefreshed: new Date(),
      schema: "customer_schema"
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "confidential",
      accessInstructions: "Request access through data governance portal"
    }
  },
  {
    name: "Financial Data Lake",
    type: "Database",
    domain: "Finance",
    owner: "Finance Analytics",
    description: "Comprehensive financial data lake containing transaction records, financial reporting, and budget allocation data.",
    status: "active",
    tags: ["finance", "transactions", "reports"],
    certification: "certified",
    stewards: ["Robert Johnson", "Maria Garcia"],
    governance: {
      policies: [
        {
          name: "Financial Data Access Policy",
          description: "Access to financial data requires managerial approval and quarterly review",
          status: "active"
        }
      ],
      compliance: [
        {
          regulation: "SOX",
          status: "compliant",
          lastChecked: new Date()
        }
      ],
      dataQuality: {
        score: 0.97,
        lastChecked: new Date(),
        dimensions: {
          completeness: 0.98,
          accuracy: 0.97,
          consistency: 0.96,
          timeliness: 0.95
        }
      }
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 2,
      source: "Amazon Redshift",
      sourceUrl: "redshift://finance-data-lake"
    },
    technicalMetadata: {
      format: "SQL",
      size: "1.8 TB",
      location: "us-west-2",
      lastRefreshed: new Date(),
      schema: "finance_schema"
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "restricted",
      accessInstructions: "SOX compliance verification required"
    }
  },
  
  // API assets
  {
    name: "Customer Profile API",
    type: "API",
    domain: "Customer",
    owner: "API Management Team",
    description: "RESTful API providing access to customer profile data including preferences and consent management.",
    status: "active",
    tags: ["api", "rest", "customer profiles"],
    certification: "certified",
    stewards: ["Alex Wong", "Priya Patel"],
    governance: {
      policies: [
        {
          name: "API Rate Limiting Policy",
          description: "Maximum 1000 requests per minute per authenticated client",
          status: "active"
        }
      ],
      dataQuality: {
        score: 0.95,
        lastChecked: new Date(),
        dimensions: {
          completeness: 0.94,
          accuracy: 0.96,
          consistency: 0.95,
          timeliness: 0.96
        }
      }
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 3,
      source: "API Gateway",
      sourceUrl: "https://api.example.com/customer/v3"
    },
    technicalMetadata: {
      format: "JSON",
      location: "global",
      lastRefreshed: new Date(),
      schema: "OpenAPI 3.0"
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "internal",
      accessInstructions: "API key required, request through developer portal"
    }
  },
  {
    name: "Marketing Analytics API",
    type: "API",
    domain: "Marketing",
    owner: "Marketing Technology",
    description: "GraphQL API providing campaign performance metrics and audience segmentation data.",
    status: "active",
    tags: ["api", "graphql", "marketing", "analytics"],
    certification: "certified",
    stewards: ["Emma Thompson", "Carlos Rodriguez"],
    governance: {
      policies: [
        {
          name: "Data Freshness Policy",
          description: "API data refreshed hourly for real-time campaign decisions",
          status: "active"
        }
      ],
      dataQuality: {
        score: 0.93,
        lastChecked: new Date(),
        dimensions: {
          completeness: 0.91,
          accuracy: 0.93,
          consistency: 0.94,
          timeliness: 0.95
        }
      }
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 2,
      source: "Apollo GraphQL",
      sourceUrl: "https://api.example.com/marketing/graphql"
    },
    technicalMetadata: {
      format: "GraphQL",
      location: "global",
      lastRefreshed: new Date(),
      schema: "marketing_schema.graphql"
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "internal",
      accessInstructions: "OAuth2 authentication required"
    }
  },
  
  // Report assets
  {
    name: "Quarterly Financial Report",
    type: "Report",
    domain: "Finance",
    owner: "Financial Reporting Team",
    description: "Comprehensive quarterly financial statements including P&L, balance sheets, and cash flow analysis.",
    status: "active",
    tags: ["financial", "quarterly", "reporting"],
    certification: "certified",
    stewards: ["David Kim", "Jennifer Lopez"],
    governance: {
      policies: [
        {
          name: "Financial Reporting Policy",
          description: "Reports must be reviewed by the CFO before distribution",
          status: "active"
        }
      ],
      compliance: [
        {
          regulation: "SOX",
          status: "compliant",
          lastChecked: new Date()
        },
        {
          regulation: "GAAP",
          status: "compliant",
          lastChecked: new Date()
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 12,
      source: "Tableau",
      sourceUrl: "tableau://finance-reporting/quarterly-report"
    },
    technicalMetadata: {
      format: "PDF/Excel",
      location: "finance-reports",
      lastRefreshed: new Date()
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "confidential",
      accessInstructions: "Available to Finance team and executives"
    }
  },
  {
    name: "Customer Churn Analysis",
    type: "Report",
    domain: "Customer",
    owner: "Customer Success Team",
    description: "Monthly analysis of customer churn patterns, retention metrics, and risk factors.",
    status: "active",
    tags: ["churn", "retention", "customer success"],
    certification: "certified",
    stewards: ["Sarah Mitchell", "James Wilson"],
    governance: {
      policies: [
        {
          name: "Customer Data Privacy Policy",
          description: "All identifiable customer information must be anonymized",
          status: "active"
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 5,
      source: "Power BI",
      sourceUrl: "powerbi://reports/customer-success/churn-analysis"
    },
    technicalMetadata: {
      format: "Power BI Dashboard",
      location: "cs-reports",
      lastRefreshed: new Date()
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "internal",
      accessInstructions: "Available to Customer Success and Sales teams"
    }
  },
  
  // Dashboard assets
  {
    name: "Executive KPI Dashboard",
    type: "Dashboard",
    domain: "Operations",
    owner: "Business Intelligence Team",
    description: "Real-time visualization of key performance indicators for executive leadership.",
    status: "active",
    tags: ["kpi", "executive", "metrics"],
    certification: "certified",
    stewards: ["Michael Brown", "Linda Chen"],
    governance: {
      policies: [
        {
          name: "Data Accuracy Policy",
          description: "All metrics must be validated before inclusion",
          status: "active"
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 8,
      source: "Looker",
      sourceUrl: "looker://dashboards/executive-kpi"
    },
    technicalMetadata: {
      format: "Looker Dashboard",
      location: "executive-dashboards",
      lastRefreshed: new Date()
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "restricted",
      accessInstructions: "Available to Director level and above"
    }
  },
  {
    name: "Marketing Campaign Performance",
    type: "Dashboard",
    domain: "Marketing",
    owner: "Digital Marketing Team",
    description: "Interactive dashboard showing campaign performance metrics, ROI, and audience engagement.",
    status: "active",
    tags: ["marketing", "campaigns", "performance"],
    certification: "certified",
    stewards: ["Nicole Taylor", "Ryan Jackson"],
    governance: {
      policies: [
        {
          name: "Attribution Policy",
          description: "Multi-touch attribution model must be applied consistently",
          status: "active"
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 4,
      source: "Google Data Studio",
      sourceUrl: "datastudio://marketing/campaign-performance"
    },
    technicalMetadata: {
      format: "Data Studio Dashboard",
      location: "marketing-dashboards",
      lastRefreshed: new Date()
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "internal",
      accessInstructions: "Available to Marketing team members"
    }
  },
  
  // Business Term assets
  {
    name: "Customer Lifetime Value",
    type: "Business Term",
    domain: "Customer",
    owner: "Data Governance Team",
    description: "The predicted net profit attributed to the entire future relationship with a customer.",
    status: "active",
    tags: ["business term", "customer", "finance"],
    certification: "certified",
    stewards: ["Amanda Lee", "Thomas White"],
    governance: {
      policies: [
        {
          name: "Term Definition Policy",
          description: "All business terms must have a clear definition and calculation methodology",
          status: "active"
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 2,
      source: "Business Glossary"
    }
  },
  {
    name: "Qualified Sales Lead",
    type: "Business Term",
    domain: "Marketing",
    owner: "Sales Operations",
    description: "A prospect that meets defined criteria indicating readiness to purchase and fit with product offerings.",
    status: "active",
    tags: ["business term", "sales", "marketing"],
    certification: "certified",
    stewards: ["Daniel Moore", "Emily Carter"],
    governance: {
      policies: [
        {
          name: "Term Usage Policy",
          description: "Term must be consistently applied across all sales reporting",
          status: "active"
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 3,
      source: "Business Glossary"
    }
  },
  
  // Policy assets
  {
    name: "Data Retention Policy",
    type: "Policy",
    domain: "Operations",
    owner: "Information Security",
    description: "Guidelines for how long different types of data should be stored before deletion or archiving.",
    status: "active",
    tags: ["policy", "retention", "compliance"],
    certification: "certified",
    stewards: ["Christopher Adams", "Rachel Green"],
    governance: {
      policies: [
        {
          name: "Policy Review Policy",
          description: "All policies must be reviewed annually",
          status: "active"
        }
      ],
      compliance: [
        {
          regulation: "GDPR",
          status: "compliant",
          lastChecked: new Date()
        },
        {
          regulation: "CCPA",
          status: "compliant",
          lastChecked: new Date()
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 2,
      source: "Policy Repository"
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "internal",
      accessInstructions: "Available to all employees"
    }
  },
  {
    name: "Data Access Control Policy",
    type: "Policy",
    domain: "HR",
    owner: "Information Security",
    description: "Framework for managing access rights to sensitive employee data and systems.",
    status: "active",
    tags: ["policy", "access control", "security"],
    certification: "certified",
    stewards: ["Michelle Johnson", "Brian Williams"],
    governance: {
      policies: [
        {
          name: "Policy Review Policy",
          description: "All policies must be reviewed annually",
          status: "active"
        }
      ],
      compliance: [
        {
          regulation: "ISO 27001",
          status: "compliant",
          lastChecked: new Date()
        }
      ]
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 3,
      source: "Policy Repository"
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "internal",
      accessInstructions: "Available to all employees"
    }
  },
  
  // Table assets
  {
    name: "Product Catalog",
    type: "Table",
    domain: "Product",
    owner: "Product Database Team",
    description: "Central table containing all product information including SKUs, descriptions, and pricing.",
    status: "active",
    tags: ["table", "products", "catalog"],
    certification: "certified",
    stewards: ["Kevin Lee", "Angela Martin"],
    governance: {
      dataQuality: {
        score: 0.96,
        lastChecked: new Date(),
        dimensions: {
          completeness: 0.97,
          accuracy: 0.96,
          consistency: 0.95,
          timeliness: 0.96
        }
      }
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 5,
      source: "PostgreSQL",
      sourceUrl: "postgres://product-db/catalog"
    },
    technicalMetadata: {
      format: "SQL Table",
      size: "2.3 GB",
      location: "product-db",
      lastRefreshed: new Date(),
      schema: "product_schema"
    }
  },
  {
    name: "Employee Records",
    type: "Table",
    domain: "HR",
    owner: "HR Data Management",
    description: "Primary table for employee information including personal details, roles, and compensation.",
    status: "active",
    tags: ["table", "employees", "hr"],
    certification: "certified",
    stewards: ["Patricia Harris", "Steven Lewis"],
    governance: {
      policies: [
        {
          name: "Employee Data Privacy Policy",
          description: "Access restricted to HR personnel with need-to-know basis",
          status: "active"
        }
      ],
      dataQuality: {
        score: 0.98,
        lastChecked: new Date(),
        dimensions: {
          completeness: 0.99,
          accuracy: 0.98,
          consistency: 0.97,
          timeliness: 0.98
        }
      }
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 8,
      source: "MySQL",
      sourceUrl: "mysql://hr-db/employees"
    },
    technicalMetadata: {
      format: "SQL Table",
      size: "1.5 GB",
      location: "hr-db",
      lastRefreshed: new Date(),
      schema: "hr_schema"
    },
    accessibility: {
      isAccessible: true,
      accessLevel: "restricted",
      accessInstructions: "Available only to HR personnel and approved managers"
    }
  }
];

// Function to load sample data
const loadSampleData = async () => {
  try {
    // First, connect to MongoDB
    await connectDB();
    
    // Clear existing data assets (optional - comment out if you want to keep existing data)
    // await DataAsset.deleteMany({});
    
    console.log('Loading sample data assets...');
    
    // Insert all sample data assets
    const results = await DataAsset.insertMany(sampleDataAssets);
    
    console.log(`Successfully loaded ${results.length} sample data assets!`);
    
    // Create some relationships between assets
    // This can be enhanced further based on specific needs
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
    
    console.log('Sample data loading complete!');
  } catch (error) {
    console.error('Error loading sample data:', error);
    process.exit(1);
  }
};

// Run the data loader
loadSampleData();
