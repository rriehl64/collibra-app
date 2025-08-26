const express = require('express');
const {
  getModule,
  getChapters,
  getChapter,
  getQuiz,
  submitQuiz,
  getLabs,
  getProgress,
  updateChapter
} = require('../controllers/studyAidsController');

const router = express.Router();

// Public endpoints for Phase 1
router.get('/ba', getModule);
router.get('/ba/chapters', getChapters);
router.get('/ba/chapters/:id', getChapter);
router.put('/ba/chapters/:id', updateChapter);
router.get('/ba/chapters/:id/quiz', getQuiz);
router.post('/ba/chapters/:id/quiz/submit', submitQuiz);
router.get('/ba/labs', getLabs);
router.get('/ba/progress', getProgress);

module.exports = router;
