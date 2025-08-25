const path = require('path');
const fs = require('fs');
const { generateElevenLabsTTS, hashKey } = require('../services/tts');

const CACHE_DIR = path.join(__dirname, '..', '..', 'public', 'tts-cache');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

exports.generate = async (req, res) => {
  try {
    const { text, voiceId, modelId, format = 'mp3', optimizeLatency = 0, stability, similarityBoost, style, useSpeakerBoost } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Missing text' });
    }
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const resolvedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey) return res.status(400).json({ success: false, error: 'Missing ELEVENLABS_API_KEY' });
    if (!resolvedVoiceId) return res.status(400).json({ success: false, error: 'Missing voiceId (or ELEVENLABS_VOICE_ID)' });

    // Cache by text+voice+model+settings
    const key = hashKey(JSON.stringify({ text, voiceId: resolvedVoiceId, modelId, format, optimizeLatency, stability, similarityBoost, style, useSpeakerBoost }));
    ensureDir(CACHE_DIR);
    const fname = `${key}.${format === 'wav' ? 'wav' : 'mp3'}`;
    const fpath = path.join(CACHE_DIR, fname);

    if (fs.existsSync(fpath)) {
      return res.status(200).json({ success: true, url: `/tts-cache/${fname}` });
    }

    const audioBuf = await generateElevenLabsTTS({ apiKey, text, voiceId: resolvedVoiceId, modelId, format, optimizeLatency, stability, similarityBoost, style, useSpeakerBoost });
    fs.writeFileSync(fpath, audioBuf);
    return res.status(200).json({ success: true, url: `/tts-cache/${fname}` });
  } catch (err) {
    console.error('TTS error', err?.response?.data || err);
    return res.status(500).json({ success: false, error: 'Failed to generate TTS audio' });
  }
};
