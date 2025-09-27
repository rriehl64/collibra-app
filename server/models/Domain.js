const mongoose = require('mongoose');

/**
 * Domain Schema
 * Represents a data domain in the data governance framework
 */
const DomainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a domain name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  type: {
    type: String,
    trim: true,
    maxlength: [100, 'Type cannot be more than 100 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [100, 'Category cannot be more than 100 characters']
  },
  status: {
    type: String,
    required: [true, 'Please specify a status'],
    enum: ['Active', 'Inactive', 'Under Development', 'Deprecated'],
    default: 'Active'
  },
  owner: {
    type: String,
    required: [true, 'Please specify a domain owner'],
    trim: true,
    maxlength: [200, 'Owner cannot be more than 200 characters']
  },
  stewards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentDomain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
    default: null
  },
  attributes: [{
    name: String,
    value: String,
    description: String
  }],
  // Metadata for tracking
  metrics: {
    assetCount: {
      type: Number,
      default: 0
    },
    complianceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastAssessment: {
      type: Date,
      default: null
    }
  },
  // Associated glossary terms
  businessTerms: [{
    term: String,
    definition: String
  }],
  // Tags for categorization
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

// Create text index for search functionality
DomainSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Domain', DomainSchema);
