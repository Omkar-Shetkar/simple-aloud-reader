/**
 * Hybrid TTS Factory.
 * Manages high-definition neural streaming by default with automatic local speech fallback when offline.
 */

import { CURATED_VOICES, getVoiceById } from './voices.js';
import { NeuralStreamEngine } from './neural-stream.js';
import { LocalSpeechEngine } from './local-speech.js';

export class TtsFactory {
  constructor() {
    this.neuralEngine = new NeuralStreamEngine();
    this.localEngine = new LocalSpeechEngine();
    this.currentRate = 1.0;
    this.currentVoiceId = 'en-US-female';
    this.isOfflineMode = false;
    this.activeEngine = null;
  }

  /**
   * Initializes both engines and preloads local voice lists.
   */
  async initialize() {
    await Promise.all([
      this.neuralEngine.initialize().catch(() => {}),
      this.localEngine.initialize().catch(() => {})
    ]);
    this.activeEngine = this.neuralEngine;
  }

  /**
   * Returns curated 6-voice profiles with runtime availability state.
   */
  getAvailableVoices() {
    return CURATED_VOICES.map((v) => ({
      ...v,
      isAvailable: true
    }));
  }

  /**
   * Speaks the text chunk using neural streaming, falling back to local synthesis on error.
   * @param {string} text
   * @param {object} options
   */
  async speak(text, options = {}) {
    const voiceId = options.voiceId || this.currentVoiceId;
    const profile = getVoiceById(voiceId);
    const rate = options.rate || this.currentRate;

    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

    if (!isOffline && !this.isOfflineMode) {
      try {
        this.activeEngine = this.neuralEngine;
        await this.neuralEngine.speak(text, {
          serviceVoiceName: profile.serviceVoiceName,
          dialect: profile.dialect,
          profile,
          rate,
          onEnd: options.onEnd,
          onError: options.onError
        });
        return;
      } catch (err) {
        console.warn('[SimpleAloud] Neural TTS stream failed, falling back to local speech:', err);
        this.isOfflineMode = true;
      }
    }

    // Local device fallback
    this.activeEngine = this.localEngine;
    await this.localEngine.speak(text, {
      profile,
      rate,
      onEnd: options.onEnd,
      onError: options.onError
    });
  }

  pause() {
    if (this.activeEngine) {
      this.activeEngine.pause();
    }
  }

  resume() {
    if (this.activeEngine) {
      this.activeEngine.resume();
    }
  }

  stop() {
    if (this.neuralEngine) this.neuralEngine.stop();
    if (this.localEngine) this.localEngine.stop();
  }

  setRate(rate) {
    this.currentRate = rate;
    this.neuralEngine.setRate(rate);
    this.localEngine.setRate(rate);
  }

  setVoice(voiceId) {
    this.currentVoiceId = voiceId;
  }
}
