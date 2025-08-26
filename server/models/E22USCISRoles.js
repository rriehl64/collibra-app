const mongoose = require('mongoose');

const bulletSchema = new mongoose.Schema({
  text: { type: String, required: true }
});

const roleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bullets: [bulletSchema]
});

const E22USCISRolesSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    intro: { type: String, required: true },
    primaryRoles: [roleSchema],
    supportingRoles: [roleSchema],
    workflowTitle: { type: String, required: true },
    workflowSteps: [bulletSchema],
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: String }
  },
  { timestamps: true }
);

E22USCISRolesSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('E22USCISRoles', E22USCISRolesSchema);
