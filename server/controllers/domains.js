const Domain = require('../models/Domain');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get all domains
 * @route   GET /api/v1/domains
 * @access  Private
 */
exports.getDomains = asyncHandler(async (req, res, next) => {
  const { search, status } = req.query;
  const query = {};
  
  // Apply search filter if provided
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  // Apply status filter if provided
  if (status) {
    query.status = status;
  }
  
  const domains = await Domain.find(query)
    .sort({ updatedAt: -1 })
    .select('-__v');
  
  res.status(200).json({
    success: true,
    count: domains.length,
    data: domains
  });
});

/**
 * @desc    Get single domain
 * @route   GET /api/v1/domains/:id
 * @access  Private
 */
exports.getDomain = asyncHandler(async (req, res, next) => {
  const domain = await Domain.findById(req.params.id);
  
  if (!domain) {
    return res.status(404).json({
      success: false,
      error: 'Domain not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: domain
  });
});

/**
 * @desc    Create domain
 * @route   POST /api/v1/domains
 * @access  Private
 */
exports.createDomain = asyncHandler(async (req, res, next) => {
  // Add user ID if authenticated
  if (req.user && req.user.id) {
    req.body.owner = req.user.id;
  }
  
  const domain = await Domain.create(req.body);
  
  res.status(201).json({
    success: true,
    data: domain
  });
});

/**
 * @desc    Update domain
 * @route   PUT /api/v1/domains/:id
 * @access  Private
 */
exports.updateDomain = asyncHandler(async (req, res, next) => {
  const domain = await Domain.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!domain) {
    return res.status(404).json({
      success: false,
      error: 'Domain not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: domain
  });
});

/**
 * @desc    Delete domain
 * @route   DELETE /api/v1/domains/:id
 * @access  Private
 */
exports.deleteDomain = asyncHandler(async (req, res, next) => {
  const domain = await Domain.findByIdAndDelete(req.params.id);
  
  if (!domain) {
    return res.status(404).json({
      success: false,
      error: 'Domain not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
