const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const E22DataChallengesSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    intro: { type: String, required: true },
    challengesTitle: { type: String, required: true },
    challenges: [itemSchema],
    mitigationTitle: { type: String, required: true },
    mitigations: [itemSchema],
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: String }
  },
  { timestamps: true }
);

E22DataChallengesSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('E22DataChallenges', E22DataChallengesSchema);
