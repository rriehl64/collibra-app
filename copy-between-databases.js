require('dotenv').config();
const { MongoClient } = require('mongodb');

async function copyBetweenDatabases() {
  // Direct MongoDB client connection to avoid Mongoose issues
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully');
    
    // Get references to both databases
    const sourceDB = client.db('collibra');
    const targetDB = client.db('data-literacy-support');
    
    // Check source collection
    const sourceCollection = sourceDB.collection('dataassets');
    const sourceCount = await sourceCollection.countDocuments();
    console.log(`Source collection (collibra.dataassets) has ${sourceCount} documents`);
    
    // Get sample of source data
    if (sourceCount > 0) {
      const sourceSample = await sourceCollection.find().limit(3).toArray();
      console.log('Sample documents from source:');
      sourceSample.forEach((doc, i) => {
        console.log(`${i+1}. ${doc.name} (${doc.type}, ${doc.domain})`);
      });
    }
    
    // Check target collection
    const targetCollection = targetDB.collection('dataassets');
    const targetCount = await targetCollection.countDocuments();
    console.log(`Target collection (data-literacy-support.dataassets) has ${targetCount} documents`);
    
    // Get sample of target data if exists
    if (targetCount > 0) {
      const targetSample = await targetCollection.find().limit(3).toArray();
      console.log('Sample documents from target:');
      targetSample.forEach((doc, i) => {
        console.log(`${i+1}. ${doc.name} (${doc.type}, ${doc.domain})`);
      });
    }
    
    // Copy data from source to target
    console.log('\nCopying data from collibra.dataassets to data-literacy-support.dataassets...');
    
    // Clear target collection if it has data
    if (targetCount > 0) {
      console.log('Clearing target collection first...');
      await targetCollection.deleteMany({});
    }
    
    // Get all documents from source
    const allDocs = await sourceCollection.find().toArray();
    
    // Insert into target if we have documents
    if (allDocs.length > 0) {
      console.log(`Inserting ${allDocs.length} documents into target collection...`);
      const result = await targetCollection.insertMany(allDocs);
      console.log(`Successfully copied ${result.insertedCount} documents`);
    } else {
      console.log('No documents found in source collection, nothing to copy');
    }
    
    // Verify the copy
    const newTargetCount = await targetCollection.countDocuments();
    console.log(`\nVerification: Target collection now has ${newTargetCount} documents`);
    
    // Fix .env file to use correct database
    console.log('\nChecking .env file configuration...');
    console.log(`Current MONGO_URI: ${process.env.MONGO_URI || 'not set'}`);
    
    console.log('\nDone! Please refresh MongoDB Compass to see the updated records.');
    console.log('Also make sure to update your .env file if needed to use the correct database.');
    
  } catch (error) {
    console.error('Error copying between databases:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the function
copyBetweenDatabases();
