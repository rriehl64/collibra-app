const mongoose = require('mongoose');

/**
 * Data Category Schema
 * Represents a data category in the E-Unify system
 */
const dataCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    owner: {
      type: String,
      required: [true, 'Owner is required'],
      trim: true
    },
    assetCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft'
    },
    tags: [{
      type: String,
      trim: true
    }],
    relatedAssets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DataAsset'
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for lastUpdated formatted date
dataCategorySchema.virtual('lastUpdated').get(function() {
  return this.updatedAt ? this.updatedAt.toISOString().split('T')[0] : null;
});

// Create text index for search functionality
dataCategorySchema.index({ 
  name: 'text', 
  description: 'text', 
  owner: 'text',
  tags: 'text'
});

const DataCategory = mongoose.model('DataCategory', dataCategorySchema);

module.exports = DataCategory;
