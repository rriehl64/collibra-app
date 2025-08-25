const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A requirement title is required']
  },
  description: {
    type: String,
    required: [true, 'A requirement description is required']
  }
});

const formRequirementSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: [true, 'A form name is required']
  },
  formDescription: {
    type: String,
    required: [true, 'A form description is required']
  },
  formUrl: {
    type: String,
    required: [true, 'A form URL is required']
  }
});

const supportingDocSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A document title is required']
  },
  description: {
    type: String,
    required: [true, 'A document description is required']
  },
  isRequired: {
    type: Boolean,
    default: true
  }
});

const applicationTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A tip title is required']
  },
  description: {
    type: String,
    required: [true, 'A tip description is required']
  }
});

const E22ApplicationRequirementsSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: [true, 'Main title is required']
  },
  mainDescription: {
    type: String,
    required: [true, 'Main description is required']
  },
  generalRequirementsTitle: {
    type: String,
    required: [true, 'General requirements title is required']
  },
  generalRequirements: [requirementSchema],
  formsTitle: {
    type: String,
    required: [true, 'Forms title is required']
  },
  forms: [formRequirementSchema],
  supportingDocsTitle: {
    type: String,
    required: [true, 'Supporting documents title is required']
  },
  supportingDocuments: [supportingDocSchema],
  tipsTitle: {
    type: String,
    required: [true, 'Tips title is required']
  },
  applicationTips: [applicationTipSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String
  }
});

// Add a pre-save hook to update the lastUpdated date
E22ApplicationRequirementsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const E22ApplicationRequirements = mongoose.model('E22ApplicationRequirements', E22ApplicationRequirementsSchema);

module.exports = E22ApplicationRequirements;
