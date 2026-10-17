import { describe, it, expect, vi } from 'vitest';
import { TtsFactory } from '../../src/background/tts/tts-factory.js';
import { CURATED_VOICES } from '../../src/background/tts/voices.js';

describe('TTS Engine Contract', () => {
  it('provides the curated 6-voice catalog', async () => {
    const factory = new TtsFactory();
    await factory.initialize();

    const voices = factory.getAvailableVoices();
    expect(voices.length).toBe(6);
    expect(voices.map((v) => v.dialect)).toContain('en-US');
    expect(voices.map((v) => v.dialect)).toContain('en-GB');
    expect(voices.map((v) => v.dialect)).toContain('en-IN');
  });

  it('implements speak, pause, resume, stop, and setRate lifecycle methods', async () => {
    const factory = new TtsFactory();
    await factory.initialize();

    expect(typeof factory.speak).toBe('function');
    expect(typeof factory.pause).toBe('function');
    expect(typeof factory.resume).toBe('function');
    expect(typeof factory.stop).toBe('function');
    expect(typeof factory.setRate).toBe('function');

    factory.setRate(1.25);
    expect(factory.currentRate).toBe(1.25);
  });
});
