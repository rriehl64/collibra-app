const mongoose = require('mongoose');

const menuSettingsSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['primary', 'secondary', 'administration'],
    default: 'primary'
  },
  order: {
    type: Number,
    default: 0
  },
  requiredRole: {
    type: String,
    enum: ['user', 'data-steward', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Index for efficient queries
menuSettingsSchema.index({ category: 1, order: 1 });
menuSettingsSchema.index({ isEnabled: 1 });

module.exports = mongoose.model('MenuSettings', menuSettingsSchema);
