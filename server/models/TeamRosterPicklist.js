const mongoose = require('mongoose');

const teamRosterPicklistSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['role', 'branch', 'positionTitle'],
    unique: true
  },
  values: [{
    value: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  }],
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Update lastModified on save
teamRosterPicklistSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('TeamRosterPicklist', teamRosterPicklistSchema);
