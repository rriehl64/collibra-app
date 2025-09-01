const mongoose = require('mongoose');
const { safeDelete, validateEnvironment, cleanup } = require('./utils/dataProtection');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support');

// Define the DataAsset schema (matching your existing model)
const dataAssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  domain: { type: String, required: true },
  owner: { type: String, required: true },
  description: { type: String, required: true },
  lastModified: { type: Date, default: Date.now },
  status: { type: String, required: true },
  tags: [String],
  certification: { type: String, default: 'none' },
  lineage: {
    sources: [String],
    targets: [String]
  },
  metadata: {
    createdBy: { type: String, default: 'System' },
    createdDate: { type: Date, default: Date.now },
    updatedBy: { type: String, default: 'System' },
    updatedDate: { type: Date, default: Date.now }
  },
  governance: {
    complianceStatus: { type: String, default: 'Unknown' },
    policies: [String]
  },
  qualityMetrics: {
    completeness: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    consistency: { type: Number, default: 0 }
  },
  relatedAssets: [String],
  stewards: [String],
  updatedAt: { type: Date, default: Date.now }
});

const DataAsset = mongoose.model('DataAsset', dataAssetSchema);

// Sample data arrays for generating realistic records
const assetTypes = [
  'Database', 'Table', 'View', 'Report', 'Dashboard', 'API', 'File', 'Dataset', 
  'Data Warehouse', 'Data Lake', 'ETL Process', 'Data Pipeline', 'Schema', 'Index'
];

const domains = [
  'Finance', 'HR', 'Marketing', 'Sales', 'Operations', 'IT', 'Legal', 'Compliance',
  'Customer Service', 'Product', 'Analytics', 'Security', 'Supply Chain', 'Quality',
  'Risk Management', 'Audit', 'Business Intelligence', 'Data Science', 'Engineering',
  'Procurement', 'Inventory', 'Logistics', 'Manufacturing', 'Research', 'Development',
  'Strategy', 'Planning', 'Reporting', 'Governance', 'Architecture', 'Infrastructure',
  'Cloud', 'Mobile', 'Web', 'Integration', 'Streaming', 'Batch', 'Real-time', 'Historical'
];

const owners = [
  'Data Team', 'IT Department', 'Finance Department', 'HR Team', 'Marketing Team',
  'Sales Team', 'Operations Team', 'Legal Team', 'Compliance Team', 'Security Team',
  'Analytics Team', 'Business Intelligence', 'Data Science Team', 'Engineering Team',
  'Architecture Team', 'Infrastructure Team', 'Cloud Team', 'Integration Team',
  'Quality Assurance', 'Risk Management', 'Audit Team', 'Strategy Team', 'Planning Team',
  'Customer Service', 'Product Team', 'Research Team', 'Development Team'
];

const statuses = ['Active', 'Inactive', 'Development', 'Testing', 'Archived', 'Deprecated'];

const certifications = ['none', 'bronze', 'silver', 'gold', 'platinum'];

const complianceStatuses = ['Compliant', 'Non-Compliant', 'Under Review', 'Exempt', 'Unknown'];

const policies = [
  'Data Retention Policy', 'Privacy Policy', 'Security Policy', 'Access Control Policy',
  'Data Quality Policy', 'Backup Policy', 'Encryption Policy', 'GDPR Compliance',
  'HIPAA Compliance', 'SOX Compliance', 'PCI DSS', 'Data Classification Policy'
];

const tags = [
  'critical', 'sensitive', 'public', 'internal', 'confidential', 'restricted',
  'financial', 'customer-data', 'employee-data', 'operational', 'analytical',
  'reporting', 'real-time', 'batch', 'streaming', 'historical', 'archived',
  'high-volume', 'low-latency', 'mission-critical', 'business-critical',
  'regulatory', 'compliance', 'audit', 'sox', 'gdpr', 'hipaa', 'pci'
];

const people = [
  'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown',
  'Lisa Davis', 'Robert Miller', 'Jennifer Lee', 'Michael Garcia', 'Emily Rodriguez',
  'Christopher Martinez', 'Amanda Anderson', 'Daniel Taylor', 'Jessica Thomas',
  'Matthew Jackson', 'Ashley White', 'Andrew Harris', 'Stephanie Martin',
  'Joshua Thompson', 'Michelle Garcia', 'Kevin Martinez', 'Nicole Robinson',
  'Ryan Clark', 'Rachel Rodriguez', 'Brandon Lewis', 'Heather Lee',
  'Jason Walker', 'Kimberly Hall', 'Justin Allen', 'Amy Young',
  'Jonathan Hernandez', 'Melissa King', 'Nicholas Wright', 'Deborah Lopez',
  'Jacob Hill', 'Sharon Scott', 'Tyler Green', 'Cynthia Adams',
  'Alexander Baker', 'Angela Gonzalez', 'Benjamin Nelson', 'Brenda Carter',
  'Samuel Mitchell', 'Rebecca Perez', 'Gregory Roberts', 'Laura Turner',
  'Patrick Phillips', 'Carolyn Campbell', 'Steven Parker', 'Donna Evans',
  'Kenneth Edwards', 'Ruth Collins', 'Paul Stewart', 'Sharon Sanchez'
];

// Function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Function to get random items from array
const getRandomItems = (array, min = 1, max = 3) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to generate a single data asset
const generateDataAsset = (index) => {
  const type = getRandomItem(assetTypes);
  const domain = getRandomItem(domains);
  const status = getRandomItem(statuses);
  
  // Generate realistic names based on type and domain
  const nameTemplates = {
    'Database': [`${domain} Database`, `${domain} DB`, `${domain} Data Store`],
    'Table': [`${domain} Table`, `${domain} Records`, `${domain} Data`],
    'View': [`${domain} View`, `${domain} Summary`, `${domain} Report View`],
    'Report': [`${domain} Report`, `${domain} Analysis`, `${domain} Summary`],
    'Dashboard': [`${domain} Dashboard`, `${domain} Metrics`, `${domain} KPI Dashboard`],
    'API': [`${domain} API`, `${domain} Service`, `${domain} Endpoint`],
    'File': [`${domain} File`, `${domain} Export`, `${domain} Data File`],
    'Dataset': [`${domain} Dataset`, `${domain} Collection`, `${domain} Data Set`],
    'Data Warehouse': [`${domain} Warehouse`, `${domain} DW`, `${domain} Data Warehouse`],
    'Data Lake': [`${domain} Lake`, `${domain} Data Lake`, `${domain} Raw Data`],
    'ETL Process': [`${domain} ETL Process`, `${domain} ETL`, `${domain} Data Pipeline`],
    'Data Pipeline': [`${domain} Pipeline`, `${domain} Data Flow`, `${domain} Processing`],
    'Schema': [`${domain} Schema`, `${domain} Structure`, `${domain} Model`],
    'Index': [`${domain} Index`, `${domain} Search Index`, `${domain} Lookup`]
  };
  
  const nameOptions = nameTemplates[type] || [`${domain} ${type}`];
  const baseName = getRandomItem(nameOptions);
  const name = `${baseName} ${index + 1}`;
  
  // Generate description templates
  const descriptionTemplates = [
    `Enterprise-grade ${type.toLowerCase()} designed for ${domain.toLowerCase()} analytics, featuring advanced data processing capabilities and integrated reporting functionality.`,
    `High-performance ${type.toLowerCase()} solution delivering ${domain.toLowerCase()} data services with advanced security, encryption, and access control mechanisms.`,
    `Scalable ${type.toLowerCase()} architecture optimized for ${domain.toLowerCase()} data processing, with built-in data validation, transformation pipelines, and audit trails.`,
    `Mission-critical ${type.toLowerCase()} serving ${domain.toLowerCase()} stakeholders with high-quality data assets, governance controls, and performance monitoring.`,
    `Comprehensive ${type.toLowerCase()} platform supporting ${domain.toLowerCase()} operations through automated workflows, real-time processing, and advanced analytics capabilities.`
  ];
  
  const purposes = [
    'supporting risk management processes',
    'enabling data-driven decision making',
    'facilitating regulatory compliance',
    'optimizing business operations',
    'enhancing customer experience',
    'improving operational efficiency',
    'supporting strategic initiatives',
    'enabling business intelligence',
    'facilitating data governance',
    'supporting audit requirements',
    'enabling predictive analytics',
    'supporting compliance reporting',
    'facilitating data integration',
    'enabling real-time monitoring',
    'supporting performance management',
    'enabling data-driven innovation'
  ];
  
  const baseDescription = getRandomItem(descriptionTemplates);
  const purpose = getRandomItem(purposes);
  const description = `${baseDescription} Specifically designed for ${purpose}.`;
  
  // Generate random dates
  const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const updatedDate = new Date(createdDate.getTime() + Math.random() * (Date.now() - createdDate.getTime()));
  
  return {
    name,
    type,
    domain,
    owner: getRandomItem(owners),
    description,
    lastModified: updatedDate,
    status,
    tags: getRandomItems(tags, 1, 4),
    certification: getRandomItem(certifications),
    lineage: {
      sources: Math.random() > 0.7 ? getRandomItems([...Array(100)].map((_, i) => `Input_${i + 1}`), 0, 3) : [],
      targets: Math.random() > 0.8 ? getRandomItems([...Array(50)].map((_, i) => `Output_${i + 1}`), 0, 2) : []
    },
    metadata: {
      createdBy: getRandomItem(people),
      createdDate,
      updatedBy: getRandomItem(people),
      updatedDate
    },
    governance: {
      complianceStatus: getRandomItem(complianceStatuses),
      policies: Math.random() > 0.3 ? getRandomItems(policies, 1, 3) : []
    },
    qualityMetrics: {
      completeness: Math.floor(Math.random() * 41) + 60, // 60-100
      accuracy: Math.floor(Math.random() * 41) + 60,     // 60-100
      consistency: Math.floor(Math.random() * 41) + 60   // 60-100
    },
    relatedAssets: Math.random() > 0.6 ? getRandomItems([...Array(100)].map((_, i) => `Related_${i + 1}`), 0, 3) : [],
    stewards: getRandomItems(people, 1, 2),
    updatedAt: updatedDate
  };
};

// Main function to generate sample data assets with safety checks
async function generateSampleDataAssets() {
  const args = process.argv.slice(2);
  const countArg = args[0];
  const truncateFlag = args.includes('--truncate') || args.includes('-t');
  const forceFlag = args.includes('--force') || args.includes('-f');
  
  if (!countArg) {
    console.log('Usage: node generate-sample-data-assets-safe.js <count> [--truncate] [--force]');
    console.log('');
    console.log('Options:');
    console.log('  count      Number of data assets to generate (1-100000)');
    console.log('  --truncate Delete existing data before generating new data');
    console.log('  --force    Skip confirmation prompts (use with caution)');
    console.log('');
    console.log('Examples:');
    console.log('  node generate-sample-data-assets-safe.js 1000');
    console.log('  node generate-sample-data-assets-safe.js 5000 --truncate');
    process.exit(1);
  }
  
  const count = parseInt(countArg);
  
  try {
    // Validate environment
    validateEnvironment(['development', 'test']);
    
    if (isNaN(count) || count < 1 || count > 100000) {
      console.error('❌ Count must be a number between 1 and 100000');
      process.exit(1);
    }
    
    console.log(`🚀 Generating ${count} sample data assets...`);
    
    // Safe truncation with confirmation and backup
    if (truncateFlag) {
      console.log('⚠️  Truncate flag detected - existing data will be deleted');
      await safeDelete(DataAsset, {}, { 
        skipConfirmation: forceFlag,
        skipBackup: false 
      });
    }
    
    // Generate data assets in batches for better performance
    const batchSize = 1000;
    const batches = Math.ceil(count / batchSize);
    
    console.log(`📦 Processing ${batches} batches of ${batchSize} records each...`);
    
    for (let batch = 0; batch < batches; batch++) {
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, count);
      const batchCount = endIndex - startIndex;
      
      console.log(`📝 Generating batch ${batch + 1}/${batches} (${batchCount} records)...`);
      
      const dataAssets = [];
      for (let i = startIndex; i < endIndex; i++) {
        dataAssets.push(generateDataAsset(i));
      }
      
      await DataAsset.insertMany(dataAssets);
      console.log(`✅ Batch ${batch + 1} inserted successfully.`);
    }
    
    const totalCount = await DataAsset.countDocuments();
    console.log(`\n🎉 Successfully generated ${count} sample data assets!`);
    console.log(`📊 Total data assets in collection: ${totalCount}`);
    
    // Show some sample statistics
    const statusCounts = await DataAsset.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const domainCounts = await DataAsset.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    console.log('\n📈 Status Distribution:');
    statusCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });
    
    console.log('\n🏢 Top 10 Domains:');
    domainCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });
    
  } catch (error) {
    console.error('❌ Error generating sample data assets:', error);
    process.exit(1);
  } finally {
    cleanup();
    mongoose.connection.close();
  }
}

// Run the script
if (require.main === module) {
  generateSampleDataAssets();
}

module.exports = { generateSampleDataAssets };
