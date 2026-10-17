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

  it('persists AI voice provider settings and API configurations', async () => {
    const updated = await updateStoredSettings({
      provider: 'azure',
      azureKey: 'test-azure-key-12345',
      azureRegion: 'westus',
      openaiKey: 'sk-test-key-67890',
      openaiVoice: 'shimmer',
      customUrl: 'http://localhost:8880/v1/audio/speech',
      customModel: 'hexgrad/Kokoro-82M'
    });

    expect(updated.provider).toBe('azure');
    expect(updated.azureKey).toBe('test-azure-key-12345');
    expect(updated.azureRegion).toBe('westus');
    expect(updated.openaiKey).toBe('sk-test-key-67890');
    expect(updated.openaiVoice).toBe('shimmer');
    expect(updated.customUrl).toBe('http://localhost:8880/v1/audio/speech');

    const reloaded = await getStoredSettings();
    expect(reloaded.provider).toBe('azure');
    expect(reloaded.azureKey).toBe('test-azure-key-12345');
    expect(reloaded.azureRegion).toBe('westus');
    expect(reloaded.openaiKey).toBe('sk-test-key-67890');
    expect(reloaded.openaiVoice).toBe('shimmer');
    expect(reloaded.customUrl).toBe('http://localhost:8880/v1/audio/speech');
    // Ensure default settings are still intact
    expect(reloaded.speedRate).toBe(1.0);
  });
});
