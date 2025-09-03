const DataLineage = require('../models/DataLineage');
const DataAsset = require('../models/DataAsset');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

// @desc    Get lineage for a specific data asset
// @route   GET /api/data-assets/:id/lineage
// @access  Private
exports.getAssetLineage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { direction = 'both', depth = 3 } = req.query;

  // Validate asset exists
  const asset = await DataAsset.findById(id);
  if (!asset) {
    return next(new AppError('Data asset not found', 404));
  }

  // Get lineage relationships
  const lineageData = await DataLineage.getAssetLineage(id, direction, parseInt(depth));

  // Build nodes and links for visualization
  const nodesMap = new Map();
  const links = [];

  // Add the center asset
  nodesMap.set(id, {
    id: asset._id.toString(),
    name: asset.name,
    type: asset.type,
    domain: asset.domain,
    isCenter: true,
    level: 0,
    asset: asset
  });

  // Process lineage relationships
  lineageData.forEach((lineage, index) => {
    const sourceId = lineage.source._id.toString();
    const targetId = lineage.target._id.toString();

    // Add source node
    if (!nodesMap.has(sourceId)) {
      const level = sourceId === id ? 0 : (sourceId === id ? 0 : -1);
      nodesMap.set(sourceId, {
        id: sourceId,
        name: lineage.source.name,
        type: lineage.source.type,
        domain: lineage.source.domain,
        isCenter: sourceId === id,
        level: level,
        asset: lineage.source
      });
    }

    // Add target node
    if (!nodesMap.has(targetId)) {
      const level = targetId === id ? 0 : (targetId === id ? 0 : 1);
      nodesMap.set(targetId, {
        id: targetId,
        name: lineage.target.name,
        type: lineage.target.type,
        domain: lineage.target.domain,
        isCenter: targetId === id,
        level: level,
        asset: lineage.target
      });
    }

    // Add link
    links.push({
      source: sourceId,
      target: targetId,
      type: lineage.relationship.relationshipType,
      strength: lineage.relationship.strength,
      metadata: lineage.relationship.metadata
    });
  });

  const nodes = Array.from(nodesMap.values());

  res.status(200).json({
    success: true,
    data: {
      asset: asset,
      lineage: {
        nodes: nodes,
        links: links
      },
      metadata: {
        totalRelationships: lineageData.length,
        upstreamCount: links.filter(l => l.target === id).length,
        downstreamCount: links.filter(l => l.source === id).length,
        depth: parseInt(depth),
        direction: direction
      }
    }
  });
});

// @desc    Create lineage relationship
// @route   POST /api/lineage
// @access  Private
exports.createLineageRelationship = asyncHandler(async (req, res, next) => {
  const { sourceAssetId, targetAssetId, relationshipType, metadata = {} } = req.body;
  const createdBy = req.user?.email || 'system';

  // Validate both assets exist
  const [sourceAsset, targetAsset] = await Promise.all([
    DataAsset.findById(sourceAssetId),
    DataAsset.findById(targetAssetId)
  ]);

  if (!sourceAsset) {
    return next(new AppError('Source asset not found', 404));
  }
  if (!targetAsset) {
    return next(new AppError('Target asset not found', 404));
  }

  // Prevent self-referencing relationships
  if (sourceAssetId === targetAssetId) {
    return next(new AppError('Cannot create lineage relationship to the same asset', 400));
  }

  const lineage = await DataLineage.createLineageRelationship(
    sourceAssetId,
    targetAssetId,
    relationshipType,
    metadata,
    createdBy
  );

  await lineage.populate('sourceAssetId targetAssetId');

  res.status(201).json({
    success: true,
    data: lineage
  });
});

// @desc    Get all lineage relationships
// @route   GET /api/lineage
// @access  Private
exports.getAllLineage = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 50, relationshipType, isActive = true } = req.query;

  const query = { isActive };
  if (relationshipType) {
    query.relationshipType = relationshipType;
  }

  const lineage = await DataLineage.find(query)
    .populate('sourceAssetId', 'name type domain')
    .populate('targetAssetId', 'name type domain')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await DataLineage.countDocuments(query);

  res.status(200).json({
    success: true,
    count: lineage.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: lineage
  });
});

// @desc    Update lineage relationship
// @route   PUT /api/lineage/:id
// @access  Private
exports.updateLineageRelationship = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { relationshipType, metadata, strength, isActive } = req.body;

  const lineage = await DataLineage.findById(id);
  if (!lineage) {
    return next(new AppError('Lineage relationship not found', 404));
  }

  // Update fields
  if (relationshipType) lineage.relationshipType = relationshipType;
  if (metadata) lineage.metadata = { ...lineage.metadata, ...metadata };
  if (strength !== undefined) lineage.strength = strength;
  if (isActive !== undefined) lineage.isActive = isActive;

  await lineage.save();
  await lineage.populate('sourceAssetId targetAssetId');

  res.status(200).json({
    success: true,
    data: lineage
  });
});

// @desc    Delete lineage relationship
// @route   DELETE /api/lineage/:id
// @access  Private
exports.deleteLineageRelationship = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const lineage = await DataLineage.findById(id);
  if (!lineage) {
    return next(new AppError('Lineage relationship not found', 404));
  }

  // Soft delete by setting isActive to false
  lineage.isActive = false;
  await lineage.save();

  res.status(200).json({
    success: true,
    message: 'Lineage relationship deleted successfully'
  });
});

// @desc    Get lineage statistics
// @route   GET /api/lineage/stats
// @access  Private
exports.getLineageStats = asyncHandler(async (req, res, next) => {
  const stats = await DataLineage.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$relationshipType',
        count: { $sum: 1 },
        avgStrength: { $avg: '$strength' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const totalRelationships = await DataLineage.countDocuments({ isActive: true });
  const totalAssets = await DataAsset.countDocuments();

  // Calculate assets with lineage
  const assetsWithLineage = await DataLineage.distinct('sourceAssetId', { isActive: true });
  const assetsWithLineageCount = new Set([
    ...assetsWithLineage,
    ...(await DataLineage.distinct('targetAssetId', { isActive: true }))
  ]).size;

  res.status(200).json({
    success: true,
    data: {
      totalRelationships,
      totalAssets,
      assetsWithLineage: assetsWithLineageCount,
      coveragePercentage: totalAssets > 0 ? ((assetsWithLineageCount / totalAssets) * 100).toFixed(2) : 0,
      relationshipTypes: stats
    }
  });
});
