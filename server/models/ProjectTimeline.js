const mongoose = require('mongoose');

const projectTimelineSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  phase: {
    type: String,
    required: true,
    enum: ['Assessment', 'Implementation', 'Optimization']
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['In Progress', 'Active', 'Planned', 'Future', 'Completed', 'On Hold']
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  description: {
    type: String,
    trim: true
  },
  dependencies: [{
    type: String,
    trim: true
  }],
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  budget: {
    type: Number,
    min: 0
  },
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
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration in days
projectTimelineSchema.virtual('durationDays').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for progress status
projectTimelineSchema.virtual('progressStatus').get(function() {
  if (this.progress === 100) return 'Completed';
  if (this.progress >= 75) return 'Nearly Complete';
  if (this.progress >= 50) return 'On Track';
  if (this.progress >= 25) return 'In Progress';
  return 'Getting Started';
});

// Index for efficient queries
projectTimelineSchema.index({ phase: 1, startDate: 1 });
projectTimelineSchema.index({ owner: 1 });
projectTimelineSchema.index({ status: 1 });
projectTimelineSchema.index({ createdAt: -1 });

// Text index for search functionality
projectTimelineSchema.index({
  taskName: 'text',
  description: 'text',
  owner: 'text',
  phase: 'text'
});

module.exports = mongoose.model('ProjectTimeline', projectTimelineSchema);
