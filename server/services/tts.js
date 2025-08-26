const axios = require('axios');
const crypto = require('crypto');

const ELEVEN_API = 'https://api.elevenlabs.io/v1';

function hashKey(input) {
  return crypto.createHash('sha1').update(input).digest('hex');
}

async function generateElevenLabsTTS({ apiKey, text, voiceId, modelId = 'eleven_monolingual_v1', format = 'mp3', optimizeLatency = 0, stability, similarityBoost, style, useSpeakerBoost }) {
  if (!apiKey) throw new Error('Missing ELEVENLABS_API_KEY');
  if (!voiceId) throw new Error('Missing ElevenLabs voiceId');
  const url = `${ELEVEN_API}/text-to-speech/${encodeURIComponent(voiceId)}/stream?optimize_streaming_latency=${optimizeLatency}`;

  const headers = {
    'xi-api-key': apiKey,
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json'
  };

  const body = {
    text,
    model_id: modelId,
    voice_settings: {
      stability: stability ?? 0.5,
      similarity_boost: similarityBoost ?? 0.8,
      style: style ?? 0,
      use_speaker_boost: useSpeakerBoost ?? true
    }
  };

  const resp = await axios.post(url, body, {
    headers,
    responseType: 'arraybuffer',
    timeout: 30000
  });

  return Buffer.from(resp.data);
}

module.exports = {
  generateElevenLabsTTS,
  hashKey,
};
