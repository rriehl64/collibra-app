const E22LegalFoundation = require('../models/E22LegalFoundation');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

const defaultContent = {
  mainTitle: 'Legal Foundation',
  mainDescription:
    'Section 203(d) of the Immigration and Nationality Act (INA) provides for derivative status for spouses and children of principal applicants.',
  keyPrinciplesTitle: 'Key Legal Principles',
  keyPrinciples: [
    'Derivative status through qualifying relationship',
    'Same priority date as principal applicant',
    'Equal consideration for visa number allocation',
    "Ability to 'follow to join' after principal's admission"
  ],
  referencesTitle: 'Supporting Regulations and Policy Guidance',
  references: [
    { title: '8 CFR § 204.5', description: 'Employment-based petition requirements and derivative beneficiaries.' },
    { title: '9 FAM 502.1', description: 'Foreign Affairs Manual guidance on immigrant visas for derivatives.' },
    { title: 'USCIS Policy Manual', description: 'Guidance on employment-based immigration and derivative status.' }
  ],
  updatedBy: 'System'
};

exports.getAllLegalFoundation = asyncHandler(async (req, res) => {
  const items = await E22LegalFoundation.find().sort({ updatedAt: -1 });
  if (items.length === 0) {
    const created = await E22LegalFoundation.create(defaultContent);
    return res.status(200).json({ success: true, data: created });
  }
  res.status(200).json({ success: true, count: items.length, data: items });
});

exports.getLatestLegalFoundation = asyncHandler(async (req, res) => {
  let item = await E22LegalFoundation.findOne().sort({ updatedAt: -1 });
  if (!item) item = await E22LegalFoundation.create(defaultContent);
  res.status(200).json({ success: true, data: item });
});

exports.getLegalFoundationById = asyncHandler(async (req, res, next) => {
  const item = await E22LegalFoundation.findById(req.params.id);
  if (!item) return next(new AppError('Legal Foundation not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.createLegalFoundation = asyncHandler(async (req, res) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  const item = await E22LegalFoundation.create(req.body);
  res.status(201).json({ success: true, data: item });
});

exports.updateLegalFoundation = asyncHandler(async (req, res, next) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  req.body.lastUpdated = new Date();
  const item = await E22LegalFoundation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return next(new AppError('Legal Foundation not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.deleteLegalFoundation = asyncHandler(async (req, res, next) => {
  const item = await E22LegalFoundation.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Legal Foundation not found', 404));
  res.status(200).json({ success: true, data: {} });
});
