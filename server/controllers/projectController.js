const Task = require('../models/Task');
const DataStrategyEpic = require('../models/DataStrategyEpic');
const DataStrategyPriority = require('../models/DataStrategyPriority');
const ProjectCharter = require('../models/ProjectCharter');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

// @desc    Get active project metrics from multiple collections
// @route   GET /api/v1/projects/active-metrics
// @access  Admin/Data Steward
exports.getActiveProjectMetrics = asyncHandler(async (req, res, next) => {
  console.log('🚀 Project metrics API called');
  try {
    // Get active tasks (treating each task as a mini-project)
    const activeTasks = await Task.countDocuments({
      status: { $in: ['Open', 'In Progress'] }
    });

    // Get active data strategy epics
    const activeEpics = await DataStrategyEpic.countDocuments({
      status: { $in: ['In Progress', 'Planning'] }
    });

    // Get active data strategy priorities
    const activePriorities = await DataStrategyPriority.countDocuments({
      status: { $in: ['active', 'in-progress', 'approved'] }
    });

    // Get active project charters
    const activeCharters = await ProjectCharter.countDocuments({
      status: { $in: ['active', 'approved', 'in-progress'] }
    });

    // Calculate total active projects
    const totalActiveProjects = activeTasks + activeEpics + activePriorities + activeCharters;

    // Get project status breakdown
    const taskStatusBreakdown = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const epicStatusBreakdown = await DataStrategyEpic.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Combine status counts
    let statusCounts = {
      active: 0,
      inProgress: 0,
      pending: 0,
      completed: 0
    };

    // Process task statuses
    taskStatusBreakdown.forEach(item => {
      switch(item._id) {
        case 'Open':
          statusCounts.pending += item.count;
          break;
        case 'In Progress':
          statusCounts.inProgress += item.count;
          break;
        case 'Completed':
          statusCounts.completed += item.count;
          break;
        default:
          statusCounts.active += item.count;
      }
    });

    // Process epic statuses
    epicStatusBreakdown.forEach(item => {
      switch(item._id) {
        case 'Planning':
          statusCounts.pending += item.count;
          break;
        case 'In Progress':
          statusCounts.inProgress += item.count;
          break;
        case 'Completed':
          statusCounts.completed += item.count;
          break;
        default:
          statusCounts.active += item.count;
      }
    });

    // Get projects by domain (from epics and priorities)
    const projectsByDomain = await DataStrategyEpic.aggregate([
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
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalActiveProjects,
        taskProjects: activeTasks,
        strategicEpics: activeEpics,
        strategicPriorities: activePriorities,
        projectCharters: activeCharters,
        projectsByStatus: statusCounts,
        projectsByDomain: projectsByDomain || [],
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error calculating active project metrics:', error);
    return next(new AppError('Error calculating active project metrics', 500));
  }
});

// @desc    Get detailed project breakdown
// @route   GET /api/v1/projects/breakdown
// @access  Admin/Data Steward
exports.getProjectBreakdown = asyncHandler(async (req, res, next) => {
  try {
    // Get recent tasks
    const recentTasks = await Task.find({
      status: { $in: ['Open', 'In Progress'] }
    }, {
      title: 1,
      status: 1,
      priority: 1,
      assignedTo: 1,
      dueDate: 1,
      createdAt: 1
    }).limit(10).sort({ createdAt: -1 });

    // Get active epics
    const activeEpics = await DataStrategyEpic.find({
      status: { $in: ['In Progress', 'Planning'] }
    }, {
      title: 1,
      status: 1,
      priority: 1,
      domain: 1,
      estimatedLOE: 1,
      createdAt: 1
    }).limit(10).sort({ createdAt: -1 });

    // Get active priorities
    const activePriorities = await DataStrategyPriority.find({
      status: { $in: ['active', 'in-progress', 'approved'] }
    }, {
      title: 1,
      status: 1,
      priority: 1,
      businessValue: 1,
      estimatedLOE: 1,
      createdAt: 1
    }).limit(10).sort({ createdAt: -1 });

    const breakdown = {
      tasks: recentTasks.map(task => ({
        id: task._id,
        title: task.title,
        type: 'Task',
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        createdAt: task.createdAt
      })),
      epics: activeEpics.map(epic => ({
        id: epic._id,
        title: epic.title,
        type: 'Epic',
        status: epic.status,
        priority: epic.priority,
        domain: epic.domain,
        estimatedLOE: epic.estimatedLOE,
        createdAt: epic.createdAt
      })),
      priorities: activePriorities.map(priority => ({
        id: priority._id,
        title: priority.title,
        type: 'Priority',
        status: priority.status,
        priority: priority.priority,
        businessValue: priority.businessValue,
        estimatedLOE: priority.estimatedLOE,
        createdAt: priority.createdAt
      }))
    };

    res.status(200).json({
      success: true,
      data: breakdown
    });

  } catch (error) {
    console.error('Error getting project breakdown:', error);
    return next(new AppError('Error getting project breakdown', 500));
  }
});

// @desc    Get projects grouped by domain
// @route   GET /api/v1/projects/by-domain
// @access  Admin/Data Steward
exports.getProjectsByDomain = asyncHandler(async (req, res, next) => {
  try {
    // Aggregate projects by domain from multiple collections
    const domainAggregation = await DataStrategyEpic.aggregate([
      {
        $match: {
          status: { $in: ['active', 'in-progress', 'planning', 'approved'] }
        }
      },
      {
        $group: {
          _id: '$domain',
          epicCount: { $sum: 1 },
          projects: {
            $push: {
              id: '$_id',
              title: '$title',
              status: '$status',
              priority: '$priority',
              estimatedLOE: '$estimatedLOE'
            }
          }
        }
      },
      {
        $project: {
          domain: '$_id',
          totalProjects: '$epicCount',
          projects: 1,
          _id: 0
        }
      },
      { $sort: { totalProjects: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: domainAggregation
    });

  } catch (error) {
    console.error('Error getting projects by domain:', error);
    return next(new AppError('Error getting projects by domain', 500));
  }
});
