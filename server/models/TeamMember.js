const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  personalPhone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    enum: [
      'Front Office',
      'Data Management',
      'Data Analytics',
      'Data Engineering',
      'Data Science',
      'Business Intelligence',
      'Data Governance',
      'Product & Design'
    ]
  },
  division: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    skillName: {
      type: String,
      required: true,
      trim: true
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    certified: {
      type: Boolean,
      default: false
    }
  }],
  certifications: [{
    name: String,
    issuer: String,
    dateObtained: Date,
    expirationDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  capacity: {
    fteAllocation: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 1
    },
    hoursPerWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 40,
      default: 40
    },
    availableHours: {
      type: Number,
      required: true,
      min: 0
    }
  },
  currentAssignments: [{
    priorityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DataStrategyPriority'
    },
    priorityName: String,
    allocation: {
      type: Number,
      min: 0,
      max: 100
    },
    startDate: Date,
    endDate: Date,
    hoursAllocated: Number
  }],
  availability: {
    ptoScheduled: [{
      startDate: Date,
      endDate: Date,
      type: {
        type: String,
        enum: ['PTO', 'Sick', 'Training', 'Conference', 'Other'],
        default: 'PTO'
      },
      description: String
    }],
    workingHours: {
      monday: { start: String, end: String, available: { type: Boolean, default: true } },
      tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
      wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
      thursday: { start: String, end: String, available: { type: Boolean, default: true } },
      friday: { start: String, end: String, available: { type: Boolean, default: true } }
    }
  },
  performanceMetrics: {
    completedPriorities: {
      type: Number,
      default: 0
    },
    averageDeliveryTime: {
      type: Number,
      default: 0
    },
    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    lastReviewDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  notes: [{
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    author: String,
    type: {
      type: String,
      enum: ['General', 'Performance', 'Training', 'Assignment'],
      default: 'General'
    }
  }]
}, {
  timestamps: true
});

// Virtual for full name
teamMemberSchema.virtual('fullName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`;
});

// Virtual for current utilization percentage
teamMemberSchema.virtual('currentUtilization').get(function() {
  const totalAllocation = this.currentAssignments.reduce((sum, assignment) => {
    return sum + (assignment.allocation || 0);
  }, 0);
  return Math.min(totalAllocation, 100);
});

// Indexes for efficient queries
teamMemberSchema.index({ branch: 1, isActive: 1 });
teamMemberSchema.index({ 'skills.skillName': 1 });
teamMemberSchema.index({ employeeId: 1 });
teamMemberSchema.index({ email: 1 });

// Ensure virtuals are included in JSON output
teamMemberSchema.set('toJSON', { virtuals: true });
teamMemberSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
