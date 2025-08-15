/**
 * Mock Data Migration Script
 * 
 * This script migrates mock data from JSON files to MongoDB collections.
 * It supports migrating data assets, domains, and other entities defined
 * in the src/mockData directory to proper database collections.
 * 
 * Usage:
 *   node migrate-mock-data.js [--all|--dataAssets|--domains|--clean]
 * 
 * Options:
 *   --all         : Migrate all mock data to collections
 *   --dataAssets  : Migrate only data assets
 *   --domains     : Migrate only domains
 *   --clean       : Clean collections before migration
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { promisify } = require('util');

// Load environment variables
dotenv.config();

// Import models
const DataAsset = require('./models/DataAsset');
const Domain = require('./models/Domain');
const BusinessProcess = require('./models/BusinessProcess');
const DataCategory = require('./models/DataCategory');
const DataConcept = require('./models/DataConcept');
const Policy = require('./models/Policy');

// Promisify fs functions
const readFile = promisify(fs.readFile);

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Utility function to read mock data
const loadMockData = async (filename) => {
  try {
    const filePath = path.join(__dirname, '..', 'src', 'mockData', filename);
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading mock data from ${filename}: ${error.message}`);
    return null;
  }
};

// Migration functions
const migrateDataAssets = async (clean = false) => {
  try {
    // Load mock data
    const mockData = await loadMockData('dataAssets.json');
    if (!mockData) return;

    const { dataAssets } = mockData;

    if (clean) {
      console.log('Cleaning DataAsset collection...');
      await DataAsset.deleteMany({});
    }

    console.log(`Found ${dataAssets.length} data assets in mock data`);

    // Transform data to match schema if necessary
    const formattedAssets = dataAssets.map(asset => {
      // Create a copy of the asset to avoid modifying the original
      const formattedAsset = { ...asset };

      // Add default values for required fields that might be missing
      if (!formattedAsset.stewards) formattedAsset.stewards = [];
      
      // Set up governance structure if missing
      if (!formattedAsset.governance) {
        formattedAsset.governance = {
          complianceStatus: 'Unknown',
          policies: []
        };
      }

      // Set up quality metrics if missing
      if (!formattedAsset.qualityMetrics) {
        formattedAsset.qualityMetrics = {
          completeness: 0,
          accuracy: 0,
          consistency: 0
        };
      }

      // Handle lineage data
      if (formattedAsset.lineage) {
        formattedAsset.relatedAssets = [];
        
        // Convert source relationships
        if (formattedAsset.lineage.sources && formattedAsset.lineage.sources.length > 0) {
          formattedAsset.lineage.sources.forEach(sourceId => {
            formattedAsset.relatedAssets.push({
              assetId: sourceId,
              relationshipType: 'source'
            });
          });
        }

        // Convert target relationships
        if (formattedAsset.lineage.targets && formattedAsset.lineage.targets.length > 0) {
          formattedAsset.lineage.targets.forEach(targetId => {
            formattedAsset.relatedAssets.push({
              assetId: targetId,
              relationshipType: 'derived'
            });
          });
        }

        // Delete the original lineage property as it's not in the schema
        delete formattedAsset.lineage;
      }

      return formattedAsset;
    });

    // Insert data assets
    const result = await DataAsset.insertMany(formattedAssets, { 
      ordered: false, // Continue inserting even if some documents fail
      rawResult: true // Get detailed results
    });

    console.log(`Successfully migrated ${result.insertedCount} data assets to database`);
    
    return {
      processed: dataAssets.length,
      inserted: result.insertedCount,
      errors: dataAssets.length - result.insertedCount
    };
  } catch (error) {
    console.error(`Error migrating data assets: ${error.message}`);
    
    // Handle bulk write errors
    if (error.writeErrors) {
      console.log(`Failed to insert ${error.writeErrors.length} documents`);
      error.writeErrors.forEach((writeError, index) => {
        console.log(`  Error ${index + 1}: ${writeError.errmsg || writeError.err?.message}`);
      });
    }
    
    return {
      processed: 0,
      inserted: 0,
      errors: 1
    };
  }
};

// Function to clean all collections
const cleanCollections = async () => {
  try {
    console.log('Cleaning all collections...');
    
    await Promise.all([
      DataAsset.deleteMany({}),
      Domain.deleteMany({}),
      BusinessProcess.deleteMany({}),
      DataCategory.deleteMany({}),
      DataConcept.deleteMany({}),
      Policy.deleteMany({})
    ]);
    
    console.log('All collections cleaned successfully');
  } catch (error) {
    console.error(`Error cleaning collections: ${error.message}`);
  }
};

// Main migration function
const runMigration = async () => {
  // Connect to database
  await connectDB();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const shouldClean = args.includes('--clean');
  
  // Check which migrations to run
  const migrateAll = args.includes('--all') || args.length === 0;
  const migrateDataAssetsOnly = args.includes('--dataAssets');
  
  try {
    if (shouldClean) {
      await cleanCollections();
    }
    
    // Execute migrations
    if (migrateAll || migrateDataAssetsOnly) {
      console.log('Starting data assets migration...');
      const dataAssetsResult = await migrateDataAssets(false);
      console.log('Data assets migration complete:', dataAssetsResult);
    }
    
    // Additional migrations can be added here
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
};

// Run the migration
runMigration();
