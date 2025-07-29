const mongoose = require('mongoose');

/**
 * Task Schema
 * Represents governance tasks and activities in the system
 */
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    required: [true, 'Please specify a status'],
    enum: ['Open', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  priority: {
    type: String,
    required: [true, 'Please specify a priority'],
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    required: [true, 'Please specify a due date']
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify an assignee']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify a creator']
  },
  taskType: {
    type: String,
    enum: ['Data Quality', 'Governance', 'Compliance', 'Review', 'Documentation', 'Other'],
    default: 'Other'
  },
  relatedAssets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataAsset'
  }],
  relatedDomains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain'
  }],
  completionNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Completion notes cannot be more than 500 characters']
  },
  completedAt: {
    type: Date,
    default: null
  },
  history: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fieldUpdated: String,
    oldValue: String,
    newValue: String
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

// Create text index for search functionality
TaskSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Task', TaskSchema);
