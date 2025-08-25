const ProjectCharter = require('../models/ProjectCharter');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../middleware/appError');

// Get all project charters
exports.getAll = catchAsync(async (req, res, next) => {
  const items = await ProjectCharter.find({}).sort({ updatedAt: -1 });
  res.status(200).json({ success: true, count: items.length, data: items });
});

// Get single project charter
exports.getOne = catchAsync(async (req, res, next) => {
  const item = await ProjectCharter.findById(req.params.id);
  if (!item) return next(new AppError('Project Charter not found', 404));
  res.status(200).json({ success: true, data: item });
});

// Create project charter
exports.createOne = catchAsync(async (req, res, next) => {
  if (req.user) {
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
  }
  const item = await ProjectCharter.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// Update project charter
exports.updateOne = catchAsync(async (req, res, next) => {
  if (req.user) req.body.updatedBy = req.user.id;
  const item = await ProjectCharter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return next(new AppError('Project Charter not found', 404));
  res.status(200).json({ success: true, data: item });
});

// Delete project charter
exports.deleteOne = catchAsync(async (req, res, next) => {
  const item = await ProjectCharter.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Project Charter not found', 404));
  res.status(204).json({ success: true, data: null });
});
