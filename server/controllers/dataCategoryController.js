const DataCategory = require('../models/DataCategory');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../middleware/appError');

/**
 * Controller for managing data categories
 */

// Get all data categories with filtering
exports.getAllDataCategories = catchAsync(async (req, res, next) => {
  const { search, status, owner } = req.query;
  
  // Build query filters
  const filter = {};
  
  // Text search (across multiple fields)
  if (search) {
    filter.$text = { $search: search };
  }
  
  // Apply specific filters
  if (status) filter.status = status;
  if (owner) filter.owner = owner;
  
  // Execute query
  const dataCategories = await DataCategory.find(filter)
    .sort({ updatedAt: -1 }) // Most recently updated first
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('relatedAssets', 'name type description');
  
  res.status(200).json({
    success: true,
    count: dataCategories.length,
    data: dataCategories
  });
});

// Get single data category
exports.getDataCategory = catchAsync(async (req, res, next) => {
  const dataCategory = await DataCategory.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('relatedAssets', 'name type description');
  
  if (!dataCategory) {
    return next(new AppError('Data category not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: dataCategory
  });
});

// Create new data category
exports.createDataCategory = catchAsync(async (req, res, next) => {
  // Add user info to the request body
  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;
  
  const dataCategory = await DataCategory.create(req.body);
  
  res.status(201).json({
    success: true,
    data: dataCategory
  });
});

// Update data category
exports.updateDataCategory = catchAsync(async (req, res, next) => {
  // Add updatedBy user info
  req.body.updatedBy = req.user.id;
  
  const dataCategory = await DataCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return updated document
      runValidators: true // Run schema validators
    }
  );
  
  if (!dataCategory) {
    return next(new AppError('Data category not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: dataCategory
  });
});

// Delete data category
exports.deleteDataCategory = catchAsync(async (req, res, next) => {
  const dataCategory = await DataCategory.findByIdAndDelete(req.params.id);
  
  if (!dataCategory) {
    return next(new AppError('Data category not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Get data category statuses
exports.getDataCategoryStatuses = catchAsync(async (req, res, next) => {
  const statuses = await DataCategory.distinct('status');
  
  res.status(200).json({
    success: true,
    count: statuses.length,
    data: statuses
  });
});

// Get data category owners
exports.getDataCategoryOwners = catchAsync(async (req, res, next) => {
  const owners = await DataCategory.distinct('owner');
  
  res.status(200).json({
    success: true,
    count: owners.length,
    data: owners
  });
});
