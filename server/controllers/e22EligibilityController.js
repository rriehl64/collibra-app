const E22Eligibility = require('../models/E22Eligibility');
const catchAsync = require('../middleware/async');
const AppError = require('../middleware/appError');

// Default content for creating the first eligibility document if none exists
const defaultEligibilityContent = {
  mainTitle: "E22 Eligibility Requirements",
  mainDescription: "Understanding the eligibility requirements for E22 classification is essential for determining if a spouse qualifies for this derivative status.",
  criteriaTitle: "Primary Eligibility Criteria",
  eligibilityCriteria: [
    {
      title: "Relationship to Principal Applicant",
      description: "The applicant must be the legally married spouse of the principal EB-2 immigrant (E21) at the time of application processing."
    },
    {
      title: "Principal Qualification",
      description: "The principal applicant must qualify for and be approved for EB-2 classification based on advanced degree or exceptional ability."
    },
    {
      title: "Marriage Validity",
      description: "The marriage must be legally valid and recognized in the jurisdiction where it was performed and must not be entered into for immigration purposes."
    },
    {
      title: "Admissibility",
      description: "Like all immigrants, E22 applicants must be admissible to the United States under immigration law, with no disqualifying factors such as certain criminal history or security concerns."
    }
  ],
  derivativeTitle: "Derivative Status Considerations",
  derivativeIntro: "As a derivative classification, E22 has specific eligibility characteristics that distinguish it from principal applicant categories:",
  derivativeEligibility: [
    {
      title: "No Separate Qualification Needed",
      description: "Unlike the principal EB-2 applicant, the E22 spouse does not need to demonstrate advanced degrees or exceptional ability."
    },
    {
      title: "Concurrent or Follow-to-Join",
      description: "The spouse may apply concurrently with the principal applicant or later follow to join the principal who has already been granted permanent residence."
    },
    {
      title: "Priority Date",
      description: "The E22 beneficiary uses the same priority date as the principal EB-2 applicant, which determines their place in line for visa number availability."
    },
    {
      title: "Conversion Possibilities",
      description: "If the relationship with the principal applicant changes (e.g., divorce), the derivative beneficiary may lose eligibility unless they qualify for another status."
    }
  ],
  documentTitle: "Documentation Requirements",
  documentIntro: "To establish eligibility for E22 classification, applicants must provide specific documentation:",
  documentRequirements: [
    {
      title: "Marriage Certificate",
      description: "Official certificate proving legal marriage to the principal EB-2 applicant."
    },
    {
      title: "Principal's Approval Notice",
      description: "Copy of the principal applicant's I-140 approval notice demonstrating EB-2 classification."
    },
    {
      title: "Relationship Evidence",
      description: "Documentation proving the bona fide nature of the marriage, such as joint financial records, photographs, and correspondence."
    },
    {
      title: "Identity Documents",
      description: "Valid passport, birth certificate, and other identity documents as required by USCIS."
    }
  ]
};

// @desc    Get all E22 eligibility entries
// @route   GET /api/v1/e22/eligibility
// @access  Public
exports.getAllEligibility = catchAsync(async (req, res, next) => {
  const eligibility = await E22Eligibility.find().sort({ lastUpdated: -1 });
  
  // If no eligibility document exists, create default one
  if (eligibility.length === 0) {
    const newEligibility = await E22Eligibility.create(defaultEligibilityContent);
    
    return res.status(200).json({
      success: true,
      data: newEligibility
    });
  }
  
  res.status(200).json({
    success: true,
    count: eligibility.length,
    data: eligibility
  });
});

// @desc    Get latest E22 eligibility entry
// @route   GET /api/v1/e22/eligibility/latest
// @access  Public
exports.getLatestEligibility = catchAsync(async (req, res, next) => {
  const eligibility = await E22Eligibility.findOne().sort({ lastUpdated: -1 });
  
  // If no eligibility document exists, create default one
  if (!eligibility) {
    const newEligibility = await E22Eligibility.create(defaultEligibilityContent);
    
    return res.status(200).json({
      success: true,
      data: newEligibility
    });
  }
  
  res.status(200).json({
    success: true,
    data: eligibility
  });
});

// @desc    Get single E22 eligibility entry by ID
// @route   GET /api/v1/e22/eligibility/:id
// @access  Public
exports.getEligibilityById = catchAsync(async (req, res, next) => {
  const eligibility = await E22Eligibility.findById(req.params.id);
  
  if (!eligibility) {
    return next(new AppError(`E22 Eligibility entry not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: eligibility
  });
});

// @desc    Create new E22 eligibility entry
// @route   POST /api/v1/e22/eligibility
// @access  Private (Admin only)
exports.createEligibility = catchAsync(async (req, res, next) => {
  // Add user info if available from auth middleware
  if (req.user) {
    req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  }
  
  const eligibility = await E22Eligibility.create(req.body);
  
  res.status(201).json({
    success: true,
    data: eligibility
  });
});

// @desc    Update E22 eligibility entry
// @route   PUT /api/v1/e22/eligibility/:id
// @access  Private (Admin only)
exports.updateEligibility = catchAsync(async (req, res, next) => {
  // Add user info if available from auth middleware
  if (req.user) {
    req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  }
  
  // Add last updated timestamp
  req.body.lastUpdated = new Date();
  
  const eligibility = await E22Eligibility.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!eligibility) {
    return next(new AppError(`E22 Eligibility entry not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: eligibility
  });
});

// @desc    Delete E22 eligibility entry
// @route   DELETE /api/v1/e22/eligibility/:id
// @access  Private (Admin only)
exports.deleteEligibility = catchAsync(async (req, res, next) => {
  const eligibility = await E22Eligibility.findByIdAndDelete(req.params.id);
  
  if (!eligibility) {
    return next(new AppError(`E22 Eligibility entry not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
