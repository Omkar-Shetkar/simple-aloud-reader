import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredSettings, updateStoredSettings } from '../../src/common/storage.js';
import { DEFAULT_SETTINGS } from '../../src/common/constants.js';

describe('Storage & Preference Persistence (US2)', () => {
  beforeEach(() => {
    globalThis._mockStorage = {};
  });

  it('returns default settings when storage is empty', async () => {
    const settings = await getStoredSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
    expect(settings.voiceId).toBe('en-US-female');
    expect(settings.speedRate).toBe(1.0);
  });

  it('updates and persists partial settings without overwriting unchanged fields', async () => {
    const updated = await updateStoredSettings({
      voiceId: 'en-IN-male',
      speedRate: 1.5
    });

    expect(updated.voiceId).toBe('en-IN-male');
    expect(updated.speedRate).toBe(1.5);
    expect(updated.autoScroll).toBe(true);

    const reloaded = await getStoredSettings();
    expect(reloaded.voiceId).toBe('en-IN-male');
    expect(reloaded.speedRate).toBe(1.5);
    expect(reloaded.autoScroll).toBe(true);
  });
});
