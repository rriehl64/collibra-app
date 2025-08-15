/**
 * Check Data Assets in MongoDB
 * 
 * This script connects to MongoDB and verifies the data assets in the collection.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import model
const DataAsset = require('./server/models/DataAsset');

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support', {
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

// Check data assets
const checkDataAssets = async () => {
  try {
    // Connect to database
    const conn = await connectDB();
    
    // Count documents
    const count = await DataAsset.countDocuments();
    console.log(`\nTotal data assets in collection: ${count}`);
    
    if (count > 0) {
      // Get sample assets
      const assets = await DataAsset.find().limit(5);
      console.log('\nSample data assets (first 5):');
      assets.forEach((asset, index) => {
        console.log(`\n[${index + 1}] ${asset.name} (${asset.type})`);
        console.log(`    Domain: ${asset.domain}`);
        console.log(`    Owner: ${asset.owner}`);
        console.log(`    Status: ${asset.status}`);
        console.log(`    Tags: ${asset.tags.join(', ')}`);
      });
    } else {
      console.log('No data assets found in the collection');
    }
    
    // Close connection
    await conn.connection.close();
    console.log('\nMongoDB connection closed');
  } catch (error) {
    console.error(`Error checking data assets: ${error.message}`);
  }
};

// Run the check
checkDataAssets();
