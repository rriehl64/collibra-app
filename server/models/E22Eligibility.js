const mongoose = require('mongoose');

const eligibilityCriteriaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A criterion title is required']
  },
  description: {
    type: String,
    required: [true, 'A criterion description is required']
  }
});

const derivativeEligibilitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A derivative eligibility title is required']
  },
  description: {
    type: String,
    required: [true, 'A derivative eligibility description is required']
  }
});

const documentRequirementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A document requirement title is required']
  },
  description: {
    type: String,
    required: [true, 'A document requirement description is required']
  }
});

const E22EligibilitySchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: [true, 'Main title is required']
  },
  mainDescription: {
    type: String,
    required: [true, 'Main description is required']
  },
  criteriaTitle: {
    type: String,
    required: [true, 'Criteria section title is required']
  },
  eligibilityCriteria: [eligibilityCriteriaSchema],
  derivativeTitle: {
    type: String,
    required: [true, 'Derivative title is required']
  },
  derivativeIntro: {
    type: String,
    required: [true, 'Derivative introduction text is required']
  },
  derivativeEligibility: [derivativeEligibilitySchema],
  documentTitle: {
    type: String,
    required: [true, 'Document title is required']
  },
  documentIntro: {
    type: String,
    required: [true, 'Document introduction text is required']
  },
  documentRequirements: [documentRequirementSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String
  }
});

// Add a pre-save hook to update the lastUpdated date
E22EligibilitySchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const E22Eligibility = mongoose.model('E22Eligibility', E22EligibilitySchema);

module.exports = E22Eligibility;
