const mongoose = require('mongoose');

const WeeklyStatusSchema = new mongoose.Schema(
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
    weekStart: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'green',
      index: true
    },
    summary: { type: String, trim: true },
    accomplishments: { type: String, trim: true },
    tasksStatus: { type: String, trim: true },
    issuesNeeds: { type: String, trim: true },
    nextSteps: { type: String, trim: true },
    hoursWorked: { type: Number, min: 0, max: 100 },
    communications: { type: String, trim: true },
    tags: [{ type: String, trim: true }],

    createdBy: { type: String, trim: true },
    updatedBy: { type: String, trim: true }
  },
  { timestamps: true }
);

// Unique per user per ISO week
WeeklyStatusSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

// Team + weekStart for fast filtering
WeeklyStatusSchema.index({ team: 1, weekStart: -1 });

// Full-text search over relevant narrative fields
WeeklyStatusSchema.index({
  summary: 'text',
  accomplishments: 'text',
  tasksStatus: 'text',
  issuesNeeds: 'text',
  nextSteps: 'text',
  communications: 'text'
});

// Virtual end-of-week (Sunday 23:59:59.999 UTC)
WeeklyStatusSchema.virtual('weekEnd').get(function () {
  if (!this.weekStart) return null;
  const d = new Date(this.weekStart);
  d.setUTCDate(d.getUTCDate() + 6);
  d.setUTCHours(23, 59, 59, 999);
  return d;
});

module.exports = mongoose.model('WeeklyStatus', WeeklyStatusSchema);
