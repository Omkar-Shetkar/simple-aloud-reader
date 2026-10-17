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
 * Known novelty or robotic voices that should never be selected for natural article reading.
 */
const ROBOTIC_VOICE_NAMES = [
  'albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos',
  'deranged', 'good news', 'hysterical', 'jester', 'junior', 'kathy',
  'organ', 'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox',
  'fred', 'ralph', 'grandma', 'grandpa'
];

/**
 * Natural voice rankings per dialect and gender for macOS, Windows, Android, and Linux.
 */
const PREFERRED_VOICE_NAMES = {
  'en-US-female': ['samantha', 'ava', 'allison', 'susan', 'zoe', 'victoria', 'flo', 'shelley', 'sandy', 'jenny', 'zira', 'female'],
  'en-US-male': ['alex', 'tom', 'evan', 'nathan', 'reed', 'eddy', 'rocko', 'guy', 'david', 'mark', 'male'],
  'en-GB-female': ['serena', 'kate', 'stephanie', 'fiona', 'sonia', 'hazel', 'libby', 'flo', 'shelley', 'female'],
  'en-GB-male': ['daniel', 'oliver', 'george', 'ryan', 'eddy', 'reed', 'rocko', 'male'],
  'en-IN-female': ['veena', 'neerja', 'tara', 'kavya', 'ananya', 'heera', 'female'],
  'en-IN-male': ['rishi', 'aman', 'prabhat', 'ravi', 'kunal', 'male']
};

/**
 * Selects the highest quality, most natural SpeechSynthesisVoice matching the desired dialect and gender.
 * Strictly excludes robotic/novelty voices.
 * @param {typeof CURATED_VOICES[0]} profile
 * @param {SpeechSynthesisVoice[]} localVoices
 * @returns {SpeechSynthesisVoice | null}
 */
export function matchLocalFallbackVoice(profile, localVoices = []) {
  if (!localVoices || localVoices.length === 0) return null;

  const targetLang = (profile.dialect || 'en-US').toLowerCase().replace('_', '-');
  const targetBaseLang = targetLang.split('-')[0];
  const preferredList = PREFERRED_VOICE_NAMES[profile.id] || [];

  // Filter out joke / robotic voices
  const naturalPool = localVoices.filter((v) => {
    const name = (v.name || '').toLowerCase();
    return !ROBOTIC_VOICE_NAMES.some((bad) => name.includes(bad));
  });

  const pool = naturalPool.length > 0 ? naturalPool : localVoices;

  let bestVoice = null;
  let bestScore = -Infinity;

  for (const voice of pool) {
    const vLang = (voice.lang || '').toLowerCase().replace('_', '-');
    const vName = (voice.name || '').toLowerCase();
    let score = 0;

    // Language matching
    if (vLang === targetLang) {
      score += 50;
    } else if (vLang.startsWith(targetBaseLang)) {
      score += 20;
    } else {
      score -= 50;
    }

    // High quality descriptors
    if (vName.includes('enhanced')) score += 40;
    if (vName.includes('natural')) score += 30;
    if (vName.includes('premium')) score += 30;
    if (vName.includes('neural')) score += 30;

    // Preferred natural voice names by rank
    for (let i = 0; i < preferredList.length; i++) {
      if (vName.includes(preferredList[i])) {
        score += (50 - i * 3);
        break;
      }
    }

    if (voice.localService) score += 5;

    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice || pool[0] || localVoices[0];
}
