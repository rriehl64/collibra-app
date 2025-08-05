require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./server/config/db');

// Connect to database
connectDB();

// Define a simplified DataAsset schema for this script
const DataAssetSchema = new mongoose.Schema({
  name: String,
  type: String,
  domain: String,
  owner: String,
  description: String,
  lastModified: Date,
  status: String,
  tags: [String],
  certification: String
});

const DataAsset = mongoose.model('DataAsset', DataAssetSchema, 'dataassets');

async function updateDataWarehouseName() {
  try {
    // Find the specific record with ID
    const targetId = '688c291934a602337a6085a3';
    const existingAsset = await DataAsset.findById(targetId);
    
    if (existingAsset) {
      console.log('Found existing asset:', existingAsset.name);
      
      // Update the name to "Customer Data Warehouse 567"
      const updatedAsset = await DataAsset.findByIdAndUpdate(
        targetId, 
        { name: 'Customer Data Warehouse 567' },
        { new: true }
      );
      
      console.log('Updated asset name to:', updatedAsset.name);
    } else {
      console.log('Asset not found with ID:', targetId);
    }
    
    // Also check if there are any assets already named "Customer Data Warehouse 567"
    const duplicateCheck = await DataAsset.find({ name: 'Customer Data Warehouse 567' });
    if (duplicateCheck.length > 0) {
      console.log('Found existing assets with name "Customer Data Warehouse 567":', 
        duplicateCheck.map(asset => ({ id: asset._id, name: asset.name })));
    }
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating data warehouse:', error);
    mongoose.connection.close();
  }
}

updateDataWarehouseName();
