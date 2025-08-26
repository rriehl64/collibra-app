const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const E22LegalFoundationSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    mainDescription: { type: String, required: true },
    keyPrinciplesTitle: { type: String, required: true },
    keyPrinciples: [{ type: String, required: true }],
    referencesTitle: { type: String, required: true },
    references: [referenceSchema],
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: String }
  },
  { timestamps: true }
);

E22LegalFoundationSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('E22LegalFoundation', E22LegalFoundationSchema);
