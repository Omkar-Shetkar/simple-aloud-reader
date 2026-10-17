import { describe, it, expect } from 'vitest';
import { segmentParagraphsIntoSentences } from '../../src/content/segmenter.js';

describe('Sentence & Paragraph Segmenter', () => {
  it('splits paragraph text into distinct sentence objects with correct offsets', () => {
    const rawParagraphs = [
      'Welcome to Simple Aloud Reader. It delivers high fidelity narration. Enjoy listening!',
      'Second paragraph begins here. Another sentence follows.'
    ];

    const segmented = segmentParagraphsIntoSentences(rawParagraphs);

    expect(segmented.length).toBe(2);
    // Paragraph 1
    expect(segmented[0].sentences.length).toBe(3);
    expect(segmented[0].sentences[0].text).toBe('Welcome to Simple Aloud Reader.');
    expect(segmented[0].sentences[0].globalIndex).toBe(0);
    expect(segmented[0].sentences[1].text).toBe('It delivers high fidelity narration.');
    expect(segmented[0].sentences[1].globalIndex).toBe(1);
    expect(segmented[0].sentences[2].text).toBe('Enjoy listening!');
    expect(segmented[0].sentences[2].globalIndex).toBe(2);

    // Paragraph 2
    expect(segmented[1].sentences.length).toBe(2);
    expect(segmented[1].sentences[0].text).toBe('Second paragraph begins here.');
    expect(segmented[1].sentences[0].globalIndex).toBe(3);
    expect(segmented[1].sentences[1].text).toBe('Another sentence follows.');
    expect(segmented[1].sentences[1].globalIndex).toBe(4);
  });

  it('handles abbreviations, titles, and edge punctuation without incorrect splits', () => {
    const rawParagraphs = [
      'Dr. Watson visited the U.K. last Friday at 4 p.m. He met with Mr. Smith.'
    ];

    const segmented = segmentParagraphsIntoSentences(rawParagraphs);
    expect(segmented[0].sentences.length).toBe(2);
    expect(segmented[0].sentences[0].text).toContain('Dr. Watson');
    expect(segmented[0].sentences[1].text).toContain('He met with Mr. Smith.');
  });
});
