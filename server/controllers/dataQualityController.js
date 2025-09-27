const DataAsset = require('../models/DataAsset');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

// @desc    Get overall data quality metrics
// @route   GET /api/v1/data-quality/metrics
// @access  Admin/Data Steward
exports.getDataQualityMetrics = asyncHandler(async (req, res, next) => {
  try {
    // Get all data assets
    const totalAssets = await DataAsset.countDocuments();
    
    if (totalAssets === 0) {
      return res.status(200).json({
        success: true,
        data: {
          overallScore: 0,
          totalAssets: 0,
          assetsWithQualityIssues: 0,
          completenessScore: 0,
          accuracyScore: 0,
          consistencyScore: 0,
          validityScore: 0,
          lastUpdated: new Date().toISOString()
        }
      });
    }

    // Calculate quality metrics based on data asset completeness
    const assets = await DataAsset.find({}, {
      name: 1,
      description: 1,
      dataOwner: 1,
      dataSteward: 1,
      businessGlossary: 1,
      dataClassification: 1,
      retentionPeriod: 1,
      lastUpdated: 1
    });

    let totalQualityScore = 0;
    let assetsWithIssues = 0;
    let completenessTotal = 0;
    let accuracyTotal = 0;
    let consistencyTotal = 0;
    let validityTotal = 0;

    assets.forEach(asset => {
      // Completeness Score (based on required fields)
      let completenessScore = 0;
      const requiredFields = ['name', 'description', 'dataOwner', 'dataSteward'];
      const completedFields = requiredFields.filter(field => 
        asset[field] && asset[field].toString().trim() !== ''
      ).length;
      completenessScore = (completedFields / requiredFields.length) * 100;

      // Accuracy Score (based on data freshness and valid classifications)
      let accuracyScore = 100;
      if (asset.lastUpdated) {
        const daysSinceUpdate = (new Date() - new Date(asset.lastUpdated)) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate > 90) accuracyScore -= 30; // Penalize old data
        else if (daysSinceUpdate > 30) accuracyScore -= 15;
      } else {
        accuracyScore -= 40; // No update date
      }

      // Consistency Score (based on naming conventions and classification)
      let consistencyScore = 100;
      if (!asset.name || asset.name.length < 3) consistencyScore -= 25;
      if (!asset.dataClassification) consistencyScore -= 25;
      if (!asset.businessGlossary || asset.businessGlossary.length === 0) consistencyScore -= 20;

      // Validity Score (based on proper data owner assignment and retention)
      let validityScore = 100;
      if (!asset.dataOwner) validityScore -= 40;
      if (!asset.dataSteward) validityScore -= 30;
      if (!asset.retentionPeriod) validityScore -= 30;

      // Calculate overall asset score
      const assetScore = (completenessScore + accuracyScore + consistencyScore + validityScore) / 4;
      
      if (assetScore < 80) {
        assetsWithIssues++;
      }

      totalQualityScore += assetScore;
      completenessTotal += completenessScore;
      accuracyTotal += accuracyScore;
      consistencyTotal += consistencyScore;
      validityTotal += validityScore;
    });

    const overallScore = Math.round(totalQualityScore / assets.length);
    const completenessScore = Math.round(completenessTotal / assets.length);
    const accuracyScore = Math.round(accuracyTotal / assets.length);
    const consistencyScore = Math.round(consistencyTotal / assets.length);
    const validityScore = Math.round(validityTotal / assets.length);

    res.status(200).json({
      success: true,
      data: {
        overallScore,
        totalAssets,
        assetsWithQualityIssues: assetsWithIssues,
        completenessScore,
        accuracyScore,
        consistencyScore,
        validityScore,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error calculating data quality metrics:', error);
    return next(new AppError('Error calculating data quality metrics', 500));
  }
});

// @desc    Get data quality breakdown by asset
// @route   GET /api/v1/data-quality/assets-breakdown
// @access  Admin/Data Steward
exports.getAssetQualityBreakdown = asyncHandler(async (req, res, next) => {
  try {
    const assets = await DataAsset.find({}, {
      name: 1,
      description: 1,
      dataOwner: 1,
      dataSteward: 1,
      dataClassification: 1,
      lastUpdated: 1
    }).limit(50); // Limit for performance

    const breakdown = assets.map(asset => {
      // Calculate quality score for this asset (simplified version)
      let score = 100;
      if (!asset.description || asset.description.trim() === '') score -= 25;
      if (!asset.dataOwner) score -= 25;
      if (!asset.dataSteward) score -= 25;
      if (!asset.dataClassification) score -= 25;

      return {
        id: asset._id,
        name: asset.name,
        qualityScore: Math.max(0, score),
        issues: [
          ...((!asset.description || asset.description.trim() === '') ? ['Missing description'] : []),
          ...(!asset.dataOwner ? ['Missing data owner'] : []),
          ...(!asset.dataSteward ? ['Missing data steward'] : []),
          ...(!asset.dataClassification ? ['Missing classification'] : [])
        ]
      };
    });

    res.status(200).json({
      success: true,
      data: breakdown
    });

  } catch (error) {
    console.error('Error getting asset quality breakdown:', error);
    return next(new AppError('Error getting asset quality breakdown', 500));
  }
});

// @desc    Get data quality scores by domain
// @route   GET /api/v1/data-quality/domain-scores
// @access  Admin/Data Steward
exports.getDomainQualityScores = asyncHandler(async (req, res, next) => {
  try {
    // Group assets by domain and calculate quality scores
    const domainAggregation = await DataAsset.aggregate([
      {
        $group: {
          _id: '$dataDomain',
          totalAssets: { $sum: 1 },
          assetsWithOwner: {
            $sum: {
              $cond: [{ $ne: ['$dataOwner', null] }, 1, 0]
            }
          },
          assetsWithSteward: {
            $sum: {
              $cond: [{ $ne: ['$dataSteward', null] }, 1, 0]
            }
          },
          assetsWithDescription: {
            $sum: {
              $cond: [
                { $and: [
                  { $ne: ['$description', null] },
                  { $ne: ['$description', ''] }
                ]}, 1, 0
              ]
            }
          }
        }
      },
      {
        $project: {
          domain: '$_id',
          totalAssets: 1,
          qualityScore: {
            $round: {
              $multiply: [
                {
                  $divide: [
                    { $add: ['$assetsWithOwner', '$assetsWithSteward', '$assetsWithDescription'] },
                    { $multiply: ['$totalAssets', 3] }
                  ]
                },
                100
              ]
            }
          }
        }
      },
      { $sort: { qualityScore: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: domainAggregation
    });

  } catch (error) {
    console.error('Error getting domain quality scores:', error);
    return next(new AppError('Error getting domain quality scores', 500));
  }
});
