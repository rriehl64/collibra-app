const mongoose = require('mongoose');

/**
 * Subject Category Schema
 * Represents categories for organizing subjects within the USCIS system
 */
const SubjectCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  departmentCode: {
    type: String,
    required: [true, 'Please add a department code'],
    trim: true,
    maxlength: [50, 'Department code cannot be more than 50 characters']
  },
  owner: {
    type: String,
    required: [true, 'Please add an owner'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'archived'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for efficient searching
SubjectCategorySchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('SubjectCategory', SubjectCategorySchema, 'subjectcategories');
