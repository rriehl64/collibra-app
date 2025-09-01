const mongoose = require('mongoose');

const MonthlyStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    team: {
      type: String,
      trim: true,
      required: true,
      index: true
    },
    contractNumber: {
      type: String,
      trim: true
    },
    periodOfPerformance: {
      type: String,
      trim: true
    },
    supervisor: {
      type: String,
      trim: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true
    },
    year: {
      type: Number,
      required: true,
      index: true
    },
    monthName: {
      type: String,
      required: true // e.g., "August 2025"
    },
    
    // Consolidated status (most frequent or worst status)
    overallStatus: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'green'
    },
    
    // Weekly status breakdown
    weeklyStatuses: [{
      weekStart: Date,
      status: {
        type: String,
        enum: ['green', 'yellow', 'red']
      }
    }],
    
    // Aggregated metrics
    totalHoursWorked: { type: Number, min: 0 },
    averageHoursPerWeek: { type: Number, min: 0 },
    weeksReported: { type: Number, min: 0, max: 5 },
    
    // Consolidated narratives
    monthlyAccomplishments: { type: String, trim: true },
    monthlyTasksStatus: { type: String, trim: true },
    monthlyIssuesNeeds: { type: String, trim: true },
    monthlyNextSteps: { type: String, trim: true },
    monthlyCommunications: { type: String, trim: true },
    
    // Summary
    executiveSummary: { type: String, trim: true },
    
    // Source weekly reports
    weeklyReportIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeeklyStatus'
    }],
    
    tags: [{ type: String, trim: true }],
    createdBy: { type: String, trim: true },
    updatedBy: { type: String, trim: true }
  },
  { timestamps: true }
);

// Unique per user per month/year
MonthlyStatusSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

// Team + month/year for fast filtering
MonthlyStatusSchema.index({ team: 1, year: -1, month: -1 });

// Full-text search over consolidated narratives
MonthlyStatusSchema.index({
  monthlyAccomplishments: 'text',
  monthlyTasksStatus: 'text',
  monthlyIssuesNeeds: 'text',
  monthlyNextSteps: 'text',
  monthlyCommunications: 'text',
  executiveSummary: 'text'
});

module.exports = mongoose.model('MonthlyStatus', MonthlyStatusSchema);
