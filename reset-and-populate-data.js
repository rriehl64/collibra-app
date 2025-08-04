require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./server/config/db');

// Connect to database
connectDB();

// Define DataAsset schema
const DataAssetSchema = new mongoose.Schema({
  name: String,
  type: String,
  domain: String,
  owner: String,
  description: String,
  lastModified: Date,
  status: String,
  tags: [String],
  certification: String,
  lineage: {
    sources: [String],
    targets: [String]
  },
  metadata: {
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  }
});

// Define collection name explicitly to ensure consistency
const DataAsset = mongoose.model('DataAsset', DataAssetSchema, 'dataassets');

// Sample data creation function
async function resetAndPopulateData() {
  try {
    // 1. Delete all existing data assets
    console.log('Deleting all existing data assets...');
    await DataAsset.deleteMany({});
    console.log('All existing data assets deleted successfully.');

    // 2. Define domains and types
    const domains = [
      'Customer', 
      'Finance', 
      'Marketing', 
      'Operations', 
      'Product', 
      'HR', 
      'Legal', 
      'IT'
    ];
    
    const types = [
      'Database', 
      'Data Warehouse', 
      'Table', 
      'Report', 
      'Dashboard', 
      'API', 
      'Schema', 
      'Business Term'
    ];
    
    const owners = [
      'Data Management Team',
      'John Doe',
      'Jane Smith',
      'Data Governance Team',
      'Analytics Team',
      'Marketing Analytics Team',
      'Financial Data Team',
      'Customer Insights Team'
    ];
    
    const certifications = ['certified', 'pending', 'none'];
    
    const statuses = ['Development', 'Production', 'Archived', 'Deprecated'];

    // 3. Create at least 32 assets with varied domains and types
    const assets = [];
    let assetCount = 0;

    // First ensure at least one asset for each domain-type combination
    for (const domain of domains) {
      for (const type of types) {
        if (assetCount < 32) {
          // Create a descriptive name for this combination
          const name = `${domain} ${type} ${assetCount + 1}`;
          const owner = owners[Math.floor(Math.random() * owners.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const certification = certifications[Math.floor(Math.random() * certifications.length)];
          
          // Generate 1-3 random tags
          const allTags = ['important', 'reviewed', 'sensitive', 'public', 'internal', 'verified', 'confidential'];
          const tagCount = Math.floor(Math.random() * 3) + 1;
          const tags = [];
          for (let i = 0; i < tagCount; i++) {
            const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
            if (!tags.includes(randomTag)) {
              tags.push(randomTag);
            }
          }
          
          // Create description based on domain and type
          let description;
          if (type === 'Database' || type === 'Data Warehouse') {
            description = `Central repository for ${domain.toLowerCase()} data including detailed records and historical information.`;
          } else if (type === 'Table') {
            description = `Core ${domain.toLowerCase()} data table containing structured information for analysis and reporting.`;
          } else if (type === 'Report' || type === 'Dashboard') {
            description = `Key ${domain.toLowerCase()} insights and metrics visualized for business decision making.`;
          } else if (type === 'API') {
            description = `Interface for programmatic access to ${domain.toLowerCase()} data services and functionality.`;
          } else if (type === 'Schema') {
            description = `Structural definition of ${domain.toLowerCase()} data relationships and constraints.`;
          } else {
            description = `Business terminology and concepts related to ${domain.toLowerCase()} operations.`;
          }
          
          // Create asset object
          const asset = {
            name,
            type,
            domain,
            owner,
            description,
            lastModified: new Date(),
            status,
            tags,
            certification,
            lineage: {
              sources: [],
              targets: []
            },
            metadata: {
              createdBy: 'System',
              createdDate: new Date(),
              updatedBy: 'System',
              updatedDate: new Date()
            }
          };
          
          assets.push(asset);
          assetCount++;
        }
      }
    }
    
    // Add any remaining assets to reach 32 if needed
    while (assetCount < 32) {
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const name = `${domain} ${type} Extra ${assetCount - 24}`;
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const certification = certifications[Math.floor(Math.random() * certifications.length)];
      
      const tags = ['additional', 'sample'];
      
      const description = `Additional sample ${domain.toLowerCase()} ${type.toLowerCase()} for testing purposes.`;
      
      const asset = {
        name,
        type,
        domain,
        owner,
        description,
        lastModified: new Date(),
        status,
        tags,
        certification,
        lineage: {
          sources: [],
          targets: []
        },
        metadata: {
          createdBy: 'System',
          createdDate: new Date(),
          updatedBy: 'System',
          updatedDate: new Date()
        }
      };
      
      assets.push(asset);
      assetCount++;
    }

    // 4. Insert assets with consistent IDs
    console.log(`Creating ${assets.length} new data assets...`);
    
    // Add Customer Data Warehouse with name "Customer Data Warehouse 567" specifically
    // to match what was expected in the frontend
    const customerWarehouseIndex = assets.findIndex(asset => 
      asset.domain === 'Customer' && asset.type === 'Data Warehouse');
    
    if (customerWarehouseIndex !== -1) {
      assets[customerWarehouseIndex].name = "Customer Data Warehouse 567";
      assets[customerWarehouseIndex].description = "Central repository for customer data including demographics, transactions, and preferences.";
    }
    
    // Insert all assets to the database
    const insertedAssets = await DataAsset.insertMany(assets);
    
    // 5. Log created assets
    console.log(`Successfully created ${insertedAssets.length} data assets:`);
    insertedAssets.forEach(asset => {
      console.log(`- ${asset.name} (ID: ${asset._id}, Domain: ${asset.domain}, Type: ${asset.type})`);
    });
    
    // Special log for Customer Data Warehouse
    const customerWarehouse = insertedAssets.find(asset => asset.name === "Customer Data Warehouse 567");
    if (customerWarehouse) {
      console.log('\nSpecial asset created:');
      console.log(`Name: ${customerWarehouse.name}`);
      console.log(`ID: ${customerWarehouse._id}`);
      console.log(`Type: ${customerWarehouse.type}`);
      console.log(`Domain: ${customerWarehouse.domain}`);
    }

    // Close the database connection
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
    console.log('\nData reset and population completed successfully!');
  } catch (error) {
    console.error('Error resetting and populating data:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the function
resetAndPopulateData();
