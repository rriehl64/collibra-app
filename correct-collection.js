/**
 * Script to correct the collection name issue
 * This will move data from 'dataAssets' to 'dataassets' (lowercase)
 * which is the proper Mongoose pluralized collection name
 */
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/collibra';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB Connected successfully');
    correctCollection();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function correctCollection() {
  try {
    const db = mongoose.connection.db;
    
    // List all collections to confirm what we're working with
    const collections = await db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(coll => {
      console.log(`- ${coll.name}`);
    });
    
    // Source collection (incorrectly created with capital A)
    const sourceCollectionName = 'dataAssets';
    
    // Target collection (correct lowercase plural form used by Mongoose by default)
    const targetCollectionName = 'dataassets';
    
    // Check if source exists
    const sourceExists = collections.some(c => c.name === sourceCollectionName);
    if (!sourceExists) {
      console.log(`Source collection '${sourceCollectionName}' does not exist. Nothing to fix.`);
      mongoose.disconnect();
      return;
    }
    
    // Get source collection documents
    const sourceCollection = db.collection(sourceCollectionName);
    const documents = await sourceCollection.find({}).toArray();
    console.log(`Found ${documents.length} documents in '${sourceCollectionName}'`);
    
    // Check if we need to proceed
    if (documents.length === 0) {
      console.log('No documents to transfer. Done.');
      mongoose.disconnect();
      return;
    }
    
    // Clear target collection
    const targetCollection = db.collection(targetCollectionName);
    const deleteResult = await targetCollection.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing documents from '${targetCollectionName}'`);
    
    // Insert documents into target collection
    const insertResult = await targetCollection.insertMany(documents);
    console.log(`Successfully transferred ${insertResult.insertedCount} documents to '${targetCollectionName}'`);
    
    // Verify counts
    const sourceCount = await sourceCollection.countDocuments();
    const targetCount = await targetCollection.countDocuments();
    
    console.log(`\nFinal document counts:`);
    console.log(`- '${sourceCollectionName}': ${sourceCount} documents`);
    console.log(`- '${targetCollectionName}': ${targetCount} documents`);
    
    if (targetCount === documents.length) {
      console.log("\nTransfer successful! The data is now in the correct MongoDB collection.");
      console.log(`You can now safely drop the '${sourceCollectionName}' collection if desired.`);
      
      // Uncomment to automatically drop the source collection
      // await sourceCollection.drop();
      // console.log(`Dropped '${sourceCollectionName}' collection.`);
    } else {
      console.log("\nWARNING: Document counts don't match after transfer. Please check manually.");
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error correcting collection:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}
