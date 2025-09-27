const mongoose = require('mongoose');

// Automated Process Schema for workflow automation and process orchestration
const AutomatedProcessSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Process name is required'],
    trim: true,
    maxlength: [200, 'Process name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Process description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Process category is required'],
    enum: [
      'Data Quality',
      'Data Governance',
      'Compliance',
      'Reporting',
      'ETL/Integration',
      'Monitoring',
      'Backup/Recovery',
      'Security',
      'Workflow',
      'Notification',
      'Analytics',
      'Other'
    ]
  },
  
  // Process Configuration
  processType: {
    type: String,
    required: [true, 'Process type is required'],
    enum: [
      'Scheduled',      // Runs on a schedule
      'Event-Driven',   // Triggered by events
      'Manual',         // Manually triggered
      'Continuous',     // Always running
      'On-Demand'       // Triggered by user request
    ]
  },
  
  // Scheduling Configuration
  schedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    cronExpression: {
      type: String,
      validate: {
        validator: function(v) {
          // Basic cron validation - can be enhanced
          if (!this.schedule.enabled) return true;
          return v && v.split(' ').length >= 5;
        },
        message: 'Invalid cron expression format'
      }
    },
    timezone: {
      type: String,
      default: 'America/New_York'
    },
    nextRun: Date,
    lastRun: Date
  },
  
  // Process Steps/Workflow
  steps: [{
    stepId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    stepType: {
      type: String,
      enum: [
        'API_Call',
        'Database_Query',
        'File_Operation',
        'Email_Notification',
        'Data_Validation',
        'Data_Transform',
        'Conditional_Logic',
        'Wait_Delay',
        'Script_Execution',
        'Human_Approval'
      ],
      required: true
    },
    configuration: {
      type: mongoose.Schema.Types.Mixed, // Flexible configuration object
      default: {}
    },
    order: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    retryConfig: {
      maxRetries: {
        type: Number,
        default: 3
      },
      retryDelay: {
        type: Number,
        default: 5000 // milliseconds
      }
    }
  }],
  
  // Status and Control
  status: {
    type: String,
    enum: [
      'Active',
      'Inactive',
      'Draft',
      'Paused',
      'Error',
      'Archived'
    ],
    default: 'Draft'
  },
  
  // Execution History and Metrics
  executionHistory: [{
    executionId: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    status: {
      type: String,
      enum: ['Running', 'Completed', 'Failed', 'Cancelled', 'Timeout'],
      required: true
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    errorMessage: String,
    executedBy: {
      type: String, // User ID or 'System'
      required: true
    },
    stepResults: [{
      stepId: String,
      status: String,
      duration: Number, // milliseconds
      result: mongoose.Schema.Types.Mixed,
      errorMessage: String
    }]
  }],
  
  // Performance Metrics
  metrics: {
    totalExecutions: {
      type: Number,
      default: 0
    },
    successfulExecutions: {
      type: Number,
      default: 0
    },
    failedExecutions: {
      type: Number,
      default: 0
    },
    averageExecutionTime: {
      type: Number,
      default: 0 // milliseconds
    },
    lastExecutionTime: Date,
    lastSuccessTime: Date,
    lastFailureTime: Date
  },
  
  // Notifications and Alerts
  notifications: {
    onSuccess: {
      enabled: {
        type: Boolean,
        default: false
      },
      recipients: [String], // Email addresses
      template: String
    },
    onFailure: {
      enabled: {
        type: Boolean,
        default: true
      },
      recipients: [String],
      template: String
    },
    onStart: {
      enabled: {
        type: Boolean,
        default: false
      },
      recipients: [String],
      template: String
    }
  },
  
  // Dependencies and Triggers
  dependencies: [{
    processId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AutomatedProcess'
    },
    dependencyType: {
      type: String,
      enum: ['Success', 'Completion', 'Failure'],
      default: 'Success'
    }
  }],
  
  triggers: [{
    triggerType: {
      type: String,
      enum: [
        'File_Created',
        'File_Modified',
        'Database_Change',
        'API_Webhook',
        'Time_Based',
        'Manual',
        'Process_Completion'
      ]
    },
    configuration: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Access Control and Ownership
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Process owner is required']
  },
  team: {
    type: String,
    required: [true, 'Team assignment is required']
  },
  permissions: {
    canView: [String], // User roles that can view
    canEdit: [String], // User roles that can edit
    canExecute: [String], // User roles that can execute
    canDelete: [String] // User roles that can delete
  },
  
  // Compliance and Audit
  complianceLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  auditRequired: {
    type: Boolean,
    default: false
  },
  dataClassification: {
    type: String,
    enum: ['Public', 'Internal', 'Confidential', 'Restricted'],
    default: 'Internal'
  },
  
  // Tags and Metadata
  tags: [String],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Version Control
  version: {
    type: String,
    default: '1.0.0'
  },
  changeLog: [{
    version: String,
    changes: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changeDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Indexes for performance
AutomatedProcessSchema.index({ name: 1 });
AutomatedProcessSchema.index({ category: 1 });
AutomatedProcessSchema.index({ status: 1 });
AutomatedProcessSchema.index({ processType: 1 });
AutomatedProcessSchema.index({ owner: 1 });
AutomatedProcessSchema.index({ team: 1 });
AutomatedProcessSchema.index({ 'schedule.nextRun': 1 });
AutomatedProcessSchema.index({ createdAt: -1 });
AutomatedProcessSchema.index({ updatedAt: -1 });

// Virtual for success rate
AutomatedProcessSchema.virtual('successRate').get(function() {
  if (this.metrics.totalExecutions === 0) return 0;
  return ((this.metrics.successfulExecutions / this.metrics.totalExecutions) * 100).toFixed(2);
});

// Virtual for failure rate
AutomatedProcessSchema.virtual('failureRate').get(function() {
  if (this.metrics.totalExecutions === 0) return 0;
  return ((this.metrics.failedExecutions / this.metrics.totalExecutions) * 100).toFixed(2);
});

// Virtual for next scheduled run (human readable)
AutomatedProcessSchema.virtual('nextRunFormatted').get(function() {
  if (!this.schedule.nextRun) return 'Not scheduled';
  return this.schedule.nextRun.toLocaleString();
});

// Virtual for last execution status
AutomatedProcessSchema.virtual('lastExecutionStatus').get(function() {
  if (!this.executionHistory || this.executionHistory.length === 0) return 'Never executed';
  const lastExecution = this.executionHistory[this.executionHistory.length - 1];
  return lastExecution.status;
});

// Pre-save middleware to update metrics
AutomatedProcessSchema.pre('save', function(next) {
  // Update average execution time if we have execution history
  if (this.executionHistory && this.executionHistory.length > 0) {
    const completedExecutions = this.executionHistory.filter(exec => 
      exec.status === 'Completed' && exec.endTime && exec.startTime
    );
    
    if (completedExecutions.length > 0) {
      const totalTime = completedExecutions.reduce((sum, exec) => {
        return sum + (exec.endTime.getTime() - exec.startTime.getTime());
      }, 0);
      this.metrics.averageExecutionTime = totalTime / completedExecutions.length;
    }
    
    // Update execution counts
    this.metrics.totalExecutions = this.executionHistory.length;
    this.metrics.successfulExecutions = this.executionHistory.filter(exec => exec.status === 'Completed').length;
    this.metrics.failedExecutions = this.executionHistory.filter(exec => exec.status === 'Failed').length;
    
    // Update last execution times
    const lastExecution = this.executionHistory[this.executionHistory.length - 1];
    this.metrics.lastExecutionTime = lastExecution.startTime;
    
    const lastSuccess = this.executionHistory.filter(exec => exec.status === 'Completed').pop();
    if (lastSuccess) {
      this.metrics.lastSuccessTime = lastSuccess.endTime || lastSuccess.startTime;
    }
    
    const lastFailure = this.executionHistory.filter(exec => exec.status === 'Failed').pop();
    if (lastFailure) {
      this.metrics.lastFailureTime = lastFailure.endTime || lastFailure.startTime;
    }
  }
  
  next();
});

// Static method to find processes ready for execution
AutomatedProcessSchema.statics.findReadyForExecution = function() {
  const now = new Date();
  return this.find({
    status: 'Active',
    'schedule.enabled': true,
    'schedule.nextRun': { $lte: now }
  });
};

// Instance method to calculate next run time
AutomatedProcessSchema.methods.calculateNextRun = function() {
  if (!this.schedule.enabled || !this.schedule.cronExpression) {
    return null;
  }
  
  // This would integrate with a cron parser library in production
  // For now, return a simple future date
  const now = new Date();
  const nextRun = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours from now
  return nextRun;
};

// Instance method to add execution record
AutomatedProcessSchema.methods.addExecutionRecord = function(executionData) {
  this.executionHistory.push(executionData);
  
  // Keep only last 100 execution records to prevent document bloat
  if (this.executionHistory.length > 100) {
    this.executionHistory = this.executionHistory.slice(-100);
  }
  
  return this.save();
};

module.exports = mongoose.model('AutomatedProcess', AutomatedProcessSchema);
