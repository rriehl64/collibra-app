const E22ApplicationRequirements = require('../models/E22ApplicationRequirements');
const catchAsync = require('../middleware/async');
const AppError = require('../middleware/appError');

// Default content for creating the first application requirements document if none exists
const defaultApplicationRequirementsContent = {
  mainTitle: "E22 Application Requirements",
  mainDescription: "This section outlines the necessary forms, documents, and procedures required for E22 classification applications. Ensure all requirements are met to avoid processing delays.",
  generalRequirementsTitle: "General Filing Requirements",
  generalRequirements: [
    {
      title: "Concurrent vs. Follow-to-Join Filing",
      description: "E22 applications can be filed concurrently with the principal EB-2 petition or later as a follow-to-join case if the principal has already been approved."
    },
    {
      title: "Form Submission",
      description: "For concurrent filing, submit Form I-485 along with the principal's I-140 petition. For follow-to-join, use Form I-824 to request the beneficiary follow the principal."
    },
    {
      title: "Filing Fees",
      description: "All required filing fees must be paid in full. Fee waivers are generally not available for employment-based immigration petitions."
    },
    {
      title: "Biometrics",
      description: "All applicants must attend a biometrics appointment for fingerprinting and photograph collection after filing Form I-485."
    }
  ],
  formsTitle: "Required Forms",
  forms: [
    {
      formName: "Form I-485",
      formDescription: "Application to Register Permanent Residence or Adjust Status - Required for applicants already in the United States",
      formUrl: "https://www.uscis.gov/i-485"
    },
    {
      formName: "Form I-824",
      formDescription: "Application for Action on an Approved Application or Petition - Used for follow-to-join cases",
      formUrl: "https://www.uscis.gov/i-824"
    },
    {
      formName: "Form I-693",
      formDescription: "Report of Medical Examination and Vaccination Record - Required medical examination by a USCIS-designated civil surgeon",
      formUrl: "https://www.uscis.gov/i-693"
    },
    {
      formName: "Form I-765",
      formDescription: "Application for Employment Authorization - Optional for work permission while I-485 is pending",
      formUrl: "https://www.uscis.gov/i-765"
    }
  ],
  supportingDocsTitle: "Supporting Documentation",
  supportingDocuments: [
    {
      title: "Marriage Certificate",
      description: "Official certificate proving legal marriage to the principal EB-2 applicant",
      isRequired: true
    },
    {
      title: "Birth Certificate",
      description: "Official birth certificate with English translation if in a foreign language",
      isRequired: true
    },
    {
      title: "Passport Photos",
      description: "Recent color photographs meeting USCIS specifications (typically 2 passport-style photos)",
      isRequired: true
    },
    {
      title: "Principal's I-140 Approval Notice",
      description: "Copy of Form I-797 approval notice for the principal applicant's EB-2 petition",
      isRequired: true
    },
    {
      title: "Financial Support Evidence",
      description: "Documentation showing financial stability, such as bank statements, employment verification, or Form I-864",
      isRequired: false
    },
    {
      title: "Relationship Evidence",
      description: "Additional evidence of bona fide marriage such as joint bank accounts, lease agreements, photographs, etc.",
      isRequired: false
    }
  ],
  tipsTitle: "Application Tips and Best Practices",
  applicationTips: [
    {
      title: "Organize Documents Properly",
      description: "Submit well-organized application packages with a clear cover letter detailing all enclosed items. Use tabs or separator sheets for different sections."
    },
    {
      title: "Respond to RFEs Promptly",
      description: "If you receive a Request for Evidence (RFE), respond within the specified timeframe with all requested documentation to avoid delays or denial."
    },
    {
      title: "Keep Copies of Everything",
      description: "Maintain complete copies of all submitted forms and supporting documents for your records."
    },
    {
      title: "Maintain Legal Status",
      description: "Ensure you maintain lawful immigration status while your application is pending, unless eligible for adjustment of status under Section 245(k)."
    }
  ]
};

// @desc    Get all E22 application requirements entries
// @route   GET /api/v1/e22/application-requirements
// @access  Public
exports.getAllApplicationRequirements = catchAsync(async (req, res, next) => {
  const applicationRequirements = await E22ApplicationRequirements.find().sort({ lastUpdated: -1 });
  
  // If no application requirements document exists, create default one
  if (applicationRequirements.length === 0) {
    const newApplicationRequirements = await E22ApplicationRequirements.create(defaultApplicationRequirementsContent);
    
    return res.status(200).json({
      success: true,
      data: newApplicationRequirements
    });
  }
  
  res.status(200).json({
    success: true,
    count: applicationRequirements.length,
    data: applicationRequirements
  });
});

// @desc    Get latest E22 application requirements entry
// @route   GET /api/v1/e22/application-requirements/latest
// @access  Public
exports.getLatestApplicationRequirements = catchAsync(async (req, res, next) => {
  const applicationRequirements = await E22ApplicationRequirements.findOne().sort({ lastUpdated: -1 });
  
  // If no application requirements document exists, create default one
  if (!applicationRequirements) {
    const newApplicationRequirements = await E22ApplicationRequirements.create(defaultApplicationRequirementsContent);
    
    return res.status(200).json({
      success: true,
      data: newApplicationRequirements
    });
  }
  
  res.status(200).json({
    success: true,
    data: applicationRequirements
  });
});

// @desc    Get single E22 application requirements entry by ID
// @route   GET /api/v1/e22/application-requirements/:id
// @access  Public
exports.getApplicationRequirementsById = catchAsync(async (req, res, next) => {
  const applicationRequirements = await E22ApplicationRequirements.findById(req.params.id);
  
  if (!applicationRequirements) {
    return next(new AppError(`E22 Application Requirements entry not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: applicationRequirements
  });
});

// @desc    Create new E22 application requirements entry
// @route   POST /api/v1/e22/application-requirements
// @access  Private (Admin only)
exports.createApplicationRequirements = catchAsync(async (req, res, next) => {
  // Add user info if available from auth middleware
  if (req.user) {
    req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  }
  
  const applicationRequirements = await E22ApplicationRequirements.create(req.body);
  
  res.status(201).json({
    success: true,
    data: applicationRequirements
  });
});

// @desc    Update E22 application requirements entry
// @route   PUT /api/v1/e22/application-requirements/:id
// @access  Private (Admin only)
exports.updateApplicationRequirements = catchAsync(async (req, res, next) => {
  // Add user info if available from auth middleware
  if (req.user) {
    req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  }
  
  // Add last updated timestamp
  req.body.lastUpdated = new Date();
  
  const applicationRequirements = await E22ApplicationRequirements.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!applicationRequirements) {
    return next(new AppError(`E22 Application Requirements entry not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: applicationRequirements
  });
});

// @desc    Delete E22 application requirements entry
// @route   DELETE /api/v1/e22/application-requirements/:id
// @access  Private (Admin only)
exports.deleteApplicationRequirements = catchAsync(async (req, res, next) => {
  const applicationRequirements = await E22ApplicationRequirements.findByIdAndDelete(req.params.id);
  
  if (!applicationRequirements) {
    return next(new AppError(`E22 Application Requirements entry not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
