/**
 * Shared constants, event action types, and defaults for Simple Aloud Reader.
 */

export const STORAGE_KEYS = {
  SETTINGS: 'simple_aloud_settings'
};

export const DEFAULT_SETTINGS = {
  voiceId: 'en-US-female',
  speedRate: 1.0,
  autoScroll: true,
  highlightColor: '#fef08a',
  sessionBuffering: true
};

export const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

export const MESSAGE_TYPES = {
  READER_START: 'READER_START',
  ARTICLE_PARSED: 'ARTICLE_PARSED',
  PARAGRAPH_CLICKED: 'PARAGRAPH_CLICKED',
  PLAYER_COMMAND: 'PLAYER_COMMAND',
  STATE_CHANGED: 'STATE_CHANGED',
  SENTENCE_PROGRESS: 'SENTENCE_PROGRESS',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  GET_STATE: 'GET_STATE',
  GET_SETTINGS: 'GET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
};

export const PLAYER_ACTIONS = {
  PLAY: 'play',
  PAUSE: 'pause',
  RESUME: 'resume',
  STOP: 'stop',
  SKIP_FORWARD: 'skip_forward',
  SKIP_BACKWARD: 'skip_backward',
  SET_SPEED: 'set_speed',
  SET_VOICE: 'set_voice'
};

export const PLAYBACK_STATUS = {
  IDLE: 'idle',
  EXTRACTING: 'extracting',
  BUFFERING: 'buffering',
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  ERROR: 'error'
};
