const mongoose = require('mongoose');

const dataLineageSchema = new mongoose.Schema({
  sourceAssetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataAsset',
    required: true,
    index: true
  },
  targetAssetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataAsset',
    required: true,
    index: true
  },
  relationshipType: {
    type: String,
    required: true,
    enum: [
      'feeds_into',
      'derived_from',
      'transforms_to',
      'aggregates_to',
      'copies_to',
      'references',
      'depends_on'
    ],
    default: 'feeds_into'
  },
  strength: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  metadata: {
    transformationType: String,
    frequency: {
      type: String,
      enum: ['real-time', 'batch', 'daily', 'weekly', 'monthly', 'on-demand']
    },
    lastUpdated: Date,
    dataVolume: String,
    qualityScore: Number,
    businessRules: [String],
    technicalNotes: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for efficient queries
dataLineageSchema.index({ sourceAssetId: 1, targetAssetId: 1 }, { unique: true });
dataLineageSchema.index({ sourceAssetId: 1, isActive: 1 });
dataLineageSchema.index({ targetAssetId: 1, isActive: 1 });
dataLineageSchema.index({ relationshipType: 1, isActive: 1 });

// Pre-save middleware to update timestamps
dataLineageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
dataLineageSchema.methods.getLineageDirection = function() {
  return {
    upstream: this.targetAssetId,
    downstream: this.sourceAssetId
  };
};

// Static methods
dataLineageSchema.statics.getAssetLineage = async function(assetId, direction = 'both', depth = 3) {
  const lineageMap = new Map();
  const visited = new Set();
  
  const traverse = async (currentAssetId, currentDepth, isUpstream) => {
    if (currentDepth > depth || visited.has(currentAssetId.toString())) {
      return;
    }
    
    visited.add(currentAssetId.toString());
    
    let query;
    if (isUpstream) {
      query = { targetAssetId: currentAssetId, isActive: true };
    } else {
      query = { sourceAssetId: currentAssetId, isActive: true };
    }
    
    const relationships = await this.find(query)
      .populate('sourceAssetId targetAssetId');
    
    for (const rel of relationships) {
      const key = `${rel.sourceAssetId._id}-${rel.targetAssetId._id}`;
      if (!lineageMap.has(key)) {
        lineageMap.set(key, {
          source: rel.sourceAssetId,
          target: rel.targetAssetId,
          relationship: rel
        });
        
        const nextAssetId = isUpstream ? rel.sourceAssetId._id : rel.targetAssetId._id;
        await traverse(nextAssetId, currentDepth + 1, isUpstream);
      }
    }
  };
  
  if (direction === 'upstream' || direction === 'both') {
    await traverse(assetId, 0, true);
  }
  
  if (direction === 'downstream' || direction === 'both') {
    await traverse(assetId, 0, false);
  }
  
  return Array.from(lineageMap.values());
};

dataLineageSchema.statics.createLineageRelationship = async function(sourceId, targetId, relationshipType, metadata = {}, createdBy) {
  // Check if relationship already exists
  const existing = await this.findOne({
    sourceAssetId: sourceId,
    targetAssetId: targetId
  });
  
  if (existing) {
    // Update existing relationship
    existing.relationshipType = relationshipType;
    existing.metadata = { ...existing.metadata, ...metadata };
    existing.updatedAt = new Date();
    existing.createdBy = createdBy;
    return await existing.save();
  }
  
  // Create new relationship
  return await this.create({
    sourceAssetId: sourceId,
    targetAssetId: targetId,
    relationshipType,
    metadata,
    createdBy
  });
};

module.exports = mongoose.model('DataLineage', dataLineageSchema);
