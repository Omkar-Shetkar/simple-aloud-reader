import { Readability } from '@mozilla/readability';

/**
 * Hash helper for generating unique article IDs.
 * @param {string} str
 * @returns {string}
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Extracts paragraphs from parsed HTML content.
 * @param {string} htmlContent
 * @returns {string[]}
 */
function extractParagraphsFromHTML(htmlContent) {
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(htmlContent, 'text/html');

  // Query block elements that represent body prose
  const blockElements = parsedDoc.querySelectorAll('p, li, blockquote');
  const paragraphs = [];

  for (const el of blockElements) {
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length >= 15) {
      paragraphs.push(text);
    }
  }

  // Fallback: If no paragraph elements found, query headers or split text by newlines
  if (paragraphs.length === 0 && parsedDoc.body) {
    const rawText = parsedDoc.body.textContent || '';
    const lines = rawText.split(/\n\s*\n/).map((l) => l.replace(/\s+/g, ' ').trim());
    for (const line of lines) {
      if (line.length >= 15) {
        paragraphs.push(line);
      }
    }
  }

  return paragraphs;
}

/**
 * Extracts readable article content from the document DOM.
 * @param {Document} doc - Document to extract from
 * @param {object} [options]
 * @param {string} [options.selectedText] - Explicitly highlighted text
 * @returns {{ success: boolean, isSelection?: boolean, article?: any, errorMessage?: string }}
 */
export function extractArticleContent(doc, options = {}) {
  // 1. Check for manual user selection
  const userSelection = options.selectedText !== undefined
    ? options.selectedText
    : (typeof window !== 'undefined' && window.getSelection ? window.getSelection().toString().trim() : '');

  if (userSelection && userSelection.length >= 10) {
    const articleId = 'sel_' + hashString(userSelection);
    return {
      success: true,
      isSelection: true,
      article: {
        id: articleId,
        url: doc.location ? doc.location.href : '',
        title: 'Selected Text',
        byline: null,
        excerpt: userSelection.substring(0, 120),
        paragraphs: [{ index: 0, text: userSelection, sentences: [] }],
        totalWords: userSelection.split(/\s+/).filter(Boolean).length,
        totalSentences: 1,
        extractedAt: Date.now()
      }
    };
  }

  // 2. Clone document for Readability (Readability mutates the provided DOM)
  const docClone = doc.cloneNode(true);
  const docH1 = doc.querySelector('h1')?.textContent?.trim();

  let parsed = null;
  try {
    const reader = new Readability(docClone, {
      charThreshold: 60,
      keepClasses: false
    });
    parsed = reader.parse();
  } catch (err) {
    console.warn('[SimpleAloud] Readability parse failed:', err);
  }

  if (!parsed || !parsed.content || (!parsed.textContent && parsed.content.length < 50)) {
    return {
      success: false,
      errorMessage: 'No readable article content found on this page.'
    };
  }

  const rawParagraphs = extractParagraphsFromHTML(parsed.content);
  if (rawParagraphs.length === 0) {
    return {
      success: false,
      errorMessage: 'Unable to extract article text paragraphs.'
    };
  }

  const resolvedTitle = docH1 || parsed.title || doc.title || 'Untitled Article';

  // Filter out any paragraph that is an exact duplicate of the headline
  const bodyParagraphs = rawParagraphs.filter((p) => p.trim() !== resolvedTitle.trim());
  const finalParagraphs = bodyParagraphs.length > 0 ? bodyParagraphs : rawParagraphs;

  const structuredParagraphs = finalParagraphs.map((text, index) => ({
    index,
    text,
    sentences: []
  }));

  const fullText = finalParagraphs.join(' ');
  const totalWords = fullText.split(/\s+/).filter(Boolean).length;
  const articleId = 'art_' + hashString((doc.location ? doc.location.href : '') + resolvedTitle);

  return {
    success: true,
    isSelection: false,
    article: {
      id: articleId,
      url: doc.location ? doc.location.href : '',
      title: resolvedTitle,
      byline: parsed.byline || null,
      excerpt: parsed.excerpt || finalParagraphs[0].substring(0, 150),
      paragraphs: structuredParagraphs,
      totalWords,
      totalSentences: 0,
      extractedAt: Date.now()
    }
  };
}
