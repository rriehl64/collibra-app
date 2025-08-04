require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./server/config/db');

// Connect to database and wait for connection to be established
async function listAllDataAssets() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB Connected');

    // Wait a moment to ensure connection is fully established
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get a reference to the dataassets collection
    const dataAssetsCollection = mongoose.connection.db.collection('dataassets');
    
    // Count documents in the collection
    const count = await dataAssetsCollection.countDocuments({});
    console.log(`Found ${count} documents in 'dataassets' collection`);

    // List all collections to see if there are other collections with our data
    console.log('\nListing all collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      const collCount = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${collCount} documents`);
      
      // Check if collection has customer data warehouse record
      const hasTarget = await mongoose.connection.db.collection(collection.name)
        .findOne({ name: "Customer Data Warehouse 567" });
      console.log(`  Contains "Customer Data Warehouse 567": ${hasTarget ? 'Yes' : 'No'}`);
    }

    // Find all records in the dataassets collection
    console.log('\nListing all records in dataassets collection:');
    const assets = await dataAssetsCollection.find({}).toArray();
    
    console.log(`Found ${assets.length} records in dataassets collection`);
    console.log('Sample records:');
    
    // Print sample of records
    assets.slice(0, 3).forEach((asset, index) => {
      console.log(`\n--- Record ${index + 1} ---`);
      console.log(`ID: ${asset._id}`);
      console.log(`Name: ${asset.name}`);
      console.log(`Type: ${asset.type}`);
      console.log(`Domain: ${asset.domain}`);
    });

    // Check if we have our reset script records
    console.log('\nLooking for key records from reset script:');
    const targetRecords = [
      "Customer Data Warehouse 567",
      "Finance Report 12",
      "Finance Data Warehouse 10"
    ];

    for (const targetName of targetRecords) {
      const found = await dataAssetsCollection.findOne({ name: targetName });
      console.log(`- "${targetName}": ${found ? 'Found' : 'Not found'}`);
    }

    // Check if we need to copy data from another collection
    if (assets.length < 32) {
      console.log('\n!!! MISSING RECORDS DETECTED !!!');
      console.log('Looking for records in other collections...');
      
      let sourceCollection = null;
      
      // Find a collection that has our records
      for (const collection of collections) {
        if (collection.name !== 'dataassets') {
          const hasRecords = await mongoose.connection.db.collection(collection.name)
            .findOne({ name: { $in: targetRecords } });
            
          if (hasRecords) {
            sourceCollection = collection.name;
            console.log(`Found records in "${sourceCollection}" collection`);
            break;
          }
        }
      }
      
      if (sourceCollection) {
        // Get all records from source collection
        const recordsToMove = await mongoose.connection.db
          .collection(sourceCollection)
          .find({})
          .toArray();
          
        console.log(`\nFound ${recordsToMove.length} records in "${sourceCollection}" to move to "dataassets"`);
        
        // Check if any records exist in dataassets
        if (assets.length > 0) {
          console.log('Clearing dataassets collection to avoid duplicates...');
          await dataAssetsCollection.deleteMany({});
        }
        
        // Insert records into dataassets collection
        if (recordsToMove.length > 0) {
          console.log(`Inserting ${recordsToMove.length} records into "dataassets"...`);
          await dataAssetsCollection.insertMany(recordsToMove);
          
          // Verify the insert
          const newCount = await dataAssetsCollection.countDocuments();
          console.log(`"dataassets" collection now has ${newCount} documents`);
        }
      } else {
        console.log('\nCould not find source collection with our data.');
        
        // Check if our reset script created a new collection
        console.log('Checking if DataAsset model is configured to use "dataassets" collection...');
        
        // Print out the collection name configured in the DataAsset model
        const DataAsset = require('./server/models/DataAsset');
        console.log(`DataAsset model collection name: ${DataAsset.collection.name}`);
      }
    }

    console.log('\nDone. Closing database connection.');
    await mongoose.connection.close();

  } catch (error) {
    console.error('Error:', error);
    try {
      await mongoose.connection.close();
    } catch (err) {
      // Ignore close error
    }
  }
}

// Run the function
listAllDataAssets();
