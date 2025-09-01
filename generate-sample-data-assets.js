const mongoose = require('mongoose');
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
  'Customer', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Compliance', 
  'Security', 'Analytics', 'Reporting', 'Integration', 'Master Data', 'Reference Data',
  'Transactional', 'Historical', 'Real-time', 'Batch', 'Streaming'
];

const owners = [
  'Analytics Team', 'Data Engineering', 'Business Intelligence', 'IT Operations',
  'Finance Department', 'HR Department', 'Marketing Team', 'Sales Operations',
  'Compliance Office', 'Security Team', 'Product Management', 'Customer Service',
  'Data Science Team', 'Architecture Team', 'Quality Assurance'
];

const statuses = ['Active', 'Deprecated', 'Development', 'Testing', 'Archived', 'Pending Review'];

const certifications = ['none', 'bronze', 'silver', 'gold', 'platinum'];

const complianceStatuses = ['Compliant', 'Non-Compliant', 'Under Review', 'Unknown', 'Exempt'];

const tags = [
  'sensitive', 'pii', 'financial', 'customer-data', 'internal', 'public', 'confidential',
  'gdpr', 'hipaa', 'sox', 'critical', 'high-volume', 'real-time', 'batch', 'archived',
  'master-data', 'reference', 'transactional', 'analytical', 'reporting'
];

const policies = [
  'Data Retention Policy', 'Privacy Policy', 'Security Policy', 'Access Control Policy',
  'Data Quality Policy', 'Backup Policy', 'Encryption Policy', 'GDPR Compliance',
  'SOX Compliance', 'HIPAA Compliance', 'Data Classification Policy'
];

const stewards = [
  'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown',
  'Lisa Garcia', 'Robert Davis', 'Emily Chen', 'Michael Rodriguez', 'Jennifer Lee',
  'Christopher Taylor', 'Amanda Martinez', 'Daniel Anderson', 'Michelle Thompson',
  'Kevin White', 'Rachel Green', 'Steven Clark', 'Nicole Lewis', 'Brian Walker',
  'Jessica Hall', 'Ryan Allen', 'Ashley Young', 'Justin King', 'Stephanie Wright'
];

// Function to generate random sample from array
function randomSample(arr, count = 1) {
  if (count === 1) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to generate random number in range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate random date in the past year
function randomDate() {
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
}

// Enhanced description templates with variety
const descriptionTemplates = [
  // Business-focused descriptions
  (type, domain) => `Strategic ${type.toLowerCase()} supporting ${domain.toLowerCase()} operations with comprehensive data management, automated workflows, and real-time insights for decision-making.`,
  (type, domain) => `Enterprise-grade ${type.toLowerCase()} designed for ${domain.toLowerCase()} analytics, featuring advanced data processing capabilities and integrated reporting functionality.`,
  (type, domain) => `Mission-critical ${type.toLowerCase()} serving ${domain.toLowerCase()} stakeholders with high-quality data assets, governance controls, and performance monitoring.`,
  
  // Technical-focused descriptions
  (type, domain) => `Scalable ${type.toLowerCase()} architecture optimized for ${domain.toLowerCase()} data processing, with built-in data validation, transformation pipelines, and audit trails.`,
  (type, domain) => `Cloud-native ${type.toLowerCase()} platform managing ${domain.toLowerCase()} information through automated ingestion, cleansing, and enrichment processes.`,
  (type, domain) => `High-performance ${type.toLowerCase()} solution delivering ${domain.toLowerCase()} data services with advanced security, encryption, and access control mechanisms.`,
  
  // Process-focused descriptions
  (type, domain) => `Integrated ${type.toLowerCase()} workflow supporting ${domain.toLowerCase()} business processes through data standardization, quality assurance, and compliance monitoring.`,
  (type, domain) => `Automated ${type.toLowerCase()} system facilitating ${domain.toLowerCase()} data operations with intelligent routing, error handling, and recovery capabilities.`,
  (type, domain) => `Collaborative ${type.toLowerCase()} environment enabling ${domain.toLowerCase()} teams to access, analyze, and share critical business information effectively.`,
  
  // Value-focused descriptions
  (type, domain) => `Strategic ${type.toLowerCase()} asset providing ${domain.toLowerCase()} insights through advanced analytics, machine learning models, and predictive capabilities.`,
  (type, domain) => `Comprehensive ${type.toLowerCase()} repository centralizing ${domain.toLowerCase()} knowledge with metadata management, lineage tracking, and impact analysis.`,
  (type, domain) => `Innovative ${type.toLowerCase()} platform transforming ${domain.toLowerCase()} operations through data-driven automation, intelligent alerts, and performance optimization.`
];

// Additional context elements for more variety
const technicalDetails = [
  'with 99.9% uptime SLA', 'featuring real-time synchronization', 'including automated backup systems',
  'with advanced encryption protocols', 'supporting multi-tenant architecture', 'featuring API-first design',
  'with built-in disaster recovery', 'including comprehensive logging', 'supporting horizontal scaling',
  'with integrated monitoring dashboards', 'featuring automated data profiling', 'including change data capture'
];

const businessContexts = [
  'supporting regulatory compliance requirements', 'enabling cross-functional collaboration',
  'driving operational efficiency improvements', 'facilitating strategic decision-making',
  'supporting customer experience initiatives', 'enabling data-driven innovation',
  'supporting risk management processes', 'facilitating audit and reporting needs',
  'enabling self-service analytics capabilities', 'supporting digital transformation goals'
];

const dataCharacteristics = [
  'processing over 1M records daily', 'maintaining 15+ years of historical data',
  'integrating with 20+ source systems', 'supporting real-time data streaming',
  'handling structured and unstructured data', 'providing sub-second query response',
  'maintaining 99.95% data accuracy', 'supporting 500+ concurrent users',
  'processing petabyte-scale datasets', 'enabling near real-time analytics'
];

// Function to generate varied descriptions
function generateDescription(type, domain) {
  const template = randomSample(descriptionTemplates);
  let description = template(type, domain);
  
  // Add technical detail (30% chance)
  if (Math.random() < 0.3) {
    description += ` This solution ${randomSample(technicalDetails)}.`;
  }
  
  // Add business context (40% chance)
  if (Math.random() < 0.4) {
    description += ` Specifically designed for ${randomSample(businessContexts)}.`;
  }
  
  // Add data characteristics (25% chance)
  if (Math.random() < 0.25) {
    description += ` Currently ${randomSample(dataCharacteristics)}.`;
  }
  
  return description;
}

// Function to generate a single data asset
function generateDataAsset(index) {
  const type = randomSample(assetTypes);
  const domain = randomSample(domains);
  const owner = randomSample(owners);
  const status = randomSample(statuses);
  const certification = randomSample(certifications);
  const complianceStatus = randomSample(complianceStatuses);
  
  const assetTags = randomSample(tags, randomInt(1, 4));
  const assetPolicies = randomSample(policies, randomInt(0, 3));
  const assetStewards = randomSample(stewards, randomInt(1, 2));
  
  const createdDate = randomDate();
  const updatedDate = new Date(createdDate.getTime() + Math.random() * (Date.now() - createdDate.getTime()));
  
  return {
    name: `${domain} ${type} ${index + 1}`,
    type,
    domain,
    owner,
    description: generateDescription(type, domain),
    lastModified: updatedDate,
    status,
    tags: assetTags,
    certification,
    lineage: {
      sources: Math.random() > 0.7 ? randomSample([`Source_${randomInt(1, 100)}`, `Input_${randomInt(1, 100)}`], randomInt(1, 2)) : [],
      targets: Math.random() > 0.7 ? randomSample([`Target_${randomInt(1, 100)}`, `Output_${randomInt(1, 100)}`], randomInt(1, 2)) : []
    },
    metadata: {
      createdBy: randomSample(stewards),
      createdDate,
      updatedBy: randomSample(stewards),
      updatedDate
    },
    governance: {
      complianceStatus,
      policies: assetPolicies
    },
    qualityMetrics: {
      completeness: randomInt(60, 100),
      accuracy: randomInt(70, 100),
      consistency: randomInt(65, 100)
    },
    relatedAssets: Math.random() > 0.8 ? randomSample([`Related_${randomInt(1, 50)}`, `Connected_${randomInt(1, 50)}`], randomInt(1, 2)) : [],
    stewards: assetStewards,
    updatedAt: updatedDate
  };
}

// Main function to generate and insert data assets
async function generateSampleDataAssets() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    const countArg = args.find(arg => arg.startsWith('--count='));
    const truncateFlag = args.includes('--truncate');
    
    const count = countArg ? parseInt(countArg.split('=')[1]) : 1000;
    
    if (isNaN(count) || count < 1 || count > 50000) {
      console.error('Count must be a number between 1 and 50000');
      process.exit(1);
    }
    
    console.log(`Generating ${count} sample data assets...`);
    
    // Truncate existing data if requested
    if (truncateFlag) {
      console.log('Truncating existing dataassets collection...');
      await DataAsset.deleteMany({});
      console.log('Existing data assets removed.');
    }
    
    // Generate data assets in batches for better performance
    const batchSize = 1000;
    const batches = Math.ceil(count / batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, count);
      const batchCount = endIndex - startIndex;
      
      console.log(`Generating batch ${batch + 1}/${batches} (${batchCount} records)...`);
      
      const dataAssets = [];
      for (let i = startIndex; i < endIndex; i++) {
        dataAssets.push(generateDataAsset(i));
      }
      
      await DataAsset.insertMany(dataAssets);
      console.log(`Batch ${batch + 1} inserted successfully.`);
    }
    
    const totalCount = await DataAsset.countDocuments();
    console.log(`\n✅ Successfully generated ${count} sample data assets!`);
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
    console.error('Error generating sample data assets:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
if (require.main === module) {
  generateSampleDataAssets();
}

module.exports = { generateSampleDataAssets };
