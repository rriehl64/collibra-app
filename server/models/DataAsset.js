const mongoose = require('mongoose');

/**
 * DataAsset Schema
 * Represents a data asset in the data catalog
 */
const DataAssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify the asset type'],
    enum: ['Database', 'Table', 'Report', 'Dashboard', 'Document', 'API']
  },
  domain: {
    type: String,
    required: [true, 'Please specify the domain'],
    trim: true
  },
  owner: {
    type: String,
    required: [true, 'Please specify an owner'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: [true, 'Please specify a status'],
    enum: ['Development', 'Production', 'Archived', 'Deprecated'],
    default: 'Development'
  },
  tags: [{
    type: String,
    trim: true
  }],
  certification: {
    type: String,
    enum: ['certified', 'pending', 'none'],
    default: 'none'
  },
  stewards: [{
    type: String,
    trim: true
  }],
  // References to related assets
  relatedAssets: [{
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DataAsset'
    },
    relationshipType: {
      type: String,
      enum: ['parent', 'child', 'peer', 'source', 'derived']
    }
  }],
  // Metadata for governance
  governance: {
    policies: [{
      name: String,
      description: String,
      status: String
    }],
    complianceStatus: {
      type: String,
      enum: ['Compliant', 'Non-Compliant', 'Unknown', 'Not Applicable'],
      default: 'Unknown'
    }
  },
  // Quality metrics
  qualityMetrics: {
    completeness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    consistency: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }
}, { timestamps: true });

// Create text index for search functionality
DataAssetSchema.index({
  name: 'text',
  description: 'text',
  domain: 'text',
  owner: 'text',
  tags: 'text'
});

module.exports = mongoose.model('DataAsset', DataAssetSchema);
