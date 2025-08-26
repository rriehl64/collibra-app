const mongoose = require('mongoose');

const KpiSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    definition: { type: String, default: '' },
    calculationMethod: { type: String, default: '' },
    dataSources: { type: [String], default: [] },
    frequency: { type: String, default: 'Monthly' },
    owner: { type: String, default: '' },
    category: { type: String, default: '' },
    tags: { type: [String], default: [] },
    currentValue: { type: Number, default: null },
    targetValue: { type: Number, default: null },
    unit: { type: String, default: '' },
    trend: { type: String, enum: ['up', 'down', 'flat', ''], default: '' },
    relatedKPIs: { type: [String], default: [] },
    target: { type: String, default: '' },
    thresholds: { type: String, default: '' },
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, collection: 'kpis' }
);

module.exports = mongoose.model('Kpi', KpiSchema);
