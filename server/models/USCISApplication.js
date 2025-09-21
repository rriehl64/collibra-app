const mongoose = require('mongoose');

// Schema for USCIS Benefit Applications
const uscisApplicationSchema = new mongoose.Schema({
  // Core identification
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]{3}\d{10}$/  // Format: MSC1234567890, NBC1234567890, etc.
  },
  
  // Application details
  applicationType: {
    type: String,
    required: true,
    enum: [
      'N-400',    // Naturalization
      'I-485',    // Green Card (Adjustment of Status)
      'I-90',     // Green Card Renewal
      'I-765',    // Work Authorization
      'I-131',    // Travel Document
      'I-130',    // Family Petition
      'I-140',    // Employment Petition
      'I-589',    // Asylum
      'I-327',    // Refugee Travel Document
      'I-751'     // Conditional Residence Removal
    ]
  },
  
  // Current status
  currentStatus: {
    type: String,
    required: true,
    enum: [
      'Case Was Received',
      'Case Is Being Actively Reviewed',
      'Request for Additional Evidence Was Sent',
      'Response To USCIS Request Received',
      'Interview Was Scheduled',
      'Interview Was Completed',
      'Case Is Ready to Be Scheduled for An Interview',
      'Case Was Approved',
      'Case Was Denied',
      'Case Was Withdrawn',
      'Case Was Terminated',
      'Case Was Transferred'
    ]
  },
  
  // Processing priority
  priority: {
    type: String,
    enum: ['Standard', 'Expedited', 'Premium Processing', 'Emergency'],
    default: 'Standard'
  },
  
  // Processing center
  processingCenter: {
    type: String,
    required: true,
    enum: [
      'National Benefits Center',
      'Texas Service Center',
      'Nebraska Service Center',
      'Vermont Service Center',
      'California Service Center',
      'Potomac Service Center',
      'USCIS Lockbox Facility'
    ]
  },
  
  // Important dates
  receivedDate: {
    type: Date,
    required: true
  },
  lastUpdatedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedCompletionDate: {
    type: Date
  },
  actualCompletionDate: {
    type: Date
  },
  
  // Applicant information (anonymized for privacy)
  applicantId: {
    type: String,
    required: true  // Hashed/anonymized identifier
  },
  countryOfBirth: {
    type: String
  },
  applicationChannel: {
    type: String,
    enum: ['Online', 'Mail', 'In-Person'],
    default: 'Online'
  },
  
  // Processing metrics
  processingTimeBusinessDays: {
    type: Number,
    min: 0
  },
  currentStepDuration: {
    type: Number,
    min: 0
  },
  totalStepsCompleted: {
    type: Number,
    min: 0,
    default: 0
  },
  totalStepsRequired: {
    type: Number,
    min: 1,
    default: 5
  },
  
  // Status flags
  hasRFE: {
    type: Boolean,
    default: false
  },
  hasInterview: {
    type: Boolean,
    default: false
  },
  isExpedited: {
    type: Boolean,
    default: false
  },
  hasComplications: {
    type: Boolean,
    default: false
  },
  
  // Status history for tracking
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    notes: String,
    updatedBy: String
  }],
  
  // Additional metadata
  fiscalYear: {
    type: Number,
    required: true
  },
  quarter: {
    type: Number,
    min: 1,
    max: 4
  },
  
  // AI/ML related fields
  riskScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  predictedProcessingDays: {
    type: Number,
    min: 0
  },
  anomalyFlags: [{
    flagType: {
      type: String,
      required: true
    },
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    detectedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  collection: 'uscis_applications'
});

// Indexes for performance
uscisApplicationSchema.index({ receiptNumber: 1 });
uscisApplicationSchema.index({ applicationType: 1, currentStatus: 1 });
uscisApplicationSchema.index({ processingCenter: 1 });
uscisApplicationSchema.index({ receivedDate: 1 });
uscisApplicationSchema.index({ fiscalYear: 1, quarter: 1 });
uscisApplicationSchema.index({ currentStatus: 1, receivedDate: 1 });

// Virtual for calculating processing days
uscisApplicationSchema.virtual('daysInSystem').get(function() {
  if (this.actualCompletionDate) {
    return Math.ceil((this.actualCompletionDate - this.receivedDate) / (1000 * 60 * 60 * 24));
  }
  return Math.ceil((new Date() - this.receivedDate) / (1000 * 60 * 60 * 24));
});

// Virtual for completion percentage
uscisApplicationSchema.virtual('completionPercentage').get(function() {
  return Math.round((this.totalStepsCompleted / this.totalStepsRequired) * 100);
});

// Pre-save middleware to update processing metrics
uscisApplicationSchema.pre('save', function(next) {
  // Calculate processing time in business days
  if (this.receivedDate) {
    const now = this.actualCompletionDate || new Date();
    const timeDiff = now - this.receivedDate;
    this.processingTimeBusinessDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }
  
  // Set fiscal year based on received date
  if (this.receivedDate) {
    const year = this.receivedDate.getFullYear();
    const month = this.receivedDate.getMonth();
    this.fiscalYear = month >= 9 ? year + 1 : year; // FY starts in October
    this.quarter = Math.ceil((month + 4) % 12 / 3) || 4;
  }
  
  // Update expedited flag based on priority
  this.isExpedited = ['Expedited', 'Premium Processing', 'Emergency'].includes(this.priority);
  
  next();
});

// Static methods for analytics
uscisApplicationSchema.statics.getMetrics = async function(dateRange = {}) {
  const matchStage = {};
  if (dateRange.start && dateRange.end) {
    matchStage.receivedDate = {
      $gte: new Date(dateRange.start),
      $lte: new Date(dateRange.end)
    };
  }
  
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        approvedCount: {
          $sum: { $cond: [{ $eq: ['$currentStatus', 'Case Was Approved'] }, 1, 0] }
        },
        deniedCount: {
          $sum: { $cond: [{ $eq: ['$currentStatus', 'Case Was Denied'] }, 1, 0] }
        },
        pendingCount: {
          $sum: { 
            $cond: [
              { 
                $not: { 
                  $in: ['$currentStatus', ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn']] 
                } 
              }, 
              1, 
              0
            ] 
          }
        },
        expeditedCount: { $sum: { $cond: ['$isExpedited', 1, 0] } },
        rfeCount: { $sum: { $cond: ['$hasRFE', 1, 0] } },
        avgProcessingTime: { $avg: '$processingTimeBusinessDays' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  const metrics = result[0] || {};
  
  return {
    totalApplications: metrics.totalApplications || 0,
    approvalRate: metrics.totalApplications ? metrics.approvedCount / metrics.totalApplications : 0,
    denialRate: metrics.totalApplications ? metrics.deniedCount / metrics.totalApplications : 0,
    completionRate: metrics.totalApplications ? 
      (metrics.approvedCount + metrics.deniedCount) / metrics.totalApplications : 0,
    backlogCount: metrics.pendingCount || 0,
    expeditedCount: metrics.expeditedCount || 0,
    rfeRate: metrics.totalApplications ? metrics.rfeCount / metrics.totalApplications : 0,
    averageProcessingTime: Math.round(metrics.avgProcessingTime || 0)
  };
};

uscisApplicationSchema.statics.getBacklogAnalysis = async function() {
  const backlogPipeline = [
    {
      $match: {
        currentStatus: {
          $not: { $in: ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn'] }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalBacklog: { $sum: 1 },
        oldestCase: { $min: '$receivedDate' },
        avgDaysInSystem: { $avg: '$processingTimeBusinessDays' }
      }
    }
  ];
  
  const backlogResult = await this.aggregate(backlogPipeline);
  const backlog = backlogResult[0] || {};
  
  // Find the actual oldest case details
  const oldestCase = await this.findOne({
    currentStatus: {
      $not: { $in: ['Case Was Approved', 'Case Was Denied', 'Case Was Withdrawn'] }
    }
  }).sort({ receivedDate: 1 });
  
  return {
    currentBacklog: backlog.totalBacklog || 0,
    oldestCase: oldestCase ? {
      receiptNumber: oldestCase.receiptNumber,
      daysInSystem: oldestCase.daysInSystem,
      applicationType: oldestCase.applicationType
    } : null,
    projectedClearanceDate: new Date(Date.now() + (backlog.avgDaysInSystem || 180) * 24 * 60 * 60 * 1000),
    bottlenecks: [
      {
        step: 'Initial Review',
        averageDuration: 30,
        casesAffected: Math.round((backlog.totalBacklog || 0) * 0.4)
      },
      {
        step: 'RFE Processing',
        averageDuration: 60,
        casesAffected: Math.round((backlog.totalBacklog || 0) * 0.25)
      },
      {
        step: 'Interview Scheduling',
        averageDuration: 45,
        casesAffected: Math.round((backlog.totalBacklog || 0) * 0.2)
      }
    ]
  };
};

const USCISApplication = mongoose.model('USCISApplication', uscisApplicationSchema);

module.exports = USCISApplication;
