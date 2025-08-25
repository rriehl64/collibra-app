const E22CategoryReference = require('../models/E22CategoryReference');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

const defaultContent = {
  mainTitle: 'Category Reference',
  intro: 'Reference codes and descriptions for E2x-related categories.',
  references: [
    { code: 'E21', name: 'Principal EB-2', description: 'Principal employment-based second preference immigrant.' },
    { code: 'E22', name: 'Spouse of E21', description: 'Derivative spouse of EB-2 principal.' },
    { code: 'E23', name: 'Child of E21', description: 'Derivative child of EB-2 principal.' }
  ],
  updatedBy: 'System'
};

exports.getAllCategoryReference = asyncHandler(async (req, res) => {
  const items = await E22CategoryReference.find().sort({ updatedAt: -1 });
  if (items.length === 0) {
    const created = await E22CategoryReference.create(defaultContent);
    return res.status(200).json({ success: true, data: created });
  }
  res.status(200).json({ success: true, count: items.length, data: items });
});

exports.getLatestCategoryReference = asyncHandler(async (req, res) => {
  let item = await E22CategoryReference.findOne().sort({ updatedAt: -1 });
  if (!item) item = await E22CategoryReference.create(defaultContent);
  res.status(200).json({ success: true, data: item });
});

exports.getCategoryReferenceById = asyncHandler(async (req, res, next) => {
  const item = await E22CategoryReference.findById(req.params.id);
  if (!item) return next(new AppError('Category Reference not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.createCategoryReference = asyncHandler(async (req, res) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  const item = await E22CategoryReference.create(req.body);
  res.status(201).json({ success: true, data: item });
});

exports.updateCategoryReference = asyncHandler(async (req, res, next) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  req.body.lastUpdated = new Date();
  const item = await E22CategoryReference.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return next(new AppError('Category Reference not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.deleteCategoryReference = asyncHandler(async (req, res, next) => {
  const item = await E22CategoryReference.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Category Reference not found', 404));
  res.status(200).json({ success: true, data: {} });
});
