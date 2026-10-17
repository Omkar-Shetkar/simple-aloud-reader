/**
 * Cloud AI Neural TTS Providers.
 * Supports Azure Speech (Free Tier), OpenAI TTS, ElevenLabs, and Custom/Kokoro-82M endpoints.
 */

import { buildSsml } from './neural-stream.js';

/**
 * Synthesizes speech using Microsoft Azure Cognitive Services Speech REST API.
 * Free tier (F0) grants 500,000 characters per month with full emotional styles.
 * @param {string} text
 * @param {object} settings
 * @param {object} profile
 * @param {number} rate
 * @returns {Promise<Blob>}
 */
export async function synthesizeAzureSpeech(text, settings = {}, profile = {}, rate = 1.0) {
  const apiKey = settings.azureKey?.trim();
  const region = settings.azureRegion?.trim() || 'eastus';
  if (!apiKey) throw new Error('Azure Speech API Key is missing. Please configure it in Settings.');

  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const voiceName = profile.serviceVoiceName || 'en-US-JennyNeural';
  const ssml = buildSsml(text, voiceName, rate);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'SimpleAloudReader/1.0'
    },
    body: ssml
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Azure Speech API error (${res.status}): ${errText || res.statusText}`);
  }

  const blob = await res.blob();
  if (!blob || blob.size === 0) throw new Error('Azure Speech returned an empty audio stream');
  return blob;
}

/**
 * Synthesizes speech using OpenAI TTS API.
 * @param {string} text
 * @param {object} settings
 * @param {number} rate
 * @returns {Promise<Blob>}
 */
export async function synthesizeOpenAiSpeech(text, settings = {}, rate = 1.0) {
  const apiKey = settings.openaiKey?.trim();
  if (!apiKey) throw new Error('OpenAI API Key is missing. Please configure it in Settings.');

  const voice = settings.openaiVoice || 'nova';
  const clampedRate = Math.min(2.0, Math.max(0.75, rate));

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice,
      speed: clampedRate
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`OpenAI TTS error (${res.status}): ${errData.error?.message || res.statusText}`);
  }

  const blob = await res.blob();
  if (!blob || blob.size === 0) throw new Error('OpenAI returned an empty audio stream');
  return blob;
}

/**
 * Synthesizes speech using ElevenLabs API.
 * @param {string} text
 * @param {object} settings
 * @returns {Promise<Blob>}
 */
export async function synthesizeElevenLabsSpeech(text, settings = {}) {
  const apiKey = settings.elevenlabsKey?.trim();
  if (!apiKey) throw new Error('ElevenLabs API Key is missing. Please configure it in Settings.');

  const voiceId = settings.elevenlabsVoiceId?.trim() || '21m00Tcm4TlvDq8ikWAM';
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`ElevenLabs error (${res.status}): ${errData.detail?.message || res.statusText}`);
  }

  const blob = await res.blob();
  if (!blob || blob.size === 0) throw new Error('ElevenLabs returned an empty audio stream');
  return blob;
}

/**
 * Synthesizes speech using OpenAI-compatible custom endpoint (e.g. Kokoro-82M on DeepInfra / Localhost).
 * @param {string} text
 * @param {object} settings
 * @returns {Promise<Blob>}
 */
export async function synthesizeCustomSpeech(text, settings = {}) {
  let url = (settings.customUrl?.trim() || 'https://api.deepinfra.com/v1/openai').replace(/\/+$/, '');
  const apiKey = settings.customKey?.trim();
  const model = settings.customModel?.trim() || 'hexgrad/Kokoro-82M';

  let endpoint = url;
  let bodyPayload;

  // Detect Hugging Face Inference API / Dedicated Endpoint vs OpenAI-compatible audio endpoint
  if (url.includes('api-inference.huggingface.co') || url.includes('endpoints.huggingface.cloud')) {
    endpoint = url;
    bodyPayload = { inputs: text };
  } else {
    endpoint = url.endsWith('/audio/speech') ? url : `${url}/audio/speech`;
    bodyPayload = {
      model: model,
      input: text,
      voice: 'af_heart'
    };
  }

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyPayload)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Custom AI TTS error (${res.status}): ${errText || res.statusText}`);
  }

  const blob = await res.blob();
  if (!blob || blob.size === 0) throw new Error('Custom AI TTS returned an empty audio stream');
  return blob;
}
