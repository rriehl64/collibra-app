const BusinessProcess = require('../models/BusinessProcess');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../middleware/appError');

/**
 * Controller for managing business processes
 */

// Get all business processes with filtering
exports.getAllBusinessProcesses = catchAsync(async (req, res, next) => {
  const { search, category, status, owner } = req.query;
  
  // Build query filters
  const filter = {};
  
  // Text search (across multiple fields)
  if (search) {
    filter.$text = { $search: search };
  }
  
  // Apply specific filters
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (owner) filter.owner = owner;
  
  // Execute query
  const businessProcesses = await BusinessProcess.find(filter)
    .sort({ updatedAt: -1 }) // Most recently updated first
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('relatedAssets', 'name type description');
  
  res.status(200).json({
    success: true,
    count: businessProcesses.length,
    data: businessProcesses
  });
});

// Get single business process
exports.getBusinessProcess = catchAsync(async (req, res, next) => {
  const businessProcess = await BusinessProcess.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('relatedAssets', 'name type description');
  
  if (!businessProcess) {
    return next(new AppError('Business process not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: businessProcess
  });
});

// Create new business process
exports.createBusinessProcess = catchAsync(async (req, res, next) => {
  // Add user info to the request body
  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;
  
  const businessProcess = await BusinessProcess.create(req.body);
  
  res.status(201).json({
    success: true,
    data: businessProcess
  });
});

// Update business process
exports.updateBusinessProcess = catchAsync(async (req, res, next) => {
  // Add updatedBy user info
  req.body.updatedBy = req.user.id;
  
  const businessProcess = await BusinessProcess.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return updated document
      runValidators: true // Run schema validators
    }
  );
  
  if (!businessProcess) {
    return next(new AppError('Business process not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: businessProcess
  });
});

// Delete business process
exports.deleteBusinessProcess = catchAsync(async (req, res, next) => {
  const businessProcess = await BusinessProcess.findByIdAndDelete(req.params.id);
  
  if (!businessProcess) {
    return next(new AppError('Business process not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Get business process categories
exports.getBusinessProcessCategories = catchAsync(async (req, res, next) => {
  const categories = await BusinessProcess.distinct('category');
  
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// Get business process owners
exports.getBusinessProcessOwners = catchAsync(async (req, res, next) => {
  const owners = await BusinessProcess.distinct('owner');
  
  res.status(200).json({
    success: true,
    count: owners.length,
    data: owners
  });
});
