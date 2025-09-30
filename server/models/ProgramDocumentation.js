const mongoose = require('mongoose');

const documentationSectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  content: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['Complete', 'In Progress', 'Not Started'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'System'
  }
});

const programDocumentationSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  projectName: {
    type: String,
    required: true
  },
  portfolioId: {
    type: String,
    required: true,
    index: true
  },
  sections: [documentationSectionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'System'
  },
  version: {
    type: Number,
    default: 1
  }
});

// Update the updatedAt field before saving
programDocumentationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
programDocumentationSchema.index({ projectId: 1, portfolioId: 1 });
programDocumentationSchema.index({ 'sections.id': 1 });

module.exports = mongoose.model('ProgramDocumentation', programDocumentationSchema);
