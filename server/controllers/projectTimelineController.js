const ProjectTimeline = require('../models/ProjectTimeline');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

// @desc    Get all project timeline records
// @route   GET /api/v1/project-timeline
// @access  Private
exports.getProjectTimeline = asyncHandler(async (req, res, next) => {
  let query = {};
  
  // Filter by phase if provided
  if (req.query.phase) {
    query.phase = req.query.phase;
  }
  
  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // Filter by owner if provided
  if (req.query.owner) {
    query.owner = { $regex: req.query.owner, $options: 'i' };
  }
  
  // Search functionality
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }
  
  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    query.startDate = {};
    if (req.query.startDate) {
      query.startDate.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.startDate.$lte = new Date(req.query.endDate);
    }
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  
  // Sort
  const sort = req.query.sort || 'startDate';
  
  const total = await ProjectTimeline.countDocuments(query);
  const timeline = await ProjectTimeline.find(query)
    .sort(sort)
    .skip(startIndex)
    .limit(limit)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');
  
  // Pagination result
  const pagination = {};
  
  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: timeline.length,
    total,
    pagination,
    data: timeline
  });
});

// @desc    Get single project timeline record
// @route   GET /api/v1/project-timeline/:id
// @access  Private
exports.getProjectTimelineRecord = asyncHandler(async (req, res, next) => {
  const timeline = await ProjectTimeline.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');
  
  if (!timeline) {
    return next(new AppError(`Project timeline record not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: timeline
  });
});

// @desc    Create new project timeline record
// @route   POST /api/v1/project-timeline
// @access  Private
exports.createProjectTimelineRecord = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;
  
  // Validate date range
  if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
    return next(new AppError('End date must be after start date', 400));
  }
  
  const timeline = await ProjectTimeline.create(req.body);
  
  res.status(201).json({
    success: true,
    data: timeline
  });
});

// @desc    Update project timeline record
// @route   PUT /api/v1/project-timeline/:id
// @access  Private
exports.updateProjectTimelineRecord = asyncHandler(async (req, res, next) => {
  let timeline = await ProjectTimeline.findById(req.params.id);
  
  if (!timeline) {
    return next(new AppError(`Project timeline record not found with id of ${req.params.id}`, 404));
  }
  
  // Validate date range if dates are being updated
  if (req.body.startDate || req.body.endDate) {
    const startDate = req.body.startDate ? new Date(req.body.startDate) : timeline.startDate;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : timeline.endDate;
    
    if (startDate >= endDate) {
      return next(new AppError('End date must be after start date', 400));
    }
  }
  
  // Add updated by user if available
  if (req.user && req.user.id) {
    req.body.updatedBy = req.user.id;
  }
  
  timeline = await ProjectTimeline.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('createdBy', 'name email').populate('updatedBy', 'name email');
  
  res.status(200).json({
    success: true,
    data: timeline
  });
});

// @desc    Delete project timeline record
// @route   DELETE /api/v1/project-timeline/:id
// @access  Private
exports.deleteProjectTimelineRecord = asyncHandler(async (req, res, next) => {
  const timeline = await ProjectTimeline.findById(req.params.id);
  
  if (!timeline) {
    return next(new AppError(`Project timeline record not found with id of ${req.params.id}`, 404));
  }
  
  await timeline.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get project timeline statistics
// @route   GET /api/v1/project-timeline/stats
// @access  Private
exports.getProjectTimelineStats = asyncHandler(async (req, res, next) => {
  const stats = await ProjectTimeline.aggregate([
    {
      $group: {
        _id: '$phase',
        count: { $sum: 1 },
        avgProgress: { $avg: '$progress' },
        totalBudget: { $sum: '$budget' },
        totalEstimatedHours: { $sum: '$estimatedHours' },
        totalActualHours: { $sum: '$actualHours' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  const statusStats = await ProjectTimeline.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const overallStats = await ProjectTimeline.aggregate([
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        avgProgress: { $avg: '$progress' },
        totalBudget: { $sum: '$budget' },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
          }
        }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      phaseStats: stats,
      statusStats,
      overall: overallStats[0] || {
        totalTasks: 0,
        avgProgress: 0,
        totalBudget: 0,
        completedTasks: 0
      }
    }
  });
});

// @desc    Bulk update project timeline records
// @route   PUT /api/v1/project-timeline/bulk
// @access  Private
exports.bulkUpdateProjectTimeline = asyncHandler(async (req, res, next) => {
  const { updates } = req.body;
  
  if (!updates || !Array.isArray(updates)) {
    return next(new AppError('Updates array is required', 400));
  }
  
  const results = [];
  
  for (const update of updates) {
    if (!update.id) {
      results.push({ error: 'ID is required for each update' });
      continue;
    }
    
    try {
      const timeline = await ProjectTimeline.findByIdAndUpdate(
        update.id,
        { ...update.data, updatedBy: req.user.id },
        { new: true, runValidators: true }
      );
      
      if (!timeline) {
        results.push({ id: update.id, error: 'Record not found' });
      } else {
        results.push({ id: update.id, success: true, data: timeline });
      }
    } catch (error) {
      results.push({ id: update.id, error: error.message });
    }
  }
  
  res.status(200).json({
    success: true,
    data: results
  });
});
