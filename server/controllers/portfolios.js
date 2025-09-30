const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get all portfolios
 * @route   GET /api/v1/portfolios
 * @access  Private
 */
exports.getPortfolios = asyncHandler(async (req, res, next) => {
  const { search, status, manager } = req.query;
  const query = {};
  
  // Apply search filter if provided
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'projects.name': { $regex: search, $options: 'i' } }
    ];
  }
  
  // Apply status filter if provided
  if (status) {
    query.status = status;
  }
  
  // Apply manager filter if provided
  if (manager) {
    query.manager = { $regex: manager, $options: 'i' };
  }
  
  const portfolios = await Portfolio.find(query)
    .sort({ updatedAt: -1 })
    .select('-__v');
  
  res.status(200).json({
    success: true,
    count: portfolios.length,
    data: portfolios
  });
});

/**
 * @desc    Get single portfolio
 * @route   GET /api/v1/portfolios/:id
 * @access  Private
 */
exports.getPortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ id: req.params.id });
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Create portfolio
 * @route   POST /api/v1/portfolios
 * @access  Private
 */
exports.createPortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.create(req.body);
  
  res.status(201).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Update portfolio
 * @route   PUT /api/v1/portfolios/:id
 * @access  Private
 */
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Delete portfolio
 * @route   DELETE /api/v1/portfolios/:id
 * @access  Private
 */
exports.deletePortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOneAndDelete({ id: req.params.id });
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Update portfolio KPIs
 * @route   PUT /api/v1/portfolios/:id/kpis
 * @access  Private
 */
exports.updatePortfolioKPIs = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { id: req.params.id },
    { kpis: req.body.kpis },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Update portfolio OKR
 * @route   PUT /api/v1/portfolios/:id/okr
 * @access  Private
 */
exports.updatePortfolioOKR = asyncHandler(async (req, res, next) => {
  // Handle both direct OKR object and wrapped { okr: ... } format
  const okrData = req.body.okr || req.body;
  
  const portfolio = await Portfolio.findOneAndUpdate(
    { id: req.params.id },
    { okr: okrData },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Update portfolio risks
 * @route   PUT /api/v1/portfolios/:id/risks
 * @access  Private
 */
exports.updatePortfolioRisks = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { id: req.params.id },
    { risks: req.body.risks },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Update portfolio innovations
 * @route   PUT /api/v1/portfolios/:id/innovations
 * @access  Private
 */
exports.updatePortfolioInnovations = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { id: req.params.id },
    { innovations: req.body.innovations },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Update portfolio projects
 * @route   PUT /api/v1/portfolios/:id/projects
 * @access  Private
 */
exports.updatePortfolioProjects = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { id: req.params.id },
    { projects: req.body.projects },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Update portfolio milestones
 * @route   PUT /api/v1/portfolios/:id/milestones
 * @access  Private
 */
exports.updatePortfolioMilestones = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { id: req.params.id },
    { milestones: req.body.milestones },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Add project to portfolio
 * @route   POST /api/v1/portfolios/:id/projects
 * @access  Private
 */
exports.addPortfolioProject = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ id: req.params.id });
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  portfolio.projects.push(req.body);
  await portfolio.save();
  
  res.status(201).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Update single project in portfolio
 * @route   PUT /api/v1/portfolios/:id/projects/:projectId
 * @access  Private
 */
exports.updatePortfolioProject = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ id: req.params.id });
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  const projectIndex = portfolio.projects.findIndex(p => p.id === req.params.projectId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }
  
  portfolio.projects[projectIndex] = { ...portfolio.projects[projectIndex].toObject(), ...req.body };
  await portfolio.save();
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Delete project from portfolio
 * @route   DELETE /api/v1/portfolios/:id/projects/:projectId
 * @access  Private
 */
exports.deletePortfolioProject = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ id: req.params.id });
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }
  
  portfolio.projects = portfolio.projects.filter(p => p.id !== req.params.projectId);
  await portfolio.save();
  
  res.status(200).json({
    success: true,
    data: portfolio
  });
});
