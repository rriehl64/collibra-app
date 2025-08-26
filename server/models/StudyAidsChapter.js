const mongoose = require('mongoose');

// Study Aids: Business Analytics Chapter schema
// Mirrors the BaChapter interface used in the frontend `src/services/studyAids.ts`
// Fields are designed to be optional where appropriate to allow incremental content authoring.
const ResourceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ApplicationSchema = new mongoose.Schema(
  {
    context: { type: String, required: true },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const StudyAidsChapterSchema = new mongoose.Schema(
  {
    // Keep a string id aligned with frontend expectations ("1", "2", ...)
    id: { type: String, required: true, unique: true, index: true },
    number: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    objectives: { type: [String], default: [] },
    summary: { type: String, default: '' },
    resources: { type: [ResourceSchema], default: [] },
    tags: { type: [String], default: [] },
    teachingPoints: { type: [String], default: [] },
    keyTakeaways: { type: [String], default: [] },
    applications: { type: [ApplicationSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyAidsChapter', StudyAidsChapterSchema);
