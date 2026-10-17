# Contract: Article Extractor Interface

**Context**: Defines the interface for extracting clean, readable prose from a webpage DOM using Mozilla Readability with fallback to user selection.

---

## 1. Interface Definition

```typescript
export interface IArticleExtractor {
  /**
   * Evaluates the current page DOM and extracts article content.
   * If user has text selected on the page, prioritizes the selection.
   */
  extract(document: Document, options?: ExtractionOptions): ExtractionResult;
}

export interface ExtractionOptions {
  forceFullPage?: boolean;         // Ignore text selection and parse whole page
  minParagraphLength?: number;     // Minimum character threshold (default: 20)
}

export interface ExtractionResult {
  success: boolean;
  isSelection: boolean;            // True if result is from manual user highlight
  article?: Article;               // Structured article entity
  errorMessage?: string;           // E.g. "No readable article content found"
}
```

---

## 2. Processing Pipeline

```text
[Page DOM / Selection]
         │
         ▼
[Check window.getSelection()] ──(Selection > 20 chars)──► [Wrap Selection into Single Article]
         │ (No selection)
         ▼
[Clone Document DOM]
         │
         ▼
[Run Mozilla Readability] ────(Extraction score < threshold)──► [Return Failure Result]
         │ (Valid article)
         ▼
[Segment into Paragraphs & Sentences via Intl.Segmenter]
         │
         ▼
[Inject Non-Destructive Data Attributes / Span Anchors]
         │
         ▼
[Return Structured Article]
```
