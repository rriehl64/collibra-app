const mongoose = require('mongoose');

const dataStrategyEpicSchema = new mongoose.Schema({
  epicId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  area: {
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
  businessValue: {
    type: String,
    required: true
  },
  acceptanceCriteria: [{
    type: String,
    trim: true
  }],
  stories: [{
    storyId: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    businessValue: {
      type: String,
      required: true
    },
    acceptanceCriteria: [{
      type: String,
      trim: true
    }],
    storyPoints: {
      type: Number,
      min: 1,
      max: 21
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Backlog', 'Ready', 'In Progress', 'Review', 'Done'],
      default: 'Backlog'
    },
    assignee: {
      type: String,
      trim: true
    },
    estimatedHours: {
      type: Number,
      min: 0
    },
    actualHours: {
      type: Number,
      min: 0,
      default: 0
    },
    sprint: {
      type: String,
      trim: true
    },
    dependencies: [{
      type: String,
      trim: true
    }],
    tags: [{
      type: String,
      trim: true
    }]
  }],
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  targetQuarter: {
    type: String,
    required: true,
    match: /^Q[1-4] \d{4}$/
  },
  estimatedEffort: {
    totalStoryPoints: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 0
    }
  },
  actualEffort: {
    totalHours: {
      type: Number,
      default: 0
    },
    completedStoryPoints: {
      type: Number,
      default: 0
    }
  },
  dependencies: [{
    type: String,
    trim: true
  }],
  risks: [{
    description: String,
    impact: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    probability: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    mitigation: String
  }],
  stakeholders: [{
    name: String,
    role: String,
    involvement: {
      type: String,
      enum: ['Sponsor', 'Owner', 'Contributor', 'Informed'],
      default: 'Informed'
    }
  }],
  progressNotes: [{
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    author: String,
    type: {
      type: String,
      enum: ['Update', 'Risk', 'Issue', 'Decision'],
      default: 'Update'
    }
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

// Virtual for completion percentage
dataStrategyEpicSchema.virtual('completionPercentage').get(function() {
  if (this.stories.length === 0) return 0;
  const completedStories = this.stories.filter(story => story.status === 'Done').length;
  return Math.round((completedStories / this.stories.length) * 100);
});

// Indexes for efficient queries
dataStrategyEpicSchema.index({ area: 1, status: 1 });
dataStrategyEpicSchema.index({ targetQuarter: 1, priority: 1 });
dataStrategyEpicSchema.index({ epicId: 1 });
dataStrategyEpicSchema.index({ createdAt: -1 });

// Ensure virtuals are included in JSON output
dataStrategyEpicSchema.set('toJSON', { virtuals: true });
dataStrategyEpicSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DataStrategyEpic', dataStrategyEpicSchema);
