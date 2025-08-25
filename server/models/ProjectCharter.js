const mongoose = require('mongoose');

/**
 * ProjectCharter Schema
 * Stores data for the Project Charter module form
 */
const ProjectCharterSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: [true, 'Title is required'] },
    problemStatement: { type: String, trim: true, default: '' },
    missionAlignment: { type: String, trim: true, default: '' },
    objectivesKpis: { type: String, trim: true, default: '' },
    inScope: { type: String, trim: true, default: '' },
    outOfScope: { type: String, trim: true, default: '' },
    stakeholdersRaci: { type: String, trim: true, default: '' },
    assumptionsConstraints: { type: String, trim: true, default: '' },
    risksMitigations: { type: String, trim: true, default: '' },
    timelineMilestones: { type: String, trim: true, default: '' },
    decisionCadence: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, collection: 'projectcharters' }
);

module.exports = mongoose.model('ProjectCharter', ProjectCharterSchema);
