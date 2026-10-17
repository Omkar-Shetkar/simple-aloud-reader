/**
 * Curated 6-Voice Catalog for Simple Aloud Reader.
 * Exclusively provides authentic natural English voices for UK, US, and India.
 */

export const CURATED_VOICES = [
  {
    id: 'en-US-female',
    displayName: 'US - Sarah',
    dialect: 'en-US',
    regionLabel: 'United States',
    gender: 'female',
    serviceVoiceName: 'en-US-JennyNeural',
    deliveryTier: 'neural',
    isAvailable: true
  },
  {
    id: 'en-US-male',
    displayName: 'US - Guy',
    dialect: 'en-US',
    regionLabel: 'United States',
    gender: 'male',
    serviceVoiceName: 'en-US-GuyNeural',
    deliveryTier: 'neural',
    isAvailable: true
  },
  {
    id: 'en-GB-female',
    displayName: 'UK - Sonia',
    dialect: 'en-GB',
    regionLabel: 'United Kingdom',
    gender: 'female',
    serviceVoiceName: 'en-GB-SoniaNeural',
    deliveryTier: 'neural',
    isAvailable: true
  },
  {
    id: 'en-GB-male',
    displayName: 'UK - Ryan',
    dialect: 'en-GB',
    regionLabel: 'United Kingdom',
    gender: 'male',
    serviceVoiceName: 'en-GB-RyanNeural',
    deliveryTier: 'neural',
    isAvailable: true
  },
  {
    id: 'en-IN-female',
    displayName: 'India - Neerja',
    dialect: 'en-IN',
    regionLabel: 'India',
    gender: 'female',
    serviceVoiceName: 'en-IN-NeerjaNeural',
    deliveryTier: 'neural',
    isAvailable: true
  },
  {
    id: 'en-IN-male',
    displayName: 'India - Prabhat',
    dialect: 'en-IN',
    regionLabel: 'India',
    gender: 'male',
    serviceVoiceName: 'en-IN-PrabhatNeural',
    deliveryTier: 'neural',
    isAvailable: true
  }
];

/**
 * Returns a list of all curated voice profiles.
 * @returns {typeof CURATED_VOICES}
 */
export function getCuratedVoices() {
  return CURATED_VOICES.map((v) => ({ ...v }));
}

/**
 * Retrieves a voice profile by its ID, falling back to default en-US-female.
 * @param {string} voiceId
 * @returns {typeof CURATED_VOICES[0]}
 */
export function getVoiceById(voiceId) {
  const found = CURATED_VOICES.find((v) => v.id === voiceId);
  return found ? { ...found } : { ...CURATED_VOICES[0] };
}

/**
 * Selects the best local SpeechSynthesisVoice matching the desired dialect and gender.
 * @param {typeof CURATED_VOICES[0]} profile
 * @param {SpeechSynthesisVoice[]} localVoices
 * @returns {SpeechSynthesisVoice | null}
 */
export function matchLocalFallbackVoice(profile, localVoices = []) {
  if (!localVoices || localVoices.length === 0) return null;

  const targetLang = profile.dialect.toLowerCase().replace('_', '-');
  const targetGender = profile.gender.toLowerCase();

  // 1. Exact language match + gender in voice name
  const exactLangAndGender = localVoices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();
    return lang === targetLang && name.includes(targetGender);
  });
  if (exactLangAndGender) return exactLangAndGender;

  // 2. Exact language match
  const exactLang = localVoices.find((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    return lang === targetLang;
  });
  if (exactLang) return exactLang;

  // 3. Prefix language match (e.g., 'en')
  const prefixLang = localVoices.find((v) => {
    const lang = (v.lang || '').toLowerCase();
    return lang.startsWith('en');
  });
  if (prefixLang) return prefixLang;

  // 4. Default first voice
  return localVoices[0];
}
