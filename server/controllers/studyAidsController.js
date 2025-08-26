const catchAsync = require('../middleware/catchAsync');
const StudyAidsChapter = require('../models/StudyAidsChapter');

// Phase 1: In-memory seed for Business Analytics study aids (Ch. 1-3)
const baModule = {
  id: 'ba',
  title: 'Study Aids: Business Analytics',
  description: 'Guides, practice, labs, and resources aligned to Albright & Winston.',
  sections: ['overview', 'chapters', 'practice', 'labs', 'case-studies', 'cheatsheets', 'glossary', 'resources', 'progress']
};

const chapters = [
  {
    id: '1',
    number: 1,
    title: 'Introduction to Business Analytics',
    objectives: [
      'Understand scope and value of business analytics',
      'Differentiate description, visualization, inference, and relationship analysis',
      'Recognize good spreadsheet modeling practices'
    ],
    summary:
      'Introduces the role of analytics in decision making, key components (description, visualization, inference, relationships), and spreadsheet modeling basics.',
    resources: [
      { label: 'Table of Contents', url: 'https://sites.google.com/view/albrightbooks/home/business-analytics-data-analysis-decision-making/badadm-8e-table-of-contents' }
    ],
    tags: ['intro', 'overview']
  },
  {
    id: '2',
    number: 2,
    title: 'Describing the Distribution of a Variable',
    objectives: [
      'Compute and interpret central tendency and variability',
      'Create distribution visualizations',
      'Summarize insights responsibly'
    ],
    summary:
      'Focuses on single-variable summaries (mean, median, variance), shape, and visualization for clear communication.',
    resources: [],
    tags: ['descriptive', 'visualization']
  },
  {
    id: '3',
    number: 3,
    title: 'Finding Relationships among Variables',
    objectives: [
      'Assess correlations and associations',
      'Use scatterplots and pivot tables to explore relationships',
      'Avoid common pitfalls in interpreting relationships'
    ],
    summary:
      'Explores bivariate relationships, correlation, and exploratory visuals to guide modeling.',
    resources: [],
    tags: ['relationships', 'exploration']
  }
];

const quizByChapter = {
  '1': [
    {
      id: 'q1-1',
      type: 'mcq',
      prompt: 'Which component is NOT one of the four highlighted in Chapter 1?',
      options: ['Data Description', 'Data Visualization', 'Data Inference', 'Neural Networks'],
      answerKey: 3,
      explanation: 'Chapter 1 highlights description, visualization, inference, and relationship searching.'
    }
  ],
  '2': [
    {
      id: 'q2-1',
      type: 'mcq',
      prompt: 'Which statistic is most robust to outliers?',
      options: ['Mean', 'Median', 'Variance', 'Standard Deviation'],
      answerKey: 1,
      explanation: 'The median is robust to outliers.'
    }
  ],
  '3': [
    {
      id: 'q3-1',
      type: 'mcq',
      prompt: 'A strong correlation implies:',
      options: ['Causation', 'Association, not necessarily causation', 'No relationship', 'Measurement error'],
      answerKey: 1,
      explanation: 'Correlation indicates association, not causation.'
    }
  ]
};

exports.getModule = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, data: baModule });
});

exports.getChapters = catchAsync(async (req, res) => {
  // Prefer persisted chapters; fall back to in-memory seed if none exist
  const dbChapters = await StudyAidsChapter.find({}).sort({ number: 1 }).lean();
  if (dbChapters && dbChapters.length > 0) {
    return res.status(200).json({ success: true, data: dbChapters });
  }
  return res.status(200).json({ success: true, data: chapters });
});

exports.getChapter = catchAsync(async (req, res) => {
  const { id } = req.params;
  // Try DB by id or number
  let ch = await StudyAidsChapter.findOne({ id }).lean();
  if (!ch && !Number.isNaN(Number(id))) {
    ch = await StudyAidsChapter.findOne({ number: Number(id) }).lean();
  }
  if (!ch) {
    ch = chapters.find((c) => c.id === id || c.number === Number(id));
  }
  if (!ch) return res.status(404).json({ success: false, error: 'Chapter not found' });
  res.status(200).json({ success: true, data: ch });
});

exports.getQuiz = catchAsync(async (req, res) => {
  const items = quizByChapter[req.params.id] || [];
  res.status(200).json({ success: true, data: items });
});

exports.submitQuiz = catchAsync(async (req, res) => {
  const { answers } = req.body || { answers: [] };
  // Minimal scoring logic for Phase 1
  const items = quizByChapter[req.params.id] || [];
  let score = 0;
  const results = items.map((q, idx) => {
    const correct = q.answerKey === answers[idx];
    if (correct) score += 1;
    return { id: q.id, correct, explanation: q.explanation };
  });
  res.status(200).json({ success: true, data: { total: items.length, score, results } });
});

exports.getLabs = catchAsync(async (req, res) => {
  const labs = [
    {
      id: 'lab-excel-1',
      tool: 'excel',
      title: 'Descriptive Statistics with Excel',
      steps: [
        'Download the provided spreadsheet template',
        'Compute mean/median for the given columns',
        'Create a histogram and interpret the shape'
      ],
      files: [],
      outcomes: ['Basic descriptive summary', 'Clear visualization']
    }
  ];
  res.status(200).json({ success: true, data: labs });
});

exports.getProgress = catchAsync(async (req, res) => {
  // Phase 1: return an empty/default progress object; hook with real user later
  res.status(200).json({ success: true, data: { chapters: {}, quizzes: {} } });
});

// Update a chapter by id (string id or numeric number in params)
exports.updateChapter = catchAsync(async (req, res) => {
  const { id } = req.params;
  const allowed = [
    'title',
    'summary',
    'objectives',
    'teachingPoints',
    'keyTakeaways',
    'applications',
    'resources',
    'tags'
  ];
  const update = {};
  for (const key of allowed) {
    if (key in req.body) update[key] = req.body[key];
  }
  // Do not allow id/number changes
  delete update.id;
  delete update.number;

  // Find by id or by number
  let query = { id };
  if (!update.id && !Number.isNaN(Number(id))) {
    query = { $or: [{ id }, { number: Number(id) }] };
  }

  let updated = await StudyAidsChapter.findOneAndUpdate(query, { $set: update }, {
    new: true,
    runValidators: true,
    lean: true
  });

  // If not found in DB, try to create from in-memory seed so authors can edit immediately
  if (!updated) {
    const numericId = Number(id);
    const seed = chapters.find((c) => c.id === id || c.number === numericId);
    if (!seed) {
      return res.status(404).json({ success: false, error: 'Chapter not found' });
    }
    const baseDoc = { ...seed, ...update, id: seed.id, number: seed.number };
    const created = await StudyAidsChapter.create(baseDoc);
    // Return lean-like object
    updated = created.toObject();
  }

  res.status(200).json({ success: true, data: updated });
});
