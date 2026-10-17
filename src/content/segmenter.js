/**
 * Sentence and Paragraph segmentation for Simple Aloud Reader.
 */

// Honorifics and title prefixes that never end a sentence
const HONORIFIC_PREFIXES = new Set([
  'dr', 'mr', 'mrs', 'ms', 'prof', 'sr', 'jr', 'rev', 'st'
]);

/**
 * Checks if a string ends with a word/title that should not terminate a sentence.
 * @param {string} text
 * @returns {boolean}
 */
function shouldMergeWithNext(text, nextText = '') {
  const trimmed = text.trim();

  // 1. Check honorifics: e.g. "Dr." or "Mr."
  const honorificMatch = trimmed.match(/\b([a-zA-Z]+)\.$/);
  if (honorificMatch) {
    const word = honorificMatch[1].toLowerCase();
    if (HONORIFIC_PREFIXES.has(word)) return true;
  }

  // 2. Check abbreviations with periods like "U.K." or "U.S."
  if (/\b[a-zA-Z]\.[a-zA-Z]\.$/.test(trimmed)) {
    // If next sentence starts with lowercase or continuation word, merge
    if (nextText && /^[a-z]/.test(nextText.trim())) return true;
  }

  // 3. Time / numeric abbreviations: e.g. "4 p.m."
  // If followed by lowercase, it's not a new sentence
  if (/\b(a\.m|p\.m)\.$/i.test(trimmed)) {
    if (nextText && /^[a-z]/.test(nextText.trim())) return true;
  }

  // 4. Single letter abbreviation: "J." or "K."
  if (/\b[A-Z]\.$/.test(trimmed)) return true;

  return false;
}

/**
 * Splits text into sentences using Intl.Segmenter with abbreviation merging and regex fallback.
 * @param {string} text
 * @returns {string[]}
 */
export function splitIntoSentences(text) {
  if (!text || typeof text !== 'string') return [];

  const trimmed = text.trim();
  if (!trimmed) return [];

  let rawSegments = [];

  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
      const segments = Array.from(segmenter.segment(trimmed));
      rawSegments = segments
        .map((s) => s.segment.trim())
        .filter((s) => s.length > 0);
    } catch (e) {
      rawSegments = [];
    }
  }

  if (rawSegments.length === 0) {
    rawSegments = trimmed.split(/(?<=[.?!])\s+/).filter(Boolean);
  }

  // Merge segments based on abbreviation rules
  const merged = [];
  for (let i = 0; i < rawSegments.length; i++) {
    const current = rawSegments[i];
    const next = rawSegments[i + 1] || '';

    if (merged.length > 0 && shouldMergeWithNext(merged[merged.length - 1], current)) {
      merged[merged.length - 1] += ' ' + current;
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Segments an array of raw paragraph strings or structured ParagraphItems into sentences.
 * @param {Array<string | { text: string }>} paragraphs
 * @returns {Array<{ index: number, text: string, sentences: Array<{ index: number, globalIndex: number, text: string, charOffset: number }> }>}
 */
export function segmentParagraphsIntoSentences(paragraphs) {
  let globalSentenceIndex = 0;

  return paragraphs.map((item, pIndex) => {
    const text = typeof item === 'string' ? item : item.text;
    const sentenceStrings = splitIntoSentences(text);

    let charOffset = 0;
    const sentences = sentenceStrings.map((sText, sIndex) => {
      const offset = text.indexOf(sText, charOffset);
      const actualOffset = offset !== -1 ? offset : charOffset;
      charOffset = actualOffset + sText.length;

      const sentenceObj = {
        index: sIndex,
        globalIndex: globalSentenceIndex,
        text: sText,
        charOffset: actualOffset
      };
      globalSentenceIndex++;
      return sentenceObj;
    });

    return {
      index: pIndex,
      text,
      sentences
    };
  });
}
