/**
 * Local Web Speech API Fallback Engine.
 * Operates offline using the host device's local speech synthesis.
 */

import { matchLocalFallbackVoice } from './voices.js';

export class LocalSpeechEngine {
  constructor() {
    this.synth = (typeof window !== 'undefined' && window.speechSynthesis)
      || (typeof globalThis !== 'undefined' && globalThis.speechSynthesis)
      || (typeof self !== 'undefined' && self.speechSynthesis)
      || null;
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
        try {
          const voices = this.synth.getVoices();
          if (voices && voices.length > 0) {
            this.availableVoices = voices;
            resolve(voices);
          }
        } catch (e) {
          resolve([]);
        }
      };

      loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => loadVoices();
      }
      setTimeout(() => {
        try {
          this.availableVoices = this.synth.getVoices();
          resolve(this.availableVoices);
        } catch (e) {
          resolve([]);
        }
      }, 500);
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

    // Ensure synth is not frozen in paused state
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    utterance.rate = options.rate || this.currentRate;

    if (options.profile) {
      if (!this.availableVoices || this.availableVoices.length === 0) {
        try {
          this.availableVoices = this.synth.getVoices();
        } catch (e) {}
      }
      const match = matchLocalFallbackVoice(options.profile, this.availableVoices);
      if (match) {
        utterance.voice = match;
        utterance.lang = match.lang;
      } else if (options.profile.locale) {
        utterance.lang = options.profile.locale;
      }
    }

    return new Promise((resolve, reject) => {
      let isDone = false;

      const finish = () => {
        if (isDone) return;
        isDone = true;
        this.isPlaying = false;
        this.isPaused = false;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onend = finish;

      utterance.onerror = (e) => {
        console.warn('[SimpleAloud] SpeechSynthesis error:', e);
        finish();
      };

      this.isPlaying = true;
      this.isPaused = false;
      try {
        this.synth.speak(utterance);
      } catch (e) {
        finish();
      }
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
