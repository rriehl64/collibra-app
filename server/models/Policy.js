const mongoose = require('mongoose');

/**
 * Policy Schema
 * Represents a governance policy in the system
 */
const PolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a policy name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Data Quality', 'Security', 'Privacy', 'Compliance', 'Operational', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    required: [true, 'Please specify a status'],
    enum: ['Draft', 'Active', 'Under Review', 'Deprecated', 'Archived'],
    default: 'Draft'
  },
  complianceStatus: {
    type: String,
    enum: ['compliant', 'non-compliant', 'pending-review'],
    default: 'pending-review'
  },
  complianceFramework: [{
    type: String,
    trim: true
  }],
  lastReviewDate: {
    type: Date
  },
  nextReviewDate: {
    type: Date
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  implementationStatus: {
    type: String,
    enum: ['not-started', 'in-progress', 'implemented', 'verified'],
    default: 'not-started'
  },
  version: {
    type: String,
    required: [true, 'Please specify a version'],
    default: '1.0'
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  expirationDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify a policy owner']
  },
  approvers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  relatedRegulations: [{
    name: String,
    description: String,
    url: String
  }],
  controls: [{
    name: String,
    description: String,
    implementationStatus: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Implemented', 'Verified', 'Failed'],
      default: 'Not Started'
    }
  }],
  affectedDomains: [{
    type: String,
    trim: true
  }],
  affectedAssetTypes: [{
    type: String,
    trim: true
  }],
  documents: [{
    title: String,
    fileUrl: String,
    description: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  revisionHistory: [{
    version: String,
    date: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changeDescription: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);
