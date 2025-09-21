const mongoose = require('mongoose');

const dataStrategyPrioritySchema = new mongoose.Schema({
  priorityName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  strategicGoal: {
    type: String,
    required: true,
    enum: [
      'Data Management',
      'Data Engineering', 
      'Data Science',
      'Streamline Case Processing',
      'Product & Design',
      'Data Governance',
      'NPD (Reference Data)',
      'Business Intelligence',
      'Analytics'
    ]
  },
  owner: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Pending'
  },
  loeEstimate: {
    hours: {
      type: Number,
      required: true,
      min: 0
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL'],
      required: true
    }
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  complexity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  riskFactors: [{
    type: String,
    trim: true
  }],
  estimatedValue: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  businessValue: {
    type: String,
    required: true
  },
  deliverables: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    type: String,
    trim: true
  }],
  stakeholders: [{
    type: String,
    trim: true
  }],
  assignedTeam: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    },
    memberName: String,
    allocation: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    }
  }],
  epic: {
    type: String,
    trim: true
  },
  stories: [{
    storyId: String,
    title: String,
    description: String,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    assignee: String,
    estimatedHours: Number
  }],
  progressNotes: [{
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    author: String
  }],
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
dataStrategyPrioritySchema.index({ strategicGoal: 1, status: 1 });
dataStrategyPrioritySchema.index({ dueDate: 1, urgency: 1 });
dataStrategyPrioritySchema.index({ owner: 1, status: 1 });
dataStrategyPrioritySchema.index({ createdAt: -1 });

module.exports = mongoose.model('DataStrategyPriority', dataStrategyPrioritySchema);
