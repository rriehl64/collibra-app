const AutomatedProcess = require('../models/AutomatedProcess');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all automated processes
// @route   GET /api/v1/automated-processes
// @access  Private (Admin/Data Steward)
exports.getAutomatedProcesses = async (req, res) => {
  try {
    const {
      category,
      status,
      processType,
      team,
      owner,
      search,
      page = 1,
      limit = 20,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (processType) filter.processType = processType;
    if (team) filter.team = team;
    if (owner) filter.owner = owner;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population
    const processes = await AutomatedProcess.find(filter)
      .populate('owner', 'name email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await AutomatedProcess.countDocuments(filter);

    // Calculate summary statistics
    const stats = await AutomatedProcess.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProcesses: { $sum: 1 },
          activeProcesses: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          scheduledProcesses: {
            $sum: { $cond: ['$schedule.enabled', 1, 0] }
          },
          totalExecutions: { $sum: '$metrics.totalExecutions' },
          totalSuccessful: { $sum: '$metrics.successfulExecutions' },
          totalFailed: { $sum: '$metrics.failedExecutions' }
        }
      }
    ]);

    const summary = stats[0] || {
      totalProcesses: 0,
      activeProcesses: 0,
      scheduledProcesses: 0,
      totalExecutions: 0,
      totalSuccessful: 0,
      totalFailed: 0
    };

    // Calculate overall success rate
    summary.overallSuccessRate = summary.totalExecutions > 0 
      ? ((summary.totalSuccessful / summary.totalExecutions) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      count: processes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      summary,
      data: processes
    });
  } catch (error) {
    console.error('Error fetching automated processes:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch automated processes'
    });
  }
};

// @desc    Get single automated process
// @route   GET /api/v1/automated-processes/:id
// @access  Private (Admin/Data Steward)
exports.getAutomatedProcess = async (req, res) => {
  try {
    const process = await AutomatedProcess.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('dependencies.processId', 'name status');

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    res.status(200).json({
      success: true,
      data: process
    });
  } catch (error) {
    console.error('Error fetching automated process:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch automated process'
    });
  }
};

// @desc    Create new automated process
// @route   POST /api/v1/automated-processes
// @access  Private (Admin/Data Steward)
exports.createAutomatedProcess = async (req, res) => {
  try {
    // Add user info to the process
    req.body.createdBy = req.user.id;
    req.body.owner = req.body.owner || req.user.id;

    // Set default permissions based on user role
    if (!req.body.permissions) {
      req.body.permissions = {
        canView: ['admin', 'data-steward'],
        canEdit: ['admin', 'data-steward'],
        canExecute: ['admin', 'data-steward'],
        canDelete: ['admin']
      };
    }

    // Validate and set step order if not provided
    if (req.body.steps && req.body.steps.length > 0) {
      req.body.steps.forEach((step, index) => {
        if (!step.stepId) {
          step.stepId = uuidv4();
        }
        if (!step.order) {
          step.order = index + 1;
        }
      });
    }

    const process = await AutomatedProcess.create(req.body);

    // Populate the response
    const populatedProcess = await AutomatedProcess.findById(process._id)
      .populate('owner', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedProcess
    });
  } catch (error) {
    console.error('Error creating automated process:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to create automated process'
    });
  }
};

// @desc    Update automated process
// @route   PUT /api/v1/automated-processes/:id
// @access  Private (Admin/Data Steward)
exports.updateAutomatedProcess = async (req, res) => {
  try {
    let process = await AutomatedProcess.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    // Add updated by user
    req.body.updatedBy = req.user.id;

    // Handle version increment for significant changes
    const significantFields = ['steps', 'schedule', 'triggers', 'dependencies'];
    const hasSignificantChanges = significantFields.some(field => 
      req.body[field] && JSON.stringify(req.body[field]) !== JSON.stringify(process[field])
    );

    if (hasSignificantChanges) {
      // Increment version
      const versionParts = process.version.split('.');
      versionParts[1] = (parseInt(versionParts[1]) + 1).toString();
      req.body.version = versionParts.join('.');
      
      // Add to change log
      if (!req.body.changeLog) {
        req.body.changeLog = process.changeLog || [];
      }
      req.body.changeLog.push({
        version: req.body.version,
        changes: req.body.changeDescription || 'Process configuration updated',
        changedBy: req.user.id,
        changeDate: new Date()
      });
    }

    // Validate and update step IDs if needed
    if (req.body.steps && req.body.steps.length > 0) {
      req.body.steps.forEach((step, index) => {
        if (!step.stepId) {
          step.stepId = uuidv4();
        }
        if (!step.order) {
          step.order = index + 1;
        }
      });
    }

    process = await AutomatedProcess.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'name email')
     .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: process
    });
  } catch (error) {
    console.error('Error updating automated process:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update automated process'
    });
  }
};

// @desc    Delete automated process (soft delete)
// @route   DELETE /api/v1/automated-processes/:id
// @access  Private (Admin only)
exports.deleteAutomatedProcess = async (req, res) => {
  try {
    const process = await AutomatedProcess.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    // Soft delete by setting isActive to false
    process.isActive = false;
    process.status = 'Archived';
    process.updatedBy = req.user.id;
    await process.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting automated process:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to delete automated process'
    });
  }
};

// @desc    Execute automated process
// @route   POST /api/v1/automated-processes/:id/execute
// @access  Private (Admin/Data Steward)
exports.executeAutomatedProcess = async (req, res) => {
  try {
    const process = await AutomatedProcess.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    if (process.status !== 'Active') {
      return res.status(400).json({
        success: false,
        error: 'Process must be active to execute'
      });
    }

    // Create execution record
    const executionId = uuidv4();
    const executionRecord = {
      executionId,
      startTime: new Date(),
      status: 'Running',
      executedBy: req.user.id,
      stepResults: []
    };

    // Add execution record to process
    process.executionHistory.push(executionRecord);
    await process.save();

    // In a real implementation, this would trigger the actual process execution
    // For now, we'll simulate a successful execution
    setTimeout(async () => {
      try {
        const updatedProcess = await AutomatedProcess.findById(req.params.id);
        const execution = updatedProcess.executionHistory.find(exec => exec.executionId === executionId);
        
        if (execution) {
          execution.endTime = new Date();
          execution.status = 'Completed';
          execution.result = {
            message: 'Process executed successfully',
            stepsCompleted: process.steps.length,
            duration: execution.endTime.getTime() - execution.startTime.getTime()
          };
          
          // Simulate step results
          execution.stepResults = process.steps.map(step => ({
            stepId: step.stepId,
            status: 'Completed',
            duration: Math.floor(Math.random() * 5000) + 1000, // Random duration 1-6 seconds
            result: { message: `Step ${step.name} completed successfully` }
          }));
          
          await updatedProcess.save();
        }
      } catch (error) {
        console.error('Error updating execution record:', error);
      }
    }, 2000); // Simulate 2 second execution

    res.status(200).json({
      success: true,
      message: 'Process execution started',
      data: {
        executionId,
        status: 'Running',
        startTime: executionRecord.startTime
      }
    });
  } catch (error) {
    console.error('Error executing automated process:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to execute automated process'
    });
  }
};

// @desc    Get process execution history
// @route   GET /api/v1/automated-processes/:id/executions
// @access  Private (Admin/Data Steward)
exports.getExecutionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const process = await AutomatedProcess.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    // Sort execution history by start time (newest first)
    const sortedHistory = process.executionHistory
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedHistory = sortedHistory.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      count: paginatedHistory.length,
      total: process.executionHistory.length,
      page: parseInt(page),
      pages: Math.ceil(process.executionHistory.length / parseInt(limit)),
      data: paginatedHistory
    });
  } catch (error) {
    console.error('Error fetching execution history:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch execution history'
    });
  }
};

// @desc    Get dashboard analytics for automated processes
// @route   GET /api/v1/automated-processes/analytics/dashboard
// @access  Private (Admin/Data Steward)
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '30d':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case '90d':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      default:
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    }

    // Get overall statistics
    const overallStats = await AutomatedProcess.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProcesses: { $sum: 1 },
          activeProcesses: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          scheduledProcesses: {
            $sum: { $cond: ['$schedule.enabled', 1, 0] }
          },
          totalExecutions: { $sum: '$metrics.totalExecutions' },
          totalSuccessful: { $sum: '$metrics.successfulExecutions' },
          totalFailed: { $sum: '$metrics.failedExecutions' },
          avgExecutionTime: { $avg: '$metrics.averageExecutionTime' }
        }
      }
    ]);

    // Get processes by category
    const categoryStats = await AutomatedProcess.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get processes by status
    const statusStats = await AutomatedProcess.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent executions for timeline
    const recentExecutions = await AutomatedProcess.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$executionHistory' },
      {
        $match: {
          'executionHistory.startTime': { $gte: startDate }
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          execution: '$executionHistory'
        }
      },
      { $sort: { 'execution.startTime': -1 } },
      { $limit: 50 }
    ]);

    const summary = overallStats[0] || {
      totalProcesses: 0,
      activeProcesses: 0,
      scheduledProcesses: 0,
      totalExecutions: 0,
      totalSuccessful: 0,
      totalFailed: 0,
      avgExecutionTime: 0
    };

    // Calculate success rate
    summary.successRate = summary.totalExecutions > 0 
      ? ((summary.totalSuccessful / summary.totalExecutions) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        summary,
        categoryBreakdown: categoryStats,
        statusBreakdown: statusStats,
        recentExecutions,
        timeframe
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch dashboard analytics'
    });
  }
};

// @desc    Toggle process status (activate/deactivate)
// @route   PATCH /api/v1/automated-processes/:id/toggle-status
// @access  Private (Admin/Data Steward)
exports.toggleProcessStatus = async (req, res) => {
  try {
    const process = await AutomatedProcess.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    // Toggle between Active and Inactive
    const newStatus = process.status === 'Active' ? 'Inactive' : 'Active';
    
    process.status = newStatus;
    process.updatedBy = req.user.id;
    
    await process.save();

    res.status(200).json({
      success: true,
      message: `Process ${newStatus.toLowerCase()} successfully`,
      data: {
        id: process._id,
        name: process.name,
        status: process.status
      }
    });
  } catch (error) {
    console.error('Error toggling process status:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to toggle process status'
    });
  }
};

// @desc    Update process schedule
// @route   PATCH /api/v1/automated-processes/:id/schedule
// @access  Private (Admin/Data Steward)
exports.updateProcessSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    
    if (!schedule) {
      return res.status(400).json({
        success: false,
        error: 'Schedule data is required'
      });
    }

    const process = await AutomatedProcess.findById(req.params.id);
    
    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Automated process not found'
      });
    }

    // Update schedule
    process.schedule = {
      enabled: schedule.enabled,
      cronExpression: schedule.cronExpression,
      timezone: schedule.timezone || 'America/New_York'
    };

    // Calculate next run if enabled
    if (schedule.enabled && schedule.cronExpression) {
      process.schedule.nextRun = process.calculateNextRun();
    } else {
      process.schedule.nextRun = null;
    }

    // Update metadata
    process.updatedBy = req.user.id;
    
    // Add to change log
    process.changeLog.push({
      version: process.version,
      changes: `Schedule ${schedule.enabled ? 'enabled' : 'disabled'}: ${schedule.cronExpression || 'N/A'}`,
      changedBy: req.user.id,
      changeDate: new Date()
    });

    await process.save();

    // Populate for response
    await process.populate('owner', 'name email');
    await process.populate('createdBy', 'name email');
    await process.populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Schedule ${schedule.enabled ? 'enabled' : 'disabled'} for process "${process.name}"`,
      data: process
    });
  } catch (error) {
    console.error('Error updating process schedule:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update process schedule'
    });
  }
};

// @desc    Get scheduled processes
// @route   GET /api/v1/automated-processes/scheduled
// @access  Private (Admin/Data Steward)
exports.getScheduledProcesses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortBy = 'schedule.nextRun',
      sortOrder = 'asc'
    } = req.query;

    // Filter for scheduled processes only
    const filter = { 
      isActive: true,
      'schedule.enabled': true
    };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population
    const processes = await AutomatedProcess.find(filter)
      .populate('owner', 'name email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await AutomatedProcess.countDocuments(filter);

    // Calculate summary statistics for scheduled processes
    const stats = await AutomatedProcess.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalProcesses: { $sum: 1 },
          activeProcesses: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          scheduledProcesses: { $sum: 1 }, // All are scheduled in this query
          totalExecutions: { $sum: '$metrics.totalExecutions' },
          totalSuccessful: { $sum: '$metrics.successfulExecutions' },
          totalFailed: { $sum: '$metrics.failedExecutions' }
        }
      }
    ]);

    const summary = stats[0] || {
      totalProcesses: 0,
      activeProcesses: 0,
      scheduledProcesses: 0,
      totalExecutions: 0,
      totalSuccessful: 0,
      totalFailed: 0
    };

    // Calculate overall success rate
    summary.overallSuccessRate = summary.totalExecutions > 0 
      ? ((summary.totalSuccessful / summary.totalExecutions) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      count: processes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      summary,
      data: processes
    });
  } catch (error) {
    console.error('Error fetching scheduled processes:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch scheduled processes'
    });
  }
};

// @desc    Get schedule calendar
// @route   GET /api/v1/automated-processes/schedule/calendar
// @access  Private (Admin/Data Steward)
exports.getScheduleCalendar = async (req, res) => {
  try {
    const { days = 7, timezone = 'America/New_York' } = req.query;

    // Get all scheduled processes
    const processes = await AutomatedProcess.find({
      isActive: true,
      'schedule.enabled': true,
      status: 'Active'
    }).select('name category schedule.cronExpression schedule.timezone schedule.nextRun status');

    // Format for calendar view
    const calendarData = processes.map(process => ({
      processId: process._id,
      processName: process.name,
      category: process.category,
      nextRun: process.schedule.nextRun,
      cronExpression: process.schedule.cronExpression,
      timezone: process.schedule.timezone,
      status: process.status
    }));

    // Sort by next run time
    calendarData.sort((a, b) => {
      if (!a.nextRun) return 1;
      if (!b.nextRun) return -1;
      return new Date(a.nextRun) - new Date(b.nextRun);
    });

    res.status(200).json({
      success: true,
      data: calendarData
    });
  } catch (error) {
    console.error('Error fetching schedule calendar:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch schedule calendar'
    });
  }
};

// @desc    Validate cron expression
// @route   POST /api/v1/automated-processes/schedule/validate-cron
// @access  Private (Admin/Data Steward)
exports.validateCronExpression = async (req, res) => {
  try {
    const { cronExpression, timezone = 'America/New_York' } = req.body;

    if (!cronExpression) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: 'Cron expression is required'
      });
    }

    // Basic cron validation
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length !== 5) {
      return res.status(200).json({
        success: true,
        valid: false,
        error: 'Cron expression must have exactly 5 parts: minute hour day month weekday'
      });
    }

    // Basic regex validation
    const cronRegex = /^(\*|([0-5]?\d)(-([0-5]?\d))?)(\/\d+)?\s+(\*|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?)(\/\d+)?\s+(\*|([12]?\d|3[01])(-([12]?\d|3[01]))?)(\/\d+)?\s+(\*|([1-9]|1[0-2])(-([1-9]|1[0-2]))?)(\/\d+)?\s+(\*|[0-6](-[0-6])?)(\/\d+)?$/;
    
    if (!cronRegex.test(cronExpression)) {
      return res.status(200).json({
        success: true,
        valid: false,
        error: 'Invalid cron expression format'
      });
    }

    // Generate next few run times (simplified - in production use a proper cron library)
    const now = new Date();
    const nextRuns = [];
    for (let i = 1; i <= 5; i++) {
      const nextRun = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000)); // Simplified: daily intervals
      nextRuns.push(nextRun.toISOString());
    }

    // Generate description (simplified)
    let description = 'Custom schedule';
    if (cronExpression === '* * * * *') description = 'Every minute';
    else if (cronExpression === '0 * * * *') description = 'Every hour';
    else if (cronExpression === '0 0 * * *') description = 'Daily at midnight';
    else if (cronExpression === '0 0 * * 0') description = 'Weekly on Sunday';
    else if (cronExpression === '0 0 1 * *') description = 'Monthly on the 1st';

    res.status(200).json({
      success: true,
      valid: true,
      nextRuns,
      description
    });
  } catch (error) {
    console.error('Error validating cron expression:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to validate cron expression'
    });
  }
};
