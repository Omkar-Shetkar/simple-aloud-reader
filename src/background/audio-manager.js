/**
 * Audio Manager & Playback Coordinator.
 * Manages sentence queues, MediaSession integration for background/screen-off playback,
 * and state synchronization across content script and popup.
 */

import { PLAYBACK_STATUS, MESSAGE_TYPES } from '../common/constants.js';
import { TtsFactory } from './tts/tts-factory.js';
import { sendMessageToTab } from '../common/messages.js';

export class AudioManager {
  constructor(options = {}) {
    this.ttsFactory = new TtsFactory();
    this.activeArticle = null;
    this.targetTabId = null;
    this.currentParagraphIndex = 0;
    this.currentSentenceIndex = 0;
    this.status = PLAYBACK_STATUS.IDLE;
    this.speedRate = 1.0;
    this.voiceId = 'en-US-female';
    this.isInitialized = false;
    this.playbackToken = 0; // Incremented on stop/seek to invalidate pending async speak callbacks
    this.onSentenceChange = options.onSentenceChange || null;
    this.onStateChange = options.onStateChange || null;
  }

  async initialize() {
    if (this.isInitialized) return;
    await this.ttsFactory.initialize();
    this.setupMediaSession();
    this.isInitialized = true;
  }

  setupMediaSession() {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => this.resume());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.skipForward());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.skipBackward());
      navigator.mediaSession.setActionHandler('stop', () => this.stop());
    } catch (e) {
      console.warn('[SimpleAloud] MediaSession action handlers not fully supported:', e);
    }
  }

  updateMediaSessionMetadata() {
    if (typeof navigator === 'undefined' || !navigator.mediaSession || !this.activeArticle) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.activeArticle.title || 'Online Article',
        artist: this.activeArticle.byline || 'Simple Aloud Reader',
        album: 'Aloud Reading'
      });
    } catch (e) {}
  }

  /**
   * Loads a new article and begins playback.
   */
  async loadArticleAndPlay(tabId, article, settings = {}) {
    await this.initialize();
    this.stop();

    this.targetTabId = tabId;
    this.activeArticle = article;
    this.currentParagraphIndex = 0;
    this.currentSentenceIndex = 0;
    this.speedRate = settings.speedRate || this.speedRate;
    this.voiceId = settings.voiceId || this.voiceId;
    this.ttsFactory.setRate(this.speedRate);
    this.ttsFactory.setVoice(this.voiceId);

    this.updateMediaSessionMetadata();
    this.playCurrentSentence();
  }

  /**
   * Collects all sentences in article into a flat indexed list.
   */
  getAllSentences() {
    if (!this.activeArticle || !this.activeArticle.paragraphs) return [];
    const list = [];
    for (const p of this.activeArticle.paragraphs) {
      if (p.sentences) {
        for (const s of p.sentences) {
          list.push({ ...s, paragraphIndex: p.index });
        }
      }
    }
    return list;
  }

  async playCurrentSentence() {
    const allSentences = this.getAllSentences();
    if (this.currentSentenceIndex >= allSentences.length) {
      this.status = PLAYBACK_STATUS.STOPPED;
      this.broadcastState();
      return;
    }

    const currentItem = allSentences[this.currentSentenceIndex];
    this.currentParagraphIndex = currentItem.paragraphIndex;
    this.status = PLAYBACK_STATUS.PLAYING;
    this.broadcastState();

    if (this.onSentenceChange) {
      this.onSentenceChange(currentItem.paragraphIndex, currentItem.index, currentItem.globalIndex);
    }

    // Broadcast position update to content script for visual highlighting
    if (this.targetTabId) {
      sendMessageToTab(this.targetTabId, MESSAGE_TYPES.SENTENCE_PROGRESS, {
        paragraphIndex: currentItem.paragraphIndex,
        sentenceIndex: currentItem.index,
        globalIndex: currentItem.globalIndex
      }).catch(() => {});
    }

    const token = ++this.playbackToken;

    try {
      await this.ttsFactory.speak(currentItem.text, {
        voiceId: this.voiceId,
        rate: this.speedRate,
        onEnd: () => {
          if (token !== this.playbackToken) return;
          if (this.status === PLAYBACK_STATUS.PLAYING) {
            this.currentSentenceIndex++;
            this.playCurrentSentence();
          }
        },
        onError: (err) => {
          if (token !== this.playbackToken) return;
          console.error('[SimpleAloud] Speech error:', err);
        }
      });
    } catch (err) {
      if (token !== this.playbackToken) return;
      console.warn('[SimpleAloud] Sentence playback failed:', err);
    }
  }

  pause() {
    this.status = PLAYBACK_STATUS.PAUSED;
    this.ttsFactory.pause();
    this.broadcastState();
  }

  resume() {
    if (this.status === PLAYBACK_STATUS.PAUSED) {
      this.status = PLAYBACK_STATUS.PLAYING;
      this.ttsFactory.resume();
      this.broadcastState();
    } else if (this.status === PLAYBACK_STATUS.STOPPED || this.status === PLAYBACK_STATUS.IDLE) {
      this.playCurrentSentence();
    }
  }

  stop() {
    this.playbackToken++;
    this.status = PLAYBACK_STATUS.STOPPED;
    this.ttsFactory.stop();
    this.broadcastState();
  }

  seekToParagraph(paragraphIndex) {
    const allSentences = this.getAllSentences();
    const target = allSentences.find((s) => s.paragraphIndex === paragraphIndex);
    if (target) {
      this.currentSentenceIndex = target.globalIndex;
      this.currentParagraphIndex = paragraphIndex;
      this.ttsFactory.stop();
      this.playCurrentSentence();
    }
  }

  skipForward() {
    const allSentences = this.getAllSentences();
    if (this.currentSentenceIndex + 1 < allSentences.length) {
      this.currentSentenceIndex++;
      this.ttsFactory.stop();
      this.playCurrentSentence();
    }
  }

  skipBackward() {
    if (this.currentSentenceIndex > 0) {
      this.currentSentenceIndex--;
      this.ttsFactory.stop();
      this.playCurrentSentence();
    }
  }

  setSpeed(rate) {
    this.speedRate = rate;
    this.ttsFactory.setRate(rate);
    this.broadcastState();
    import('../common/storage.js').then(({ updateStoredSettings }) => {
      updateStoredSettings({ speedRate: rate }).catch(() => {});
    });
  }

  setVoice(voiceId) {
    this.voiceId = voiceId;
    this.ttsFactory.setVoice(voiceId);
    this.broadcastState();
    import('../common/storage.js').then(({ updateStoredSettings }) => {
      updateStoredSettings({ voiceId }).catch(() => {});
    });
    if (this.status === PLAYBACK_STATUS.PLAYING) {
      this.ttsFactory.stop();
      this.playCurrentSentence();
    }
  }

  getState() {
    return {
      status: this.status,
      currentParagraphIndex: this.currentParagraphIndex,
      currentSentenceIndex: this.currentSentenceIndex,
      speedRate: this.speedRate,
      voiceId: this.voiceId,
      articleTitle: this.activeArticle?.title || null
    };
  }

  broadcastState() {
    const state = this.getState();
    if (this.onStateChange) {
      this.onStateChange(state);
    }
    if (this.targetTabId) {
      sendMessageToTab(this.targetTabId, MESSAGE_TYPES.STATE_CHANGED, state).catch(() => {});
    }
  }
}
