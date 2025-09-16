const MenuSettings = require('../models/MenuSettings');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

// @desc    Get all menu settings
// @route   GET /api/v1/menu-settings
// @access  Admin
exports.getMenuSettings = asyncHandler(async (req, res, next) => {
  const menuSettings = await MenuSettings.find().sort({ category: 1, order: 1 });
  
  res.status(200).json({
    success: true,
    count: menuSettings.length,
    data: menuSettings
  });
});

// @desc    Get enabled menu items for user
// @route   GET /api/v1/menu-settings/enabled
// @access  Public
exports.getEnabledMenuItems = asyncHandler(async (req, res, next) => {
  const userRole = req.user?.role || 'user';
  
  const enabledMenus = await MenuSettings.find({
    isEnabled: true,
    $or: [
      { requiredRole: 'user' },
      { requiredRole: userRole }
    ]
  }).sort({ category: 1, order: 1 });
  
  res.status(200).json({
    success: true,
    count: enabledMenus.length,
    data: enabledMenus
  });
});

// @desc    Toggle menu item status
// @route   PATCH /api/v1/menu-settings/:id/toggle
// @access  Admin
exports.toggleMenuItem = asyncHandler(async (req, res, next) => {
  const menuItem = await MenuSettings.findById(req.params.id);
  
  if (!menuItem) {
    return next(new AppError('Menu item not found', 404));
  }
  
  menuItem.isEnabled = !menuItem.isEnabled;
  await menuItem.save();
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Update menu item
// @route   PUT /api/v1/menu-settings/:id
// @access  Admin
exports.updateMenuItem = asyncHandler(async (req, res, next) => {
  const { text, path, isEnabled, category, order, requiredRole } = req.body;
  
  const menuItem = await MenuSettings.findByIdAndUpdate(
    req.params.id,
    { text, path, isEnabled, category, order, requiredRole },
    { new: true, runValidators: true }
  );
  
  if (!menuItem) {
    return next(new AppError('Menu item not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Initialize default menu items
// @route   POST /api/v1/menu-settings/initialize
// @access  Admin
exports.initializeMenuItems = asyncHandler(async (req, res, next) => {
  // Check if menu items already exist
  const existingCount = await MenuSettings.countDocuments();
  if (existingCount > 0) {
    return next(new AppError('Menu items already initialized', 400));
  }
  
  const defaultMenuItems = [
    // Primary menu items
    { menuId: 'dashboard', text: 'Dashboard', path: '/', category: 'primary', order: 1 },
    { menuId: 'e-unify-101', text: 'E-Unify 101', path: '/learn101', category: 'primary', order: 2 },
    { menuId: 'data-literacy', text: 'Data Literacy Module', path: '/data-literacy', category: 'primary', order: 3 },
    { menuId: 'national-production-dataset', text: 'National Production Dataset', path: '/national-production-dataset', category: 'primary', order: 4 },
    { menuId: 'data-governance-quality', text: 'Data Governance & Quality', path: '/data-governance-quality', category: 'primary', order: 5 },
    { menuId: 'e22-classification', text: 'E-Unify E22 Classification', path: '/e22-classification', category: 'primary', order: 6 },
    { menuId: 'data-catalog', text: 'Data Catalog', path: '/data-catalog', category: 'primary', order: 7 },
    { menuId: 'data-assets', text: 'Data Assets', path: '/data-assets', category: 'primary', order: 8 },
    { menuId: 'business-processes', text: 'Business Processes', path: '/assets/business-processes', category: 'primary', order: 9 },
    { menuId: 'data-categories', text: 'Data Categories', path: '/assets/data-categories', category: 'primary', order: 10 },
    { menuId: 'data-concepts', text: 'Data Concepts', path: '/assets/data-concepts', category: 'primary', order: 11 },
    { menuId: 'data-domains', text: 'Data Domains', path: '/assets/data-domains', category: 'primary', order: 12 },
    { menuId: 'subject-categories', text: 'Subject Categories', path: '/assets/subject-categories', category: 'primary', order: 13 },
    { menuId: 'asset-types', text: 'Asset Types', path: '/asset-types', category: 'primary', order: 14 },
    { menuId: 'data-governance', text: 'Data Governance', path: '/data-governance', category: 'primary', order: 15 },
    { menuId: 'dgvsmdm', text: 'DG vs MDM', path: '/dgvsmdm', category: 'primary', order: 16 },
    { menuId: 'data-steward-lesson', text: 'Data Steward Lesson', path: '/data-steward-lesson', category: 'primary', order: 17 },
    { menuId: 'analytics', text: 'Analytics', path: '/analytics', category: 'primary', order: 18 },
    { menuId: 'study-aids-business-analytics', text: 'Study Aids: Business Analytics', path: '/study-aids/business-analytics', category: 'primary', order: 19 },
    { menuId: 'integration', text: 'Integration', path: '/integration', category: 'primary', order: 20 },
    { menuId: 'weekly-status', text: 'Weekly Status', path: '/weekly-status', category: 'primary', order: 21 },
    { menuId: 'monthly-status', text: 'Monthly Status', path: '/monthly-status', category: 'primary', order: 22 },
    
    // Secondary menu items
    { menuId: 'about-e-unify', text: 'About E-Unify', path: '/about', category: 'secondary', order: 1 },
    { menuId: 'documentation', text: 'Documentation', path: '/docs', category: 'secondary', order: 2 },
    { menuId: 'settings', text: 'Settings', path: '/settings', category: 'secondary', order: 3 }
  ];
  
  const createdMenuItems = await MenuSettings.insertMany(defaultMenuItems);
  
  res.status(201).json({
    success: true,
    count: createdMenuItems.length,
    data: createdMenuItems
  });
});

// @desc    Bulk toggle menu items
// @route   PATCH /api/v1/menu-settings/bulk-toggle
// @access  Admin
exports.bulkToggleMenuItems = asyncHandler(async (req, res, next) => {
  const { menuIds, isEnabled } = req.body;
  
  if (!Array.isArray(menuIds) || menuIds.length === 0) {
    return next(new AppError('Please provide an array of menu IDs', 400));
  }
  
  const result = await MenuSettings.updateMany(
    { _id: { $in: menuIds } },
    { isEnabled: isEnabled }
  );
  
  res.status(200).json({
    success: true,
    message: `Updated ${result.modifiedCount} menu items`,
    data: result
  });
});
