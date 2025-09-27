const ProcessMonitor = require('../models/ProcessMonitor');
const AutomatedProcess = require('../models/AutomatedProcess');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all process monitors
// @route   GET /api/v1/process-monitoring
// @access  Private (Admin/Data Steward)
exports.getProcessMonitors = async (req, res) => {
  try {
    const {
      status,
      severity,
      processId,
      search,
      page = 1,
      limit = 20,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (status) filter['currentMetrics.status'] = status;
    if (processId) filter.processId = processId;
    if (severity) filter['activeAlerts.severity'] = severity;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { processName: { $regex: search, $options: 'i' } },
        { 'activeAlerts.message': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population
    const monitors = await ProcessMonitor.find(filter)
      .populate('processId', 'name category status')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('activeAlerts.acknowledgedBy', 'name email')
      .populate('activeAlerts.resolvedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await ProcessMonitor.countDocuments(filter);

    // Calculate summary statistics
    const stats = await ProcessMonitor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalMonitors: { $sum: 1 },
          healthyProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Healthy'] }, 1, 0] }
          },
          warningProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Warning'] }, 1, 0] }
          },
          criticalProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Critical'] }, 1, 0] }
          },
          downProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Down'] }, 1, 0] }
          },
          totalActiveAlerts: { $sum: { $size: '$activeAlerts' } },
          avgHealthScore: { $avg: '$healthScore' }
        }
      }
    ]);

    const summary = stats[0] || {
      totalMonitors: 0,
      healthyProcesses: 0,
      warningProcesses: 0,
      criticalProcesses: 0,
      downProcesses: 0,
      totalActiveAlerts: 0,
      avgHealthScore: 0
    };

    // Calculate overall health percentage
    summary.overallHealth = summary.totalMonitors > 0 
      ? ((summary.healthyProcesses / summary.totalMonitors) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      count: monitors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      summary,
      data: monitors
    });
  } catch (error) {
    console.error('Error fetching process monitors:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch process monitors'
    });
  }
};

// @desc    Get single process monitor
// @route   GET /api/v1/process-monitoring/:id
// @access  Private (Admin/Data Steward)
exports.getProcessMonitor = async (req, res) => {
  try {
    const monitor = await ProcessMonitor.findById(req.params.id)
      .populate('processId', 'name category status description')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('activeAlerts.acknowledgedBy', 'name email')
      .populate('activeAlerts.resolvedBy', 'name email');

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: monitor
    });
  } catch (error) {
    console.error('Error fetching process monitor:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch process monitor'
    });
  }
};

// @desc    Create new process monitor
// @route   POST /api/v1/process-monitoring
// @access  Private (Admin/Data Steward)
exports.createProcessMonitor = async (req, res) => {
  try {
    // Verify the process exists
    const process = await AutomatedProcess.findById(req.body.processId);
    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    // Check if monitor already exists for this process
    const existingMonitor = await ProcessMonitor.findOne({
      processId: req.body.processId,
      isActive: true
    });

    if (existingMonitor) {
      return res.status(400).json({
        success: false,
        error: 'Monitor already exists for this process'
      });
    }

    // Add user info and process name
    req.body.createdBy = req.user.id;
    req.body.processName = process.name;

    // Set default thresholds if not provided
    if (!req.body.thresholds) {
      req.body.thresholds = {
        maxExecutionTime: 300000, // 5 minutes
        maxMemoryUsage: 512, // MB
        maxCpuUsage: 80, // %
        minSuccessRate: 95, // %
        maxConsecutiveFailures: 3
      };
    }

    // Set default alert settings if not provided
    if (!req.body.alertSettings) {
      req.body.alertSettings = {
        enabled: true,
        channels: [{
          type: 'Email',
          configuration: {
            recipients: [req.user.email]
          },
          isActive: true
        }],
        escalationRules: [{
          level: 'Warning',
          delayMinutes: 15,
          recipients: [req.user.email],
          actions: ['Send_Email']
        }]
      };
    }

    const monitor = await ProcessMonitor.create(req.body);

    // Populate the response
    const populatedMonitor = await ProcessMonitor.findById(monitor._id)
      .populate('processId', 'name category status')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMonitor
    });
  } catch (error) {
    console.error('Error creating process monitor:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to create process monitor'
    });
  }
};

// @desc    Update process monitor
// @route   PUT /api/v1/process-monitoring/:id
// @access  Private (Admin/Data Steward)
exports.updateProcessMonitor = async (req, res) => {
  try {
    let monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    // Add updated by user
    req.body.updatedBy = req.user.id;

    monitor = await ProcessMonitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('processId', 'name category status')
     .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: monitor
    });
  } catch (error) {
    console.error('Error updating process monitor:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update process monitor'
    });
  }
};

// @desc    Delete process monitor (soft delete)
// @route   DELETE /api/v1/process-monitoring/:id
// @access  Private (Admin only)
exports.deleteProcessMonitor = async (req, res) => {
  try {
    const monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    // Soft delete by setting isActive to false
    monitor.isActive = false;
    monitor.updatedBy = req.user.id;
    await monitor.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting process monitor:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to delete process monitor'
    });
  }
};

// @desc    Get monitoring dashboard analytics
// @route   GET /api/v1/process-monitoring/analytics/dashboard
// @access  Private (Admin/Data Steward)
exports.getMonitoringDashboard = async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '1h':
        startDate = new Date(now.getTime() - (60 * 60 * 1000));
        break;
      case '24h':
        startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        break;
      case '7d':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '30d':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      default:
        startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    }

    // Get overall monitoring statistics
    const overallStats = await ProcessMonitor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalMonitors: { $sum: 1 },
          healthyProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Healthy'] }, 1, 0] }
          },
          warningProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Warning'] }, 1, 0] }
          },
          criticalProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Critical'] }, 1, 0] }
          },
          downProcesses: {
            $sum: { $cond: [{ $eq: ['$currentMetrics.status', 'Down'] }, 1, 0] }
          },
          totalActiveAlerts: { $sum: { $size: '$activeAlerts' } },
          avgResponseTime: { $avg: '$currentMetrics.responseTime' },
          avgMemoryUsage: { $avg: '$currentMetrics.memoryUsage' },
          avgCpuUsage: { $avg: '$currentMetrics.cpuUsage' }
        }
      }
    ]);

    // Get alert statistics by severity
    const alertStats = await ProcessMonitor.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$activeAlerts' },
      {
        $group: {
          _id: '$activeAlerts.severity',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get performance trends
    const performanceTrends = await ProcessMonitor.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$performanceHistory' },
      {
        $match: {
          'performanceHistory.timestamp': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$performanceHistory.timestamp' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$performanceHistory.timestamp' } }
          },
          avgResponseTime: { $avg: '$performanceHistory.metrics.responseTime' },
          avgMemoryUsage: { $avg: '$performanceHistory.metrics.memoryUsage' },
          avgCpuUsage: { $avg: '$performanceHistory.metrics.cpuUsage' },
          errorCount: { $sum: '$performanceHistory.metrics.errorCount' },
          successCount: { $sum: '$performanceHistory.metrics.successCount' }
        }
      },
      { $sort: { '_id.date': 1, '_id.hour': 1 } }
    ]);

    // Get top processes by alert count
    const topAlertProcesses = await ProcessMonitor.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          processName: 1,
          processId: 1,
          alertCount: { $size: '$activeAlerts' },
          currentStatus: '$currentMetrics.status'
        }
      },
      { $match: { alertCount: { $gt: 0 } } },
      { $sort: { alertCount: -1 } },
      { $limit: 10 }
    ]);

    // Get SLA compliance summary
    const slaCompliance = await ProcessMonitor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgAvailability: { $avg: '$slaStatus.currentAvailability' },
          avgResponseTime: { $avg: '$slaStatus.currentResponseTime' },
          avgThroughput: { $avg: '$slaStatus.currentThroughput' },
          avgErrorRate: { $avg: '$slaStatus.currentErrorRate' }
        }
      }
    ]);

    // Get recent alerts
    const recentAlerts = await ProcessMonitor.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$activeAlerts' },
      {
        $project: {
          processName: 1,
          processId: 1,
          alert: '$activeAlerts'
        }
      },
      { $sort: { 'alert.triggeredAt': -1 } },
      { $limit: 20 }
    ]);

    const summary = overallStats[0] || {
      totalMonitors: 0,
      healthyProcesses: 0,
      warningProcesses: 0,
      criticalProcesses: 0,
      downProcesses: 0,
      totalActiveAlerts: 0,
      avgResponseTime: 0,
      avgMemoryUsage: 0,
      avgCpuUsage: 0
    };

    // Calculate health percentage
    summary.healthPercentage = summary.totalMonitors > 0 
      ? ((summary.healthyProcesses / summary.totalMonitors) * 100).toFixed(2)
      : 0;

    // Format alert statistics
    const alertBreakdown = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };
    
    alertStats.forEach(stat => {
      alertBreakdown[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        summary,
        alertBreakdown,
        performanceTrends,
        topAlertProcesses,
        slaCompliance: slaCompliance[0] || {},
        recentAlerts,
        timeframe
      }
    });
  } catch (error) {
    console.error('Error fetching monitoring dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch monitoring dashboard'
    });
  }
};

// @desc    Add performance data to monitor
// @route   POST /api/v1/process-monitoring/:id/performance
// @access  Private (Admin/Data Steward)
exports.addPerformanceData = async (req, res) => {
  try {
    const monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    const { metrics, status = 'Healthy' } = req.body;

    if (!metrics) {
      return res.status(400).json({
        success: false,
        error: 'Performance metrics are required'
      });
    }

    // Add performance data
    await monitor.addPerformanceData(metrics, status);

    // Check thresholds and trigger alerts if needed
    await checkThresholdsAndTriggerAlerts(monitor, metrics);

    res.status(200).json({
      success: true,
      message: 'Performance data added successfully',
      data: {
        currentMetrics: monitor.currentMetrics,
        healthScore: monitor.healthScore
      }
    });
  } catch (error) {
    console.error('Error adding performance data:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to add performance data'
    });
  }
};

// @desc    Trigger manual alert
// @route   POST /api/v1/process-monitoring/:id/alerts
// @access  Private (Admin/Data Steward)
exports.triggerAlert = async (req, res) => {
  try {
    const monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    const { alertType, severity, message, metadata = {} } = req.body;

    if (!alertType || !severity || !message) {
      return res.status(400).json({
        success: false,
        error: 'Alert type, severity, and message are required'
      });
    }

    const alert = await monitor.triggerAlert(alertType, severity, message, metadata);

    res.status(201).json({
      success: true,
      message: 'Alert triggered successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error triggering alert:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to trigger alert'
    });
  }
};

// @desc    Acknowledge alert
// @route   PATCH /api/v1/process-monitoring/:id/alerts/:alertId/acknowledge
// @access  Private (Admin/Data Steward)
exports.acknowledgeAlert = async (req, res) => {
  try {
    const monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    await monitor.acknowledgeAlert(req.params.alertId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Alert acknowledged successfully'
    });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error: Unable to acknowledge alert'
    });
  }
};

// @desc    Resolve alert
// @route   PATCH /api/v1/process-monitoring/:id/alerts/:alertId/resolve
// @access  Private (Admin/Data Steward)
exports.resolveAlert = async (req, res) => {
  try {
    const monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    await monitor.resolveAlert(req.params.alertId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Alert resolved successfully'
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error: Unable to resolve alert'
    });
  }
};

// @desc    Get alert history
// @route   GET /api/v1/process-monitoring/:id/alerts/history
// @access  Private (Admin/Data Steward)
exports.getAlertHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, severity, alertType } = req.query;
    
    const monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    let alertHistory = monitor.alertHistory;

    // Apply filters
    if (severity) {
      alertHistory = alertHistory.filter(alert => alert.severity === severity);
    }
    if (alertType) {
      alertHistory = alertHistory.filter(alert => alert.alertType === alertType);
    }

    // Sort by triggered date (newest first)
    alertHistory.sort((a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt));

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedHistory = alertHistory.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      count: paginatedHistory.length,
      total: alertHistory.length,
      page: parseInt(page),
      pages: Math.ceil(alertHistory.length / parseInt(limit)),
      data: paginatedHistory
    });
  } catch (error) {
    console.error('Error fetching alert history:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch alert history'
    });
  }
};

// @desc    Update SLA targets
// @route   PATCH /api/v1/process-monitoring/:id/sla
// @access  Private (Admin/Data Steward)
exports.updateSLATargets = async (req, res) => {
  try {
    const monitor = await ProcessMonitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: 'Process monitor not found'
      });
    }

    const { slaTargets } = req.body;

    if (!slaTargets) {
      return res.status(400).json({
        success: false,
        error: 'SLA targets are required'
      });
    }

    monitor.slaTargets = { ...monitor.slaTargets, ...slaTargets };
    monitor.updatedBy = req.user.id;
    
    // Recalculate SLA status
    monitor.calculateSLAStatus();
    
    await monitor.save();

    res.status(200).json({
      success: true,
      message: 'SLA targets updated successfully',
      data: {
        slaTargets: monitor.slaTargets,
        slaStatus: monitor.slaStatus,
        slaCompliance: monitor.slaCompliance
      }
    });
  } catch (error) {
    console.error('Error updating SLA targets:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update SLA targets'
    });
  }
};

// Helper function to check thresholds and trigger alerts
async function checkThresholdsAndTriggerAlerts(monitor, metrics) {
  const thresholds = monitor.thresholds;
  const alerts = [];

  // Check execution time threshold
  if (metrics.executionTime && metrics.executionTime > thresholds.maxExecutionTime) {
    alerts.push({
      alertType: 'Execution_Timeout',
      severity: 'High',
      message: `Execution time (${metrics.executionTime}ms) exceeded threshold (${thresholds.maxExecutionTime}ms)`,
      metadata: { executionTime: metrics.executionTime, threshold: thresholds.maxExecutionTime }
    });
  }

  // Check memory usage threshold
  if (metrics.memoryUsage && metrics.memoryUsage > thresholds.maxMemoryUsage) {
    alerts.push({
      alertType: 'Memory_Threshold',
      severity: 'Medium',
      message: `Memory usage (${metrics.memoryUsage}MB) exceeded threshold (${thresholds.maxMemoryUsage}MB)`,
      metadata: { memoryUsage: metrics.memoryUsage, threshold: thresholds.maxMemoryUsage }
    });
  }

  // Check CPU usage threshold
  if (metrics.cpuUsage && metrics.cpuUsage > thresholds.maxCpuUsage) {
    alerts.push({
      alertType: 'CPU_Threshold',
      severity: 'Medium',
      message: `CPU usage (${metrics.cpuUsage}%) exceeded threshold (${thresholds.maxCpuUsage}%)`,
      metadata: { cpuUsage: metrics.cpuUsage, threshold: thresholds.maxCpuUsage }
    });
  }

  // Check error rate
  if (metrics.errorCount && metrics.successCount) {
    const totalOperations = metrics.errorCount + metrics.successCount;
    const errorRate = (metrics.errorCount / totalOperations) * 100;
    const successRate = (metrics.successCount / totalOperations) * 100;
    
    if (successRate < thresholds.minSuccessRate) {
      alerts.push({
        alertType: 'High_Error_Rate',
        severity: 'High',
        message: `Success rate (${successRate.toFixed(2)}%) below threshold (${thresholds.minSuccessRate}%)`,
        metadata: { successRate, errorRate, threshold: thresholds.minSuccessRate }
      });
    }
  }

  // Trigger all alerts
  for (const alertData of alerts) {
    await monitor.triggerAlert(
      alertData.alertType,
      alertData.severity,
      alertData.message,
      alertData.metadata
    );
  }

  return alerts;
}

// All functions are already exported using exports.functionName above
// No need for additional module.exports when using exports.functionName
