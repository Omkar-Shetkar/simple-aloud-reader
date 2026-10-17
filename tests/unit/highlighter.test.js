import { describe, it, expect, beforeEach } from 'vitest';
import { SentenceHighlighter } from '../../src/content/highlighter.js';

describe('SentenceHighlighter (US3)', () => {
  let doc;
  let article;

  beforeEach(() => {
    doc = document.implementation.createHTMLDocument('Test Article');
    doc.body.innerHTML = `
      <article id="art">
        <p id="p0">First sentence in para zero. Second sentence here.</p>
        <p id="p1">First sentence in para one. Another final sentence.</p>
      </article>
    `;

    article = {
      paragraphs: [
        {
          index: 0,
          text: 'First sentence in para zero. Second sentence here.',
          sentences: [
            { index: 0, globalIndex: 0, text: 'First sentence in para zero.' },
            { index: 1, globalIndex: 1, text: 'Second sentence here.' }
          ]
        },
        {
          index: 1,
          text: 'First sentence in para one. Another final sentence.',
          sentences: [
            { index: 0, globalIndex: 2, text: 'First sentence in para one.' },
            { index: 1, globalIndex: 3, text: 'Another final sentence.' }
          ]
        }
      ]
    };
  });

  it('injects sentence highlight spans and updates the active highlight', () => {
    const highlighter = new SentenceHighlighter(doc);
    highlighter.attachToArticle(article);

    // Initial highlight on global sentence 0
    highlighter.highlightSentence(0, 0);

    const activeSpans = doc.querySelectorAll('.simple-aloud-highlight-active');
    expect(activeSpans.length).toBe(1);
    expect(activeSpans[0].textContent).toContain('First sentence in para zero.');

    // Shift highlight to global sentence 1
    highlighter.highlightSentence(0, 1);
    const updatedSpans = doc.querySelectorAll('.simple-aloud-highlight-active');
    expect(updatedSpans.length).toBe(1);
    expect(updatedSpans[0].textContent).toContain('Second sentence here.');
  });

  it('removes all injected highlight elements non-destructively on clear()', () => {
    const highlighter = new SentenceHighlighter(doc);
    highlighter.attachToArticle(article);

    expect(doc.querySelectorAll('.simple-aloud-sentence').length).toBeGreaterThan(0);

    highlighter.clear();

    expect(doc.querySelectorAll('.simple-aloud-sentence').length).toBe(0);
    expect(doc.querySelectorAll('.simple-aloud-highlight-active').length).toBe(0);
    // Original paragraph text remains identical
    expect(doc.getElementById('p0').textContent).toContain('First sentence in para zero. Second sentence here.');
  });
});
