const mongoose = require('mongoose');

// Schema for individual principle items
const principleItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

// Schema for principle categories
const principleSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  items: [principleItemSchema],
  order: {
    type: Number,
    default: 0
  }
});

// Schema for core practice items
const practiceItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

// Schema for core practices
const corePracticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  practices: [practiceItemSchema],
  order: {
    type: Number,
    default: 0
  }
});

// Schema for implementation actions
const implementationActionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

// Main Federal Data Strategy Schema
const federalDataStrategySchema = new mongoose.Schema({
  // Header Section
  title: {
    type: String,
    required: true,
    default: '2020 Federal Data Strategy Framework'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'A comprehensive 10-year vision for how the U.S. Federal Government will leverage data to deliver on its mission, serve the public, and steward resources in a secure, ethical, and effective manner.'
  },
  tags: [{
    type: String
  }],
  
  // Mission and Vision Section
  missionTitle: {
    type: String,
    required: true,
    default: 'Mission and Vision'
  },
  missionText: {
    type: String,
    required: true,
    default: 'The mission is to fully leverage federal data for mission, service, and public good by fostering practices of ethical governance, conscious design, and a learning culture throughout federal agencies.'
  },
  
  // Principles Section
  principlesTitle: {
    type: String,
    required: true,
    default: 'Ten Operating Principles'
  },
  principlesDescription: {
    type: String,
    required: true,
    default: 'The framework is built on ten operating principles, grouped into three foundational categories:'
  },
  principles: [principleSchema],
  
  // Core Practices Section
  practicesTitle: {
    type: String,
    required: true,
    default: 'Core Practices'
  },
  practicesDescription: {
    type: String,
    required: true,
    default: 'Forty aspirational best practices guide agencies in managing and using federal and federally-sponsored data:'
  },
  corePractices: [corePracticeSchema],
  
  // Implementation Section
  implementationTitle: {
    type: String,
    required: true,
    default: 'Implementation and Actions'
  },
  implementationDescription: {
    type: String,
    required: true,
    default: 'All executive branch agencies are required to implement the strategy through annual government-wide action plans, which prioritize steps for each year. The first year (2020) contained 20 specific, measurable actions focused on establishing foundational practices and shared solutions.'
  },
  implementationActions: [implementationActionSchema],
  
  // Resources Section
  resourcesTitle: {
    type: String,
    required: true,
    default: 'Resources'
  },
  resourcesDescription: {
    type: String,
    required: true,
    default: 'The full framework, details on principles, best practices, and yearly action plans are available at the official Federal Data Strategy website.'
  },
  resourcesUrl: {
    type: String,
    default: 'https://strategy.data.gov'
  },
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  lastUpdatedBy: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

// Create indexes for better performance
federalDataStrategySchema.index({ isActive: 1 });
federalDataStrategySchema.index({ version: 1 });

const FederalDataStrategy = mongoose.model('FederalDataStrategy', federalDataStrategySchema);

module.exports = FederalDataStrategy;
