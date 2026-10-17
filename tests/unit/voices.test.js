import { describe, it, expect } from 'vitest';
import {
  CURATED_VOICES,
  getCuratedVoices,
  getVoiceById,
  matchLocalFallbackVoice
} from '../../src/background/tts/voices.js';

describe('Voices Catalog & Matching (US2)', () => {
  it('contains exactly 6 curated natural voices across UK, US, and India', () => {
    const voices = getCuratedVoices();
    expect(voices.length).toBe(6);

    const usVoices = voices.filter((v) => v.dialect === 'en-US');
    const ukVoices = voices.filter((v) => v.dialect === 'en-GB');
    const inVoices = voices.filter((v) => v.dialect === 'en-IN');

    expect(usVoices.length).toBe(2);
    expect(ukVoices.length).toBe(2);
    expect(inVoices.length).toBe(2);

    expect(usVoices.some((v) => v.gender === 'female')).toBe(true);
    expect(usVoices.some((v) => v.gender === 'male')).toBe(true);
    expect(ukVoices.some((v) => v.gender === 'female')).toBe(true);
    expect(ukVoices.some((v) => v.gender === 'male')).toBe(true);
    expect(inVoices.some((v) => v.gender === 'female')).toBe(true);
    expect(inVoices.some((v) => v.gender === 'male')).toBe(true);
  });

  it('retrieves voice by ID or falls back to default', () => {
    const voice = getVoiceById('en-IN-female');
    expect(voice.id).toBe('en-IN-female');
    expect(voice.displayName).toContain('India - Neerja');

    const fallback = getVoiceById('non-existent-voice');
    expect(fallback.id).toBe('en-US-female');
  });

  it('matches local device voices based on dialect and gender', () => {
    const mockLocalVoices = [
      { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US' },
      { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US' },
      { name: 'Google UK English Female', lang: 'en-GB' },
      { name: 'Google UK English Male', lang: 'en-GB' },
      { name: 'Google हिन्दी', lang: 'hi-IN' },
      { name: 'English India Female', lang: 'en-IN' }
    ];

    const ukFemale = getVoiceById('en-GB-female');
    const matchedUkFemale = matchLocalFallbackVoice(ukFemale, mockLocalVoices);
    expect(matchedUkFemale).toBeDefined();
    expect(matchedUkFemale.lang).toBe('en-GB');
    expect(matchedUkFemale.name).toContain('Female');

    const inFemale = getVoiceById('en-IN-female');
    const matchedInFemale = matchLocalFallbackVoice(inFemale, mockLocalVoices);
    expect(matchedInFemale).toBeDefined();
    expect(matchedInFemale.lang).toBe('en-IN');
  });
});
