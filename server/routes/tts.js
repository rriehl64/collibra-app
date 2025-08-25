const express = require('express');
const router = express.Router();
const { generate } = require('../controllers/ttsController');

// POST /api/v1/tts/generate
router.post('/generate', generate);

module.exports = router;
