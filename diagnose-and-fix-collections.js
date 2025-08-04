require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./server/config/db');

// Define a function to wait for the connection to be ready
const waitForConnection = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function diagnoseAndFixCollections() {
  try {
    // Connect to database
    await connectDB();
    
    // Wait for connection to be fully established
    console.log('Waiting for MongoDB connection to be ready...');
    await waitForConnection(1000);
    
    console.log('Diagnosing MongoDB collections...');
    
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check 'dataassets' collection (case sensitive)
    const dataAssetsCollection = collections.find(c => c.name === 'dataassets');
    console.log('\nFound "dataassets" collection:', !!dataAssetsCollection);
    
    // Also check for any variations in casing
    const allAssetCollections = collections.filter(c => 
      c.name.toLowerCase().includes('asset') || 
      c.name.toLowerCase().includes('data'));
    
    if (allAssetCollections.length > 0) {
      console.log('\nAll possible asset-related collections:');
      allAssetCollections.forEach(c => console.log(`- ${c.name}`));
    }
    
    // Check counts in each collection to find our data
    console.log('\nCounting documents in collections:');
    
    for (const collection of allAssetCollections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
      
      // For any collection with documents, show a sample
      if (count > 0) {
        const sample = await mongoose.connection.db.collection(collection.name)
          .find({})
          .limit(1)
          .toArray();
          
        console.log(`  Sample from ${collection.name}:`, 
          JSON.stringify(sample[0], null, 2).substring(0, 200) + '...');
      }
    }
    
    // Check specifically for our "Customer Data Warehouse 567" record
    console.log('\nLooking for "Customer Data Warehouse 567" in all collections:');
    let foundIn = [];
    
    for (const collection of allAssetCollections) {
      const found = await mongoose.connection.db.collection(collection.name)
        .findOne({ name: "Customer Data Warehouse 567" });
        
      if (found) {
        console.log(`- Found in collection "${collection.name}" with ID: ${found._id}`);
        foundIn.push({ collection: collection.name, record: found });
      } else {
        console.log(`- Not found in collection "${collection.name}"`);
      }
    }
    
    // Now let's fix the issue by ensuring our data is in the correct collection
    // First, determine which collection the frontend is using (likely "dataassets")
    console.log('\n=== FIXING COLLECTION ISSUES ===');
    
    // Based on server/models/DataAsset.js and our previous analysis
    const frontendCollection = 'dataassets';
    console.log(`Frontend is using collection: "${frontendCollection}"`);
    
    // Find where our 32 records went
    let sourceCollection = '';
    let targetCollection = frontendCollection;
    
    for (const collection of allAssetCollections) {
      // Check if this collection has our 32 records
      if (collection.name !== frontendCollection) {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments({
          name: { $regex: /Customer Data Warehouse 567|Customer Database 1|Finance/ }
        });
        
        if (count > 0) {
          sourceCollection = collection.name;
          console.log(`Found our records in collection: "${sourceCollection}"`);
          break;
        }
      }
    }
    
    if (!sourceCollection) {
      console.log('Could not identify where our 32 records are stored.');
      return;
    }
    
    // Get all records from source collection
    const recordsToMove = await mongoose.connection.db
      .collection(sourceCollection)
      .find({})
      .toArray();
      
    console.log(`\nFound ${recordsToMove.length} records to move from "${sourceCollection}" to "${targetCollection}"`);
    
    // Check if target collection exists, if not create it
    if (!collections.find(c => c.name === targetCollection)) {
      console.log(`Target collection "${targetCollection}" doesn't exist, creating it...`);
      await mongoose.connection.db.createCollection(targetCollection);
    }
    
    // Clear target collection to avoid duplicates
    console.log(`Clearing target collection "${targetCollection}"...`);
    await mongoose.connection.db.collection(targetCollection).deleteMany({});
    
    // Move records to target collection
    if (recordsToMove.length > 0) {
      console.log(`Inserting ${recordsToMove.length} records into "${targetCollection}"...`);
      await mongoose.connection.db.collection(targetCollection).insertMany(recordsToMove);
      console.log('Records moved successfully!');
      
      // Verify the move
      const newCount = await mongoose.connection.db.collection(targetCollection).countDocuments();
      console.log(`Target collection "${targetCollection}" now has ${newCount} documents`);
      
      // Show a sample of what's now in the target collection
      const sample = await mongoose.connection.db.collection(targetCollection)
        .find({})
        .limit(1)
        .toArray();
        
      console.log(`Sample from ${targetCollection}:`, 
        JSON.stringify(sample[0], null, 2).substring(0, 200) + '...');
    }
    
    console.log('\nDiagnosis and fix completed!');
    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error diagnosing collections:', error);
    mongoose.connection.close();
  }
}

// Run the diagnostic and fix function
diagnoseAndFixCollections();
