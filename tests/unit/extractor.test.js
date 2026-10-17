import { describe, it, expect, beforeEach } from 'vitest';
import { extractArticleContent } from '../../src/content/extractor.js';

describe('Article Extractor', () => {
  let doc;

  beforeEach(() => {
    doc = document.implementation.createHTMLDocument('Sample News Article');
  });

  it('extracts headline, byline, and paragraphs from valid article markup', () => {
    doc.body.innerHTML = `
      <header><nav><a href="/">Home</a></nav></header>
      <div class="sidebar ad">Buy our product now!</div>
      <article>
        <h1>Revolution in AI Assisted Reading</h1>
        <p class="byline">By Jane Doe | Published October 2026</p>
        <p>Artificial intelligence is transforming how people consume long-form articles online. Natural voices make listening feel conversational and effortless.</p>
        <p>Listeners can choose regional dialects and absorb journalism on their daily commute without looking at screens.</p>
      </article>
      <footer><p>Copyright 2026 News Corp</p></footer>
    `;

    const result = extractArticleContent(doc);

    expect(result.success).toBe(true);
    expect(result.article).toBeDefined();
    expect(result.article.title).toContain('Revolution in AI Assisted Reading');
    expect(result.article.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(result.article.paragraphs[0].text).toContain('Artificial intelligence is transforming');
    expect(result.article.paragraphs[1].text).toContain('Listeners can choose regional dialects');
  });

  it('fails gracefully on empty pages or pages with no article content', () => {
    doc.body.innerHTML = `
      <header><nav>Logo</nav></header>
      <div class="gallery"><img src="thumb.jpg" alt="pic" /></div>
    `;

    const result = extractArticleContent(doc);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toBeDefined();
  });

  it('prioritizes user text selection when present', () => {
    doc.body.innerHTML = `
      <article>
        <h1>Ignored Whole Article Title</h1>
        <p id="p1">First sentence in article.</p>
      </article>
    `;

    const customSelection = 'This is explicitly selected text excerpt from the reader.';
    const result = extractArticleContent(doc, { selectedText: customSelection });

    expect(result.success).toBe(true);
    expect(result.isSelection).toBe(true);
    expect(result.article.paragraphs.length).toBe(1);
    expect(result.article.paragraphs[0].text).toBe(customSelection);
  });
});
