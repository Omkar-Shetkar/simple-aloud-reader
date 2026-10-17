/**
 * Local Web Speech API Fallback Engine.
 * Operates offline using the host device's local speech synthesis.
 */

import { matchLocalFallbackVoice } from './voices.js';

export class LocalSpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.availableVoices = [];
    this.currentRate = 1.0;
    this.isPlaying = false;
    this.isPaused = false;
  }

  /**
   * Initializes local voices
   */
  async initialize() {
    if (!this.synth) return [];

    return new Promise((resolve) => {
      const loadVoices = () => {
        const voices = this.synth.getVoices();
        if (voices.length > 0) {
          this.availableVoices = voices;
          resolve(voices);
        }
      };

      loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => loadVoices();
      }
      setTimeout(() => resolve(this.synth.getVoices()), 500);
    });
  }

  /**
   * Speaks a chunk using local SpeechSynthesisUtterance.
   * @param {string} text
   * @param {object} options
   */
  async speak(text, options = {}) {
    this.stop();

    if (!this.synth) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.rate = options.rate || this.currentRate;

    if (options.profile) {
      const match = matchLocalFallbackVoice(options.profile, this.availableVoices);
      if (match) {
        utterance.voice = match;
        utterance.lang = match.lang;
      }
    }

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        this.isPlaying = false;
        this.isPaused = false;
        if (options.onError) options.onError(e);
        reject(e);
      };

      this.isPlaying = true;
      this.isPaused = false;
      this.synth.speak(utterance);
    });
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPlaying = false;
      this.isPaused = true;
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPlaying = true;
      this.isPaused = false;
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
  }

  setRate(rate) {
    this.currentRate = rate;
  }
}
