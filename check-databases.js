require('dotenv').config();
const mongoose = require('mongoose');

async function checkDatabases() {
  try {
    // Try connecting directly to different database names to check all possibilities
    console.log('Checking MongoDB databases and collections...\n');
    
    // First, check the connection string from the app
    const appURI = process.env.MONGO_URI || 'mongodb://localhost:27017/data-literacy-support';
    console.log(`App connection string: ${appURI}`);
    
    // Connect to MongoDB without specifying database to list all databases
    console.log('\n1. Connecting to MongoDB without database name...');
    const conn = await mongoose.connect('mongodb://localhost:27017');
    console.log('Connected to MongoDB');
    
    // List all databases
    console.log('\nAvailable databases:');
    const adminDb = conn.connection.db.admin();
    const dbList = await adminDb.listDatabases();
    dbList.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Check the "data-literacy-support" database
    console.log('\n2. Checking "data-literacy-support" database:');
    const dataLiteracyDb = conn.connection.useDb('data-literacy-support');
    const dlCollections = await dataLiteracyDb.listCollections().toArray();
    console.log('Collections:');
    for (const collection of dlCollections) {
      const count = await dataLiteracyDb.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
    }
    
    // Check if "dataassets" collection has our expected data
    if (dlCollections.some(c => c.name === 'dataassets')) {
      const dataAssets = await dataLiteracyDb.collection('dataassets').find({}).toArray();
      console.log(`\nDataAssets collection in "data-literacy-support" has ${dataAssets.length} documents`);
      console.log('Sample document names:');
      dataAssets.slice(0, 5).forEach(asset => console.log(`- ${asset.name}`));
    }
    
    // Check the "collibra" database if it exists
    if (dbList.databases.some(db => db.name === 'collibra')) {
      console.log('\n3. Checking "collibra" database:');
      const collibraDb = conn.connection.useDb('collibra');
      const cbCollections = await collibraDb.listCollections().toArray();
      console.log('Collections:');
      for (const collection of cbCollections) {
        const count = await collibraDb.collection(collection.name).countDocuments();
        console.log(`- ${collection.name}: ${count} documents`);
      }
      
      // Check if "dataassets" collection has our expected data in collibra db
      if (cbCollections.some(c => c.name === 'dataassets')) {
        const dataAssets = await collibraDb.collection('dataassets').find({}).toArray();
        console.log(`\nDataAssets collection in "collibra" has ${dataAssets.length} documents`);
        console.log('Sample document names:');
        dataAssets.slice(0, 5).forEach(asset => console.log(`- ${asset.name}`));
      }
    }
    
    // Check the environment variables
    console.log('\nChecking environment variables from .env file:');
    console.log(`MONGO_URI: ${process.env.MONGO_URI || 'not set'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    
    // Check our script outputs that showed 32 records
    console.log('\nAnalyzing which database our previous script was looking at:');
    console.log(`In our list-all-assets.js script, we found 32 documents in 'dataassets' collection`);
    console.log(`That script used connection: ${mongoose.connection.client.s.url}`);
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error checking databases:', error);
    try {
      await mongoose.connection.close();
    } catch (err) {
      // Ignore close error
    }
  }
}

// Run the function
checkDatabases();
