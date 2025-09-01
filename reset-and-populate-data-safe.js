const mongoose = require('mongoose');
const { safeDelete, validateEnvironment, cleanup } = require('./utils/dataProtection');
require('dotenv').config();

// Import models
const DataAsset = require('./server/models/DataAsset');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Sample data generation function
const generateSampleAssets = (domains, types, count = 100) => {
  const owners = ['Data Team', 'IT Department', 'Finance Department', 'HR Team', 'Marketing Team'];
  const statuses = ['Active', 'Inactive', 'Development', 'Testing', 'Archived'];
  const people = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
  
  const assets = [];
  
  for (let i = 0; i < count; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    assets.push({
      name: `${domain} ${type} ${i + 1}`,
      type,
      domain,
      owner: owners[Math.floor(Math.random() * owners.length)],
      description: `Sample ${type.toLowerCase()} for ${domain.toLowerCase()} domain - generated for testing purposes`,
      status,
      tags: ['sample', 'generated', domain.toLowerCase()],
      certification: ['none', 'bronze', 'silver', 'gold'][Math.floor(Math.random() * 4)],
      lineage: { sources: [], targets: [] },
      metadata: {
        createdBy: people[Math.floor(Math.random() * people.length)],
        createdDate: new Date(),
        updatedBy: people[Math.floor(Math.random() * people.length)],
        updatedDate: new Date()
      },
      governance: {
        complianceStatus: ['Compliant', 'Non-Compliant', 'Under Review'][Math.floor(Math.random() * 3)],
        policies: ['Data Retention Policy', 'Privacy Policy']
      },
      qualityMetrics: {
        completeness: Math.floor(Math.random() * 40) + 60,
        accuracy: Math.floor(Math.random() * 40) + 60,
        consistency: Math.floor(Math.random() * 40) + 60
      },
      relatedAssets: [],
      stewards: [people[Math.floor(Math.random() * people.length)]],
      updatedAt: new Date()
    });
  }
  
  return assets;
};

// Main reset and populate function with safety measures
const resetAndPopulateData = async () => {
  const args = process.argv.slice(2);
  const forceFlag = args.includes('--force') || args.includes('-f');
  const countArg = args.find(arg => arg.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1]) : 100;
  
  if (!forceFlag) {
    console.log('Usage: node reset-and-populate-data-safe.js [--force] [--count=N]');
    console.log('');
    console.log('⚠️  This script will DELETE ALL existing data assets and create new sample data.');
    console.log('');
    console.log('Options:');
    console.log('  --force     Skip confirmation prompts (DANGEROUS)');
    console.log('  --count=N   Number of sample records to create (default: 100)');
    console.log('');
    console.log('Safety Features:');
    console.log('  • Automatic backup creation before deletion');
    console.log('  • Environment validation (dev/test only)');
    console.log('  • User confirmation required');
    console.log('');
    process.exit(1);
  }

  try {
    // Validate environment
    validateEnvironment(['development', 'test']);
    
    await connectDB();
    
    console.log(`🔄 Reset and populate with ${count} sample records`);
    
    // Safe deletion with backup and confirmation
    await safeDelete(DataAsset, {}, { 
      skipConfirmation: forceFlag,
      skipBackup: false 
    });
    
    // Define sample domains and types
    const domains = [
      'Finance', 'HR', 'Marketing', 'Sales', 'Operations', 'IT', 'Legal', 'Compliance',
      'Customer Service', 'Product', 'Analytics', 'Security', 'Quality', 'Audit'
    ];
    
    const types = [
      'Database', 'Table', 'View', 'Report', 'Dashboard', 'API', 'File', 'Dataset',
      'Data Warehouse', 'ETL Process', 'Data Pipeline'
    ];
    
    console.log(`📝 Generating ${count} sample data assets...`);
    const sampleAssets = generateSampleAssets(domains, types, count);
    
    console.log('💾 Inserting sample data assets...');
    await DataAsset.insertMany(sampleAssets);
    
    const totalCount = await DataAsset.countDocuments();
    console.log(`✅ Successfully created ${totalCount} sample data assets`);
    
    // Show statistics
    const statusCounts = await DataAsset.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Status Distribution:');
    statusCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });
    
  } catch (error) {
    console.error('❌ Error during reset and populate:', error);
    process.exit(1);
  } finally {
    cleanup();
    mongoose.connection.close();
  }
};

// Run the script
if (require.main === module) {
  resetAndPopulateData();
}

module.exports = { resetAndPopulateData };
