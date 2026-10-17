/**
 * Non-destructive DOM Sentence Highlighter & Auto-Scroller for Simple Aloud Reader.
 */

export class SentenceHighlighter {
  constructor(doc = document) {
    this.doc = doc;
    this.attachedSpans = [];
    this.currentActiveSpan = null;
    this.originalNodes = new Map();
    this.autoScroll = true;
  }

  /**
   * Scans DOM for matching paragraph elements and wraps sentences in identifiable spans.
   * @param {any} article
   */
  attachToArticle(article) {
    this.clear();
    if (!article || !article.paragraphs) return;

    const allPElements = Array.from(this.doc.querySelectorAll('p, li, blockquote'));

    for (const pItem of article.paragraphs) {
      if (!pItem.sentences || pItem.sentences.length === 0) continue;

      // Find matching DOM element by text similarity
      const targetEl = allPElements.find((el) => {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        return text.length > 20 && (text.includes(pItem.sentences[0].text) || pItem.text.includes(text));
      });

      if (!targetEl) continue;

      // Save original child nodes for clean restoration without innerHTML
      const clonedChildren = Array.from(targetEl.childNodes).map((node) => node.cloneNode(true));
      this.originalNodes.set(targetEl, clonedChildren);

      // Rebuild with safe DOM methods
      targetEl.replaceChildren();

      for (let i = 0; i < pItem.sentences.length; i++) {
        const s = pItem.sentences[i];
        const span = this.doc.createElement('span');
        span.className = 'simple-aloud-sentence';
        span.setAttribute('data-p-index', String(pItem.index));
        span.setAttribute('data-s-index', String(s.index));
        span.setAttribute('data-g-index', String(s.globalIndex));
        span.textContent = s.text;

        targetEl.appendChild(span);
        this.attachedSpans.push(span);

        if (i < pItem.sentences.length - 1) {
          targetEl.appendChild(this.doc.createTextNode(' '));
        }
      }
    }

    this.injectStyles();
  }

  injectStyles() {
    if (this.doc.getElementById('simple-aloud-highlighter-styles')) return;

    const style = this.doc.createElement('style');
    style.id = 'simple-aloud-highlighter-styles';
    style.textContent = `
      .simple-aloud-sentence {
        transition: background-color 0.2s ease, border-radius 0.2s ease;
      }
      .simple-aloud-highlight-active {
        background-color: #fef08a !important;
        color: #0f172a !important;
        border-radius: 4px !important;
        box-shadow: 0 0 0 2px rgba(254, 240, 138, 0.6);
      }
    `;
    this.doc.head.appendChild(style);
  }

  /**
   * Highlights the target sentence and scrolls into view if autoScroll is enabled.
   * @param {number} pIndex
   * @param {number} sIndex
   */
  highlightSentence(pIndex, sIndex) {
    if (this.currentActiveSpan) {
      this.currentActiveSpan.classList.remove('simple-aloud-highlight-active');
      this.currentActiveSpan = null;
    }

    const targetSpan = this.attachedSpans.find(
      (span) =>
        parseInt(span.getAttribute('data-p-index'), 10) === pIndex &&
        parseInt(span.getAttribute('data-s-index'), 10) === sIndex
    );

    if (targetSpan) {
      targetSpan.classList.add('simple-aloud-highlight-active');
      this.currentActiveSpan = targetSpan;

      if (this.autoScroll && typeof targetSpan.scrollIntoView === 'function') {
        targetSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * Completely restores original DOM structure and removes all injected spans and styles.
   */
  clear() {
    if (this.currentActiveSpan) {
      this.currentActiveSpan.classList.remove('simple-aloud-highlight-active');
      this.currentActiveSpan = null;
    }

    for (const [el, originalChildren] of this.originalNodes.entries()) {
      if (el && el.isConnected) {
        el.replaceChildren(...originalChildren);
      }
    }

    this.originalNodes.clear();
    this.attachedSpans = [];

    const styleEl = this.doc.getElementById('simple-aloud-highlighter-styles');
    if (styleEl) {
      styleEl.remove();
    }
  }
}
