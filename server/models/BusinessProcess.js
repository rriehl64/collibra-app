const mongoose = require('mongoose');

/**
 * Business Process Schema
 * Represents a business process in the E-Unify system
 */
const businessProcessSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft', 'archived'],
      default: 'draft'
    },
    relatedAssets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DataAsset'
    }],
    tags: [{
      type: String,
      trim: true
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
businessProcessSchema.virtual('lastUpdated').get(function() {
  return this.updatedAt ? this.updatedAt.toISOString().split('T')[0] : null;
});

// Create text index for search functionality
businessProcessSchema.index({ 
  name: 'text', 
  description: 'text', 
  owner: 'text', 
  category: 'text',
  tags: 'text'
});

const BusinessProcess = mongoose.model('BusinessProcess', businessProcessSchema);

module.exports = BusinessProcess;
