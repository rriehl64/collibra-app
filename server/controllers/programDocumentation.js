const asyncHandler = require('express-async-handler');
const ProgramDocumentation = require('../models/ProgramDocumentation');

// @desc    Get program documentation by project ID
// @route   GET /api/v1/program-documentation/:projectId
// @access  Private
exports.getProgramDocumentation = asyncHandler(async (req, res, next) => {
  const documentation = await ProgramDocumentation.findOne({ 
    projectId: req.params.projectId 
  });

  if (!documentation) {
    return res.status(404).json({
      success: false,
      error: 'Program documentation not found'
    });
  }

  res.status(200).json({
    success: true,
    data: documentation
  });
});

// @desc    Get all program documentation for a portfolio
// @route   GET /api/v1/program-documentation/portfolio/:portfolioId
// @access  Private
exports.getPortfolioDocumentation = asyncHandler(async (req, res, next) => {
  const documentation = await ProgramDocumentation.find({ 
    portfolioId: req.params.portfolioId 
  });

  res.status(200).json({
    success: true,
    count: documentation.length,
    data: documentation
  });
});

// @desc    Create program documentation
// @route   POST /api/v1/program-documentation
// @access  Private
exports.createProgramDocumentation = asyncHandler(async (req, res, next) => {
  const documentation = await ProgramDocumentation.create(req.body);

  res.status(201).json({
    success: true,
    data: documentation
  });
});

// @desc    Update program documentation
// @route   PUT /api/v1/program-documentation/:projectId
// @access  Private
exports.updateProgramDocumentation = asyncHandler(async (req, res, next) => {
  let documentation = await ProgramDocumentation.findOne({ 
    projectId: req.params.projectId 
  });

  if (!documentation) {
    return res.status(404).json({
      success: false,
      error: 'Program documentation not found'
    });
  }

  documentation = await ProgramDocumentation.findOneAndUpdate(
    { projectId: req.params.projectId },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: documentation
  });
});

// @desc    Update specific documentation section
// @route   PUT /api/v1/program-documentation/:projectId/section/:sectionId
// @access  Private
exports.updateDocumentationSection = asyncHandler(async (req, res, next) => {
  const documentation = await ProgramDocumentation.findOne({ 
    projectId: req.params.projectId 
  });

  if (!documentation) {
    return res.status(404).json({
      success: false,
      error: 'Program documentation not found'
    });
  }

  const sectionIndex = documentation.sections.findIndex(
    section => section.id === req.params.sectionId
  );

  if (sectionIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Documentation section not found'
    });
  }

  // Update the specific section
  documentation.sections[sectionIndex] = {
    ...documentation.sections[sectionIndex].toObject(),
    ...req.body,
    lastUpdated: new Date(),
    updatedBy: req.user?.name || 'System'
  };

  await documentation.save();

  res.status(200).json({
    success: true,
    data: documentation
  });
});

// @desc    Delete program documentation
// @route   DELETE /api/v1/program-documentation/:projectId
// @access  Private
exports.deleteProgramDocumentation = asyncHandler(async (req, res, next) => {
  const documentation = await ProgramDocumentation.findOne({ 
    projectId: req.params.projectId 
  });

  if (!documentation) {
    return res.status(404).json({
      success: false,
      error: 'Program documentation not found'
    });
  }

  await documentation.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
