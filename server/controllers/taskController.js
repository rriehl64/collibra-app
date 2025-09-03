const Task = require('../models/Task');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../middleware/appError');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Task.find(JSON.parse(queryStr)).populate('assignee', 'name email').populate('creator', 'name email');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Task.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  let tasks = await query;
  
  // Manually populate relatedAssets with asset names
  console.log('📝 Populating assets for', tasks.length, 'tasks');
  for (let task of tasks) {
    if (task.relatedAssets && task.relatedAssets.length > 0) {
      console.log('🔍 Task:', task.title, 'has', task.relatedAssets.length, 'assets');
      const DataAsset = require('../models/DataAsset');
      const populatedAssets = await DataAsset.find({
        _id: { $in: task.relatedAssets }
      }).select('name type domain');
      console.log('✅ Found', populatedAssets.length, 'populated assets');
      task.relatedAssets = populatedAssets;
    }
  }

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
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
    count: tasks.length,
    pagination,
    data: tasks
  });
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('assignee', 'name email').populate('creator', 'name email');

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // For development, use provided creator/assignee or default user
  if (process.env.NODE_ENV !== 'production') {
    if (!req.body.creator) {
      req.body.creator = req.body.assignee || '68a3cd936fac09ceb0556f41';
    }
    if (!req.body.assignee) {
      req.body.assignee = req.body.creator || '68a3cd936fac09ceb0556f41';
    }
  } else {
    // Production: use authenticated user
    req.body.creator = req.user.id;
    if (!req.body.assignee) {
      req.body.assignee = req.user.id;
    }
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  // Skip history tracking for now to avoid req.user issues
  console.log('📝 Updating task fields:', Object.keys(req.body));

  // Mark as completed if status changed to Completed
  if (req.body.status === 'Completed' && task.status !== 'Completed') {
    req.body.completedAt = new Date();
  }

  // Add updatedAt timestamp
  req.body.updatedAt = new Date();
  
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('assignee', 'name email').populate('creator', 'name email');
  
  console.log('✅ Task updated in database:', task.title);
  console.log('✅ New updatedAt:', task.updatedAt);

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get tasks assigned to current user
// @route   GET /api/v1/tasks/my-tasks
// @access  Private
exports.getMyTasks = asyncHandler(async (req, res, next) => {
  const query = Task.find({ assignee: req.user.id })
    .populate('creator', 'name email');

  // Execute query
  let tasks = await query;
  
  // Manually populate relatedAssets with asset names
  for (let task of tasks) {
    if (task.relatedAssets && task.relatedAssets.length > 0) {
      const DataAsset = require('../models/DataAsset');
      const populatedAssets = await DataAsset.find({
        _id: { $in: task.relatedAssets }
      }).select('name type domain');
      task.relatedAssets = populatedAssets;
    }
  }

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Update task status
// @route   PATCH /api/v1/tasks/:id/status
// @access  Private
exports.updateTaskStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide a status', 400));
  }

  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  const oldStatus = task.status;
  
  // Add to history
  const historyEntry = {
    fieldUpdated: 'status',
    oldValue: oldStatus,
    newValue: status,
    updatedBy: req.user.id
  };

  const updateData = {
    status,
    $push: { history: historyEntry }
  };

  // Mark as completed if status is Completed
  if (status === 'Completed' && oldStatus !== 'Completed') {
    updateData.completedAt = new Date();
  }

  task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate('assignee', 'name email').populate('creator', 'name email');

  res.status(200).json({
    success: true,
    data: task
  });
});
