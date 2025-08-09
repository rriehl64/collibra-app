/**
 * Data Concept Model
 * Represents a standardized data concept in the organization
 */

const mongoose = require('mongoose');

const dataConceptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Concept name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['approved', 'draft', 'deprecated'],
      message: 'Status must be either: approved, draft, or deprecated'
    },
    default: 'draft'
  },
  steward: {
    type: String,
    required: [true, 'Data steward is required'],
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  relatedConcepts: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for text search on name, description, domain, and tags
dataConceptSchema.index({
  name: 'text',
  description: 'text',
  domain: 'text',
  tags: 'text'
});

const DataConcept = mongoose.model('DataConcept', dataConceptSchema);

module.exports = DataConcept;
