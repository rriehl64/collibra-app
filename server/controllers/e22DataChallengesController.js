const E22DataChallenges = require('../models/E22DataChallenges');
const asyncHandler = require('../middleware/async');
const AppError = require('../middleware/appError');

const defaultContent = {
  mainTitle: 'Data and Challenges',
  intro: 'Common data challenges and mitigation strategies for E22 processing.',
  challengesTitle: 'Key Challenges',
  challenges: [
    { title: 'Document Verification', description: 'Ensuring authenticity of marriage and identity documents.' },
    { title: 'Fraud Detection', description: 'Detecting sham marriages or misrepresentation.' },
    { title: 'Backlog Management', description: 'Managing caseloads and prioritization effectively.' }
  ],
  mitigationTitle: 'Mitigation Strategies',
  mitigations: [
    { title: 'Enhanced Training', description: 'Provide staff with tools and training to identify fraud indicators.' },
    { title: 'System Integration', description: 'Improve interoperability between case systems and background check databases.' },
    { title: 'Data Quality Controls', description: 'Implement validations and audits to reduce errors.' }
  ],
  updatedBy: 'System'
};

exports.getAllDataChallenges = asyncHandler(async (req, res) => {
  const items = await E22DataChallenges.find().sort({ updatedAt: -1 });
  if (items.length === 0) {
    const created = await E22DataChallenges.create(defaultContent);
    return res.status(200).json({ success: true, data: created });
  }
  res.status(200).json({ success: true, count: items.length, data: items });
});

exports.getLatestDataChallenges = asyncHandler(async (req, res) => {
  let item = await E22DataChallenges.findOne().sort({ updatedAt: -1 });
  if (!item) item = await E22DataChallenges.create(defaultContent);
  res.status(200).json({ success: true, data: item });
});

exports.getDataChallengesById = asyncHandler(async (req, res, next) => {
  const item = await E22DataChallenges.findById(req.params.id);
  if (!item) return next(new AppError('Data & Challenges not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.createDataChallenges = asyncHandler(async (req, res) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  const item = await E22DataChallenges.create(req.body);
  res.status(201).json({ success: true, data: item });
});

exports.updateDataChallenges = asyncHandler(async (req, res, next) => {
  if (req.user) req.body.updatedBy = req.user.email || req.user.name || req.user.id;
  req.body.lastUpdated = new Date();
  const item = await E22DataChallenges.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return next(new AppError('Data & Challenges not found', 404));
  res.status(200).json({ success: true, data: item });
});

exports.deleteDataChallenges = asyncHandler(async (req, res, next) => {
  const item = await E22DataChallenges.findByIdAndDelete(req.params.id);
  if (!item) return next(new AppError('Data & Challenges not found', 404));
  res.status(200).json({ success: true, data: {} });
});
