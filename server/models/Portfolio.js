const mongoose = require('mongoose');

/**
 * KPI Schema
 * Key Performance Indicators for portfolio tracking
 */
const KPISchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'KPI name is required'],
    trim: true,
    maxlength: [200, 'KPI name cannot exceed 200 characters']
  },
  current: {
    type: Number,
    required: [true, 'Current value is required']
  },
  target: {
    type: Number,
    required: [true, 'Target value is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    maxlength: [50, 'Unit cannot exceed 50 characters']
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  },
  status: {
    type: String,
    enum: ['good', 'warning', 'critical'],
    default: 'good'
  }
});

/**
 * Key Result Schema
 * Individual key results within an OKR
 */
const KeyResultSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Key result description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  current: {
    type: Number,
    required: [true, 'Current value is required']
  },
  target: {
    type: Number,
    required: [true, 'Target value is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    maxlength: [50, 'Unit cannot exceed 50 characters']
  }
});

/**
 * OKR Schema
 * Objectives and Key Results for portfolio alignment
 */
const OKRSchema = new mongoose.Schema({
  objective: {
    type: String,
    required: [true, 'Objective is required'],
    trim: true,
    maxlength: [500, 'Objective cannot exceed 500 characters']
  },
  keyResults: [KeyResultSchema]
});

/**
 * Risk Schema
 * Risk management for portfolios
 */
const RiskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Risk ID is required'],
    trim: true,
    maxlength: [50, 'Risk ID cannot exceed 50 characters']
  },
  title: {
    type: String,
    required: [true, 'Risk title is required'],
    trim: true,
    maxlength: [200, 'Risk title cannot exceed 200 characters']
  },
  level: {
    type: String,
    required: [true, 'Risk level is required'],
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  category: {
    type: String,
    required: [true, 'Risk category is required'],
    enum: ['Technical', 'Organizational', 'Compliance', 'Financial', 'Security']
  },
  mitigation: {
    type: String,
    required: [true, 'Risk mitigation is required'],
    trim: true,
    maxlength: [500, 'Mitigation cannot exceed 500 characters']
  },
  owner: {
    type: String,
    required: [true, 'Risk owner is required'],
    trim: true,
    maxlength: [200, 'Owner cannot exceed 200 characters']
  }
});

/**
 * Innovation Schema
 * Innovation tracking for portfolios
 */
const InnovationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Innovation ID is required'],
    trim: true,
    maxlength: [50, 'Innovation ID cannot exceed 50 characters']
  },
  title: {
    type: String,
    required: [true, 'Innovation title is required'],
    trim: true,
    maxlength: [200, 'Innovation title cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Innovation type is required'],
    enum: ['AI/ML', 'Automation', 'Analytics', 'Process']
  },
  impact: {
    type: String,
    required: [true, 'Innovation impact is required'],
    enum: ['High', 'Medium', 'Low']
  },
  aiFirst: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Innovation description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
});

/**
 * Milestone Schema
 * Project milestones within portfolios
 */
const MilestoneSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Milestone ID is required'],
    trim: true,
    maxlength: [50, 'Milestone ID cannot exceed 50 characters']
  },
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true,
    maxlength: [200, 'Milestone title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Milestone description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    required: [true, 'Milestone status is required'],
    enum: ['Not Started', 'In Progress', 'At Risk', 'Completed', 'Overdue']
  },
  priority: {
    type: String,
    required: [true, 'Milestone priority is required'],
    enum: ['Critical', 'High', 'Medium', 'Low']
  },
  owner: {
    type: String,
    required: [true, 'Milestone owner is required'],
    trim: true,
    maxlength: [200, 'Owner cannot exceed 200 characters']
  },
  portfolioId: {
    type: String,
    required: [true, 'Portfolio ID is required'],
    trim: true
  },
  dependencies: [{
    type: String,
    trim: true
  }],
  deliverables: [{
    type: String,
    required: [true, 'Deliverable is required'],
    trim: true,
    maxlength: [200, 'Deliverable cannot exceed 200 characters']
  }],
  riskLevel: {
    type: String,
    required: [true, 'Risk level is required'],
    enum: ['Low', 'Medium', 'High', 'Critical']
  }
});

/**
 * Project Schema
 * Individual projects within portfolios
 */
const ProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Project ID is required'],
    trim: true,
    maxlength: [50, 'Project ID cannot exceed 50 characters']
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: ['Planning', 'In Progress', 'On Hold', 'Completed']
  },
  progress: {
    type: Number,
    required: [true, 'Project progress is required'],
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be more than 100']
  },
  manager: {
    type: String,
    required: [true, 'Project manager is required'],
    trim: true,
    maxlength: [200, 'Manager cannot exceed 200 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  budget: {
    type: String,
    required: [true, 'Budget is required'],
    trim: true,
    maxlength: [50, 'Budget cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  }
});

/**
 * Portfolio Schema
 * Main portfolio management schema
 */
const PortfolioSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Portfolio ID is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Portfolio ID cannot exceed 50 characters']
  },
  name: {
    type: String,
    required: [true, 'Portfolio name is required'],
    trim: true,
    maxlength: [200, 'Portfolio name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Portfolio description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  manager: {
    type: String,
    required: [true, 'Portfolio manager is required'],
    trim: true,
    maxlength: [200, 'Manager cannot exceed 200 characters']
  },
  totalBudget: {
    type: String,
    required: [true, 'Total budget is required'],
    trim: true,
    maxlength: [50, 'Budget cannot exceed 50 characters']
  },
  status: {
    type: String,
    required: [true, 'Portfolio status is required'],
    enum: ['Active', 'Planning', 'On Hold']
  },
  currentState: {
    type: String,
    trim: true,
    maxlength: [500, 'Current state cannot exceed 500 characters']
  },
  futureState: {
    type: String,
    trim: true,
    maxlength: [500, 'Future state cannot exceed 500 characters']
  },
  aiReadiness: {
    type: Number,
    min: [0, 'AI readiness cannot be less than 0'],
    max: [100, 'AI readiness cannot be more than 100']
  },
  kpis: [KPISchema],
  okr: OKRSchema,
  risks: [RiskSchema],
  innovations: [InnovationSchema],
  milestones: [MilestoneSchema],
  projects: [ProjectSchema]
}, { 
  timestamps: true,
  collection: 'portfolios'
});

// Create indexes for better query performance
PortfolioSchema.index({ id: 1 });
PortfolioSchema.index({ name: 1 });
PortfolioSchema.index({ status: 1 });
PortfolioSchema.index({ manager: 1 });

// Create text index for search functionality
PortfolioSchema.index({
  name: 'text',
  description: 'text',
  'projects.name': 'text',
  'projects.description': 'text'
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
