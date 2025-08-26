const E22USCISRoles = require('../models/E22USCISRoles');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

const defaultContent = {
  mainTitle: 'USCIS Roles and Responsibilities',
  intro:
    'The processing and adjudication of E22 classification cases involves multiple roles within USCIS. Each position has specific responsibilities in ensuring that applications are properly evaluated and processed in accordance with immigration laws and policies.',
  primaryRoles: [
    {
      title: 'Immigration Service Officers',
      bullets: [
        { text: 'Conduct initial review of E22 applications' },
        { text: 'Verify relationship documentation between principal and spouse' },
        { text: 'Process biometrics appointments and review results' },
        { text: 'Issue Requests for Evidence (RFEs) when additional documentation is needed' }
      ]
    },
    {
      title: 'Immigration Officers',
      bullets: [
        { text: 'Conduct interviews with E22 applicants' },
        { text: 'Assess relationship validity through interview questions' },
        { text: 'Evaluate admissibility under INA Section 212(a)' },
        { text: 'Make recommendations or decisions on E22 applications' }
      ]
    },
    {
      title: 'Supervisory Officers',
      bullets: [
        { text: 'Review complex or challenging E22 cases' },
        { text: 'Provide guidance on policy interpretation' },
        { text: 'Authorize final decisions on applications' },
        { text: 'Ensure consistency in adjudication standards' }
      ]
    }
  ],
  supportingRoles: [
    {
      title: 'Background Check Staff',
      bullets: [
        { text: 'Conduct security checks through government databases' },
        { text: 'Identify security concerns and flag cases for officer review' }
      ]
    },
    {
      title: 'Fraud Detection Specialists',
      bullets: [
        { text: 'Detect marriage fraud and misrepresentations' },
        { text: 'Perform site visits and other verification methods' }
      ]
    },
    {
      title: 'Technical Support Specialists',
      bullets: [
        { text: 'Maintain case management systems and databases' },
        { text: 'Ensure system functionality for processing and reporting' }
      ]
    }
  ],
  workflowTitle: 'Operational Workflow',
  workflowSteps: [
    { text: 'Receipt and Initial Processing' },
    { text: 'Biometrics Collection' },
    { text: 'Background Checks' },
    { text: 'Initial Review' },
    { text: 'Interview (if required)' },
    { text: 'Final Decision' },
    { text: 'Card Production (if approved)' }
  ],
  updatedBy: 'System'
};

exports.getAllUSCISRoles = asyncHandler(async (req, res) => {
  const items = await E22USCISRoles.find().sort({ updatedAt: -1 });
  if (items.length === 0) {
    const created = await E22USCISRoles.create(defaultContent);
    return res.status(200).json({ success: true, data: created });
  }
  res.status(200).json({ success: true, count: items.length, data: items });
});

exports.getLatestUSCISRoles = asyncHandler(async (req, res) => {
  let item = await E22USCISRoles.findOne().sort({ updatedAt: -1 });
  if (!item) item = await E22USCISRoles.create(defaultContent);
  res.status(200).json({ success: true, data: item });
});

exports.getUSCISRolesById = asyncHandler(async (req, res, next) => {
  const item = await E22USCISRoles.findById(req.params.id);
  if (!item) return next(new AppError('USCIS Roles not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.createUSCISRoles = asyncHandler(async (req, res) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  const item = await E22USCISRoles.create(req.body);
  res.status(201).json({ success: true, data: item });
});

exports.updateUSCISRoles = asyncHandler(async (req, res, next) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  req.body.lastUpdated = new Date();
  const item = await E22USCISRoles.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return next(new AppError('USCIS Roles not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.deleteUSCISRoles = asyncHandler(async (req, res, next) => {
  const item = await E22USCISRoles.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('USCIS Roles not found', 404));
  res.status(200).json({ success: true, data: {} });
});
