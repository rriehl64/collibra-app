const E22Overview = require('../models/E22Overview');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

/**
 * @desc    Get E22 Overview content
 * @route   GET /api/v1/e22/overview
 * @access  Public
 */
exports.getE22Overview = asyncHandler(async (req, res, next) => {
  // Get the most recent overview document (or create default if none exists)
  let overview = await E22Overview.findOne().sort({ createdAt: -1 });
  
  if (!overview) {
    // Create default content if no document exists
    const defaultFeatures = [
      {
        title: 'Derivative Status',
        description: 'E22 is a derivative status that allows the spouse of an EB-2 principal immigrant to obtain lawful permanent resident status based on their relationship.'
      },
      {
        title: 'Same Priority Date',
        description: 'E22 beneficiaries share the same priority date as the principal applicant, allowing for coordinated processing and immigration timing.'
      },
      {
        title: 'Permanent Status',
        description: 'Like the principal applicant, E22 beneficiaries receive full lawful permanent resident status with all rights and privileges.'
      },
      {
        title: 'Family Unity Focus',
        description: 'E22 classification promotes family unity by ensuring spouses can accompany or follow the principal EB-2 immigrant to the United States.'
      }
    ];

    const defaultImportance = [
      {
        paragraph: 'The E22 classification is an essential component of the U.S. employment-based immigration system. It ensures that talented individuals who qualify for EB-2 green cards can bring their spouses with them, maintaining family unity while meeting U.S. workforce needs.'
      },
      {
        paragraph: 'This classification reflects the understanding that successful immigration outcomes often depend on the ability of families to remain together, particularly for high-skilled immigrants who make significant contributions to the U.S. economy and society.'
      }
    ];

    overview = await E22Overview.create({
      mainTitle: 'What Is E22?',
      mainDescription: 'E22 is a U.S. immigration code indicating a lawful permanent resident status for the spouse of a principal EB-2 immigrant (advanced degree professional or person of exceptional ability). EB-2 is a sought-after employment-based green card preference category.',
      featuresTitle: 'Key Features of E22 Classification',
      keyFeatures: defaultFeatures,
      importanceTitle: 'Importance in the Immigration System',
      importanceDescription: defaultImportance,
      updatedBy: 'System'
    });
  }

  res.status(200).json({
    success: true,
    data: overview
  });
});

/**
 * @desc    Update E22 Overview content
 * @route   PUT /api/v1/e22/overview/:id
 * @access  Private (Admin)
 */
exports.updateE22Overview = asyncHandler(async (req, res, next) => {
  let overview = await E22Overview.findById(req.params.id);

  if (!overview) {
    return next(new AppError(`E22 Overview with ID ${req.params.id} not found`, 404));
  }

  // Add the user who made the update
  if (req.user && req.user.name) {
    req.body.updatedBy = req.user.name;
  } else {
    req.body.updatedBy = 'Unknown User';
  }
  
  // Update the last updated timestamp
  req.body.lastUpdated = Date.now();

  overview = await E22Overview.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: overview
  });
});

/**
 * @desc    Create new E22 Overview document
 * @route   POST /api/v1/e22/overview
 * @access  Private (Admin)
 */
exports.createE22Overview = asyncHandler(async (req, res, next) => {
  // Add the user who created the document
  if (req.user && req.user.name) {
    req.body.updatedBy = req.user.name;
  } else {
    req.body.updatedBy = 'Unknown User';
  }

  const overview = await E22Overview.create(req.body);

  res.status(201).json({
    success: true,
    data: overview
  });
});
