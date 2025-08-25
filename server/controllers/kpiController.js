const Kpi = require('../models/Kpi');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../middleware/appError');

// Get all KPIs with optional filters and pagination
exports.getAll = catchAsync(async (req, res, next) => {
  const {
    category,
    q,
    page = 1,
    limit = 12,
    sort = '-updatedAt'
  } = req.query;

  const query = {};
  if (category) {
    query.category = category;
  }
  if (q) {
    // Escape regex special characters to avoid invalid patterns and ReDoS issues
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(escapeRegex(q), 'i');
    query.$or = [
      { name: rx },
      { definition: rx },
      { tags: rx }
    ];
  }

  // Basic pagination
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object from string like "-updatedAt" or "name"
  let sortObj = {};
  if (typeof sort === 'string' && sort.length) {
    const fields = sort.split(',');
    fields.forEach((f) => {
      const key = f.startsWith('-') ? f.substring(1) : f;
      sortObj[key] = f.startsWith('-') ? -1 : 1;
    });
  } else {
    sortObj = { updatedAt: -1 };
  }

  const [items, count] = await Promise.all([
    Kpi.find(query).sort(sortObj).skip(skip).limit(limitNum),
    Kpi.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count,
    data: items,
    page: pageNum,
    limit: limitNum
  });
});

// Get single KPI
exports.getOne = catchAsync(async (req, res, next) => {
  const item = await Kpi.findById(req.params.id);
  if (!item) return next(new AppError('KPI not found', 404));
  res.status(200).json({ success: true, data: item });
});

// Create KPI
exports.createOne = catchAsync(async (req, res, next) => {
  if (req.user) {
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;
  }
  const item = await Kpi.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// Update KPI
exports.updateOne = catchAsync(async (req, res, next) => {
  if (req.user) req.body.updatedBy = req.user.id;
  const item = await Kpi.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return next(new AppError('KPI not found', 404));
  res.status(200).json({ success: true, data: item });
});

// Delete KPI
exports.deleteOne = catchAsync(async (req, res, next) => {
  const item = await Kpi.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('KPI not found', 404));
  res.status(204).json({ success: true, data: null });
});

// Get distinct KPI categories
exports.getCategories = catchAsync(async (req, res, next) => {
  const raw = await Kpi.distinct('category');
  const set = new Set(
    (raw || [])
      .map((c) => (typeof c === 'string' ? c.trim() : ''))
      .filter((c) => c && c.length > 0)
  );
  const categories = Array.from(set).sort((a, b) => a.localeCompare(b));
  res.status(200).json({ success: true, data: categories });
});
