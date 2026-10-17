import { describe, it, expect } from 'vitest';
import { createMessage } from '../../src/common/messages.js';
import { MESSAGE_TYPES, PLAYER_ACTIONS } from '../../src/common/constants.js';

describe('Messaging Contract (US3)', () => {
  it('creates valid message envelopes with timestamp and type', () => {
    const msg = createMessage(MESSAGE_TYPES.READER_START, { url: 'https://example.com' }, 'content');

    expect(msg.type).toBe(MESSAGE_TYPES.READER_START);
    expect(msg.payload.url).toBe('https://example.com');
    expect(msg.sender).toBe('content');
    expect(typeof msg.timestamp).toBe('number');
  });

  it('supports all defined player action types in PLAYER_COMMAND payload', () => {
    const validActions = [
      PLAYER_ACTIONS.PLAY,
      PLAYER_ACTIONS.PAUSE,
      PLAYER_ACTIONS.RESUME,
      PLAYER_ACTIONS.STOP,
      PLAYER_ACTIONS.SKIP_FORWARD,
      PLAYER_ACTIONS.SKIP_BACKWARD,
      PLAYER_ACTIONS.SET_SPEED,
      PLAYER_ACTIONS.SET_VOICE
    ];

    for (const action of validActions) {
      const msg = createMessage(MESSAGE_TYPES.PLAYER_COMMAND, { action });
      expect(msg.payload.action).toBe(action);
    }
  });
});
