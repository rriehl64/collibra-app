const DataAsset = require('../models/DataAsset');
const Domain = require('../models/Domain');
const Task = require('../models/Task');
const Policy = require('../models/Policy');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get dashboard metrics
 * @route   GET /api/v1/dashboard/metrics
 * @access  Private
 */
exports.getDashboardMetrics = asyncHandler(async (req, res, next) => {
  // Get total count of data assets
  const totalAssets = await DataAsset.countDocuments();
  
  // Get assets created in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newAssetsThisMonth = await DataAsset.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  // Get total count of domains
  const totalDomains = await Domain.countDocuments();
  
  // Get count of active domains
  const activeDomains = await Domain.countDocuments({ status: 'Active' });
  
  // Calculate compliance percentage
  const complianceData = await DataAsset.aggregate([
    {
      $group: {
        _id: '$governance.complianceStatus',
        count: { $sum: 1 }
      }
    }
  ]);
  
  let compliantAssets = 0;
  let totalAssetsForCompliance = 0;
  
  complianceData.forEach(item => {
    if (item._id === 'Compliant') {
      compliantAssets = item.count;
    }
    if (item._id !== 'Not Applicable' && item._id !== null) {
      totalAssetsForCompliance += item.count;
    }
  });
  
  const compliancePercentage = totalAssetsForCompliance > 0 
    ? Math.round((compliantAssets / totalAssetsForCompliance) * 100)
    : 0;
  
  // Get compliance change from last month
  // For demo purposes, we'll set a fixed value
  const complianceChange = 2;
  
  // Get open tasks
  const openTasks = await Task.countDocuments({ 
    status: { $in: ['Open', 'In Progress'] }
  });
  
  // Get urgent tasks
  const urgentTasks = await Task.countDocuments({
    status: { $in: ['Open', 'In Progress'] },
    priority: 'Urgent'
  });
  
  // Get asset distribution by domain
  const assetsByDomain = await DataAsset.aggregate([
    {
      $group: {
        _id: '$domain',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        domain: '$_id',
        count: 1,
        _id: 0
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  // Calculate percentages for domain distribution with "Others" grouping
  const totalAssetCount = assetsByDomain.reduce((sum, item) => sum + item.count, 0);
  const TOP_DOMAINS_LIMIT = 8; // Show top 8 domains + Others
  
  let domainDistribution = [];
  let othersCount = 0;
  
  assetsByDomain.forEach((item, index) => {
    const percentage = Math.round((item.count / totalAssetCount) * 100);
    
    if (index < TOP_DOMAINS_LIMIT && percentage >= 2) {
      // Include in top domains if it's in top N and has at least 2%
      domainDistribution.push({
        domain: item.domain,
        count: item.count,
        percentage: percentage
      });
    } else {
      // Group into "Others"
      othersCount += item.count;
    }
  });
  
  // Add "Others" category if there are remaining domains
  if (othersCount > 0) {
    const othersPercentage = Math.round((othersCount / totalAssetCount) * 100);
    domainDistribution.push({
      domain: 'Others',
      count: othersCount,
      percentage: othersPercentage
    });
  }
  
  // Sort by count descending
  domainDistribution.sort((a, b) => b.count - a.count);
  
  // Get asset compliance status distribution
  const assetComplianceStatus = await DataAsset.aggregate([
    {
      $group: {
        _id: '$governance.complianceStatus',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);
  
  // Map compliance statuses to simplified categories for the chart
  const complianceStatusMapping = {
    'Compliant': 'Compliant',
    'Non-Compliant': 'Non-Compliant',
    'Unknown': 'Needs Review',
    'Not Applicable': 'Not Applicable'
  };
  
  const complianceStatusCounts = {
    'Compliant': 0,
    'Non-Compliant': 0,
    'Needs Review': 0
  };
  
  assetComplianceStatus.forEach(item => {
    const mappedStatus = complianceStatusMapping[item.status] || 'Needs Review';
    if (mappedStatus !== 'Not Applicable') {
      complianceStatusCounts[mappedStatus] = (complianceStatusCounts[mappedStatus] || 0) + item.count;
    }
  });
  
  // Format the response
  const metrics = {
    dataAssets: {
      total: totalAssets,
      newThisMonth: newAssetsThisMonth
    },
    dataDomains: {
      total: totalDomains,
      active: activeDomains
    },
    compliance: {
      percentage: compliancePercentage,
      changeFromLastMonth: complianceChange
    },
    tasks: {
      open: openTasks,
      urgent: urgentTasks
    },
    charts: {
      domainDistribution,
      complianceStatus: Object.entries(complianceStatusCounts).map(([status, count]) => ({
        status,
        count
      }))
    }
  };
  
  res.status(200).json({
    success: true,
    data: metrics
  });
});

/**
 * @desc    Get recent activities
 * @route   GET /api/v1/dashboard/activities
 * @access  Private
 */
exports.getRecentActivities = asyncHandler(async (req, res, next) => {
  // Placeholder for recent activities - in a real app, this would query from activity logs
  // For demo, we'll return some mock data
  const recentActivities = [
    {
      id: 1,
      type: 'asset_created',
      user: 'data.steward@example.com',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      details: {
        assetName: 'Customer Demographics',
        domain: 'Marketing'
      }
    },
    {
      id: 2,
      type: 'compliance_updated',
      user: 'admin@example.com',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      details: {
        assetName: 'Sales Pipeline',
        status: 'Compliant'
      }
    },
    {
      id: 3,
      type: 'task_completed',
      user: 'user@example.com',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      details: {
        taskName: 'Update Data Quality Documentation',
        domain: 'Finance'
      }
    }
  ];
  
  res.status(200).json({
    success: true,
    data: recentActivities
  });
});

/**
 * @desc    Get system health status
 * @route   GET /api/v1/dashboard/health
 * @access  Private
 */
exports.getSystemHealth = asyncHandler(async (req, res, next) => {
  // In a real app, this would check various system components
  // For demo, we'll return mock health status
  const healthStatus = {
    database: {
      status: 'healthy',
      latency: '25ms',
      connections: 12
    },
    api: {
      status: 'healthy',
      uptime: '99.9%',
      requests: {
        total: 15420,
        errors: 23
      }
    },
    services: [
      { name: 'Authentication', status: 'healthy' },
      { name: 'Storage', status: 'healthy' },
      { name: 'Search', status: 'healthy' },
      { name: 'Notifications', status: 'degraded', details: 'High latency' }
    ]
  };
  
  res.status(200).json({
    success: true,
    data: healthStatus
  });
});
