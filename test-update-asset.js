require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./server/config/db');

// Connect to MongoDB
async function testUpdate() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Access the dataassets collection directly to avoid schema validation
    const db = mongoose.connection.db;
    const collection = db.collection('dataassets');
    
    // Find "Customer Data Warehouse 567" record
    const asset = await collection.findOne({ name: "Customer Data Warehouse 567" });
    
    if (asset) {
      console.log('\nFound asset:');
      console.log(`ID: ${asset._id}`);
      console.log(`Name: ${asset.name}`);
      console.log(`Type: ${asset.type}`);
      console.log(`Domain: ${asset.domain}`);
      console.log(`Status: ${asset.status}`);
      
      // Check if there are any other fields that might cause validation issues
      console.log('\nAll fields:');
      Object.keys(asset).forEach(key => {
        console.log(`${key}: ${typeof asset[key] === 'object' ? JSON.stringify(asset[key]) : asset[key]}`);
      });
      
      // Try to update the asset with a simple change
      console.log('\nTesting update directly in MongoDB...');
      const testDescription = "Test update " + new Date().toISOString();
      
      const result = await collection.updateOne(
        { _id: asset._id },
        { $set: { description: testDescription } }
      );
      
      console.log(`Update result: ${result.modifiedCount} document(s) modified`);
      
      // Verify the update
      const updatedAsset = await collection.findOne({ _id: asset._id });
      console.log(`Updated description: ${updatedAsset.description}`);
      
      // Load the DataAsset model to check schema validation
      console.log('\nTesting mongoose schema validation...');
      const DataAsset = require('./server/models/DataAsset');
      
      try {
        // Create a test asset with the same data
        const testAsset = new DataAsset({
          name: asset.name,
          type: asset.type,
          domain: asset.domain,
          owner: asset.owner,
          description: asset.description,
          status: asset.status,
          tags: asset.tags || []
        });
        
        // Validate the test asset without saving
        await testAsset.validate();
        console.log('✅ Asset passes mongoose validation');
      } catch (validationError) {
        console.error('❌ Validation error:', validationError.message);
        
        // Show detailed validation errors
        if (validationError.errors) {
          Object.keys(validationError.errors).forEach(key => {
            console.error(`Field ${key}: ${validationError.errors[key].message}`);
          });
        }
      }
    } else {
      console.log('Asset not found');
    }
    
    console.log('\nDisconnecting from MongoDB...');
    await mongoose.connection.close();
    console.log('Done');
    
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
  }
}

// Run the test
testUpdate();
