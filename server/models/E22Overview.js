const mongoose = require('mongoose');

/**
 * E22Overview Schema
 * Stores content for the E22 Classification Overview tab
 */
const E22OverviewSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: [true, 'Main title is required'],
    trim: true,
    default: 'What Is E22?'
  },
  mainDescription: {
    type: String,
    required: [true, 'Main description is required'],
    trim: true,
    default: 'E22 is a U.S. immigration code indicating a lawful permanent resident status for the spouse of a principal EB-2 immigrant (advanced degree professional or person of exceptional ability). EB-2 is a sought-after employment-based green card preference category.'
  },
  featuresTitle: {
    type: String,
    required: [true, 'Features title is required'],
    trim: true,
    default: 'Key Features of E22 Classification'
  },
  keyFeatures: [{
    title: {
      type: String,
      required: [true, 'Feature title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Feature description is required'],
      trim: true
    }
  }],
  importanceTitle: {
    type: String,
    required: [true, 'Importance title is required'],
    trim: true,
    default: 'Importance in the Immigration System'
  },
  importanceDescription: [{
    paragraph: {
      type: String,
      required: [true, 'Paragraph text is required'],
      trim: true
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('E22Overview', E22OverviewSchema);
