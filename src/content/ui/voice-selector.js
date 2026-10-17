import { CURATED_VOICES } from '../../background/tts/voices.js';

/**
 * Creates the Voice Selector dropdown DOM element.
 * @param {string} activeVoiceId
 * @param {(voiceId: string) => void} onVoiceChange
 * @returns {HTMLSelectElement}
 */
export function createVoiceSelector(activeVoiceId = 'en-US-female', onVoiceChange = () => {}) {
  const select = document.createElement('select');
  select.className = 'aloud-voice-select';
  select.title = 'Select Voice & Dialect';

  const regions = [
    { label: 'United States', dialect: 'en-US' },
    { label: 'United Kingdom', dialect: 'en-GB' },
    { label: 'India', dialect: 'en-IN' }
  ];

  for (const reg of regions) {
    const group = document.createElement('optgroup');
    group.label = reg.label;

    const voices = CURATED_VOICES.filter((v) => v.dialect === reg.dialect);
    for (const v of voices) {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.displayName} (${v.gender})`;
      if (v.id === activeVoiceId) {
        opt.selected = true;
      }
      group.appendChild(opt);
    }
    select.appendChild(group);
  }

  select.addEventListener('change', (e) => {
    onVoiceChange(e.target.value);
  });

  return select;
}
