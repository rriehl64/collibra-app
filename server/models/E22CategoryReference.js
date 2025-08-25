const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
});

const E22CategoryReferenceSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    intro: { type: String, required: true },
    references: [referenceSchema],
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: String }
  },
  { timestamps: true }
);

E22CategoryReferenceSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('E22CategoryReference', E22CategoryReferenceSchema);
