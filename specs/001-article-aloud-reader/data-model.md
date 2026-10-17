# Data Model: Simple Aloud Reader

**Feature**: Simple Aloud Reader for Online Articles  
**Branch**: `001-article-aloud-reader`  
**Date**: 2026-10-17  

---

## 1. Entities & Schemas

### 1.1 Article
Represents the extracted prose of an online web article.

```typescript
interface Article {
  id: string;                      // SHA-256 hash of URL + title
  url: string;                     // Canonical URL of target page
  title: string;                   // Extracted article headline
  byline: string | null;           // Author / publication date
  excerpt: string;                 // Short summary snippet (first ~150 chars)
  paragraphs: ParagraphItem[];     // Ordered array of prose paragraphs
  totalWords: number;              // Total word count for duration estimates
  totalSentences: number;          // Total count of segmented sentences
  extractedAt: number;             // Timestamp (epoch ms)
}

interface ParagraphItem {
  index: number;                   // 0-based index within article
  text: string;                    // Normalized text content of paragraph
  sentences: SentenceItem[];       // Individual sentence segments
  elementId?: string;              // DOM tracking identifier for visual sync
}

interface SentenceItem {
  index: number;                   // Index within paragraph
  globalIndex: number;             // Continuous index across entire article
  text: string;                    // Sentence text for utterance chunking
  charOffset: number;              // Offset within paragraph text
}
```

**Validation Rules**:
- `title` must be non-empty (fallback to document title if byline is missing).
- `paragraphs` must contain at least 1 item with > 10 characters for valid article classification.
- Code blocks, scripts, and navigation links are stripped prior to paragraph generation.

---

### 1.2 VoiceProfile
Represents an authentic regional English voice option in the curated catalog.

```typescript
interface VoiceProfile {
  id: string;                      // e.g., 'en-US-Jenny', 'en-GB-Ryan'
  displayName: string;             // User-facing label: "US - Sarah", "India - Neerja"
  dialect: 'en-US' | 'en-GB' | 'en-IN';
  regionLabel: 'United States' | 'United Kingdom' | 'India';
  gender: 'female' | 'male';
  serviceVoiceName: string;        // Upstream neural voice ID (e.g. 'en-US-JennyNeural')
  deliveryTier: 'neural' | 'local';// 'neural' (cloud stream) or 'local' (device fallback)
  isAvailable: boolean;            // Runtime availability flag
}
```

**Curated 6-Voice Catalog Definition**:
1. `en-US-female`: "US - Sarah" (`en-US-JennyNeural`)
2. `en-US-male`: "US - Guy" (`en-US-GuyNeural`)
3. `en-GB-female`: "UK - Sonia" (`en-GB-SoniaNeural`)
4. `en-GB-male`: "UK - Ryan" (`en-GB-RyanNeural`)
5. `en-IN-female`: "India - Neerja" (`en-IN-NeerjaNeural`)
6. `en-IN-male`: "India - Prabhat" (`en-IN-PrabhatNeural`)

---

### 1.3 PlaybackSession
Tracks runtime state of narration on the active page.

```typescript
interface PlaybackSession {
  sessionId: string;               // Unique session UUID
  tabId: number;                   // ID of target browser tab
  articleId: string;               // Reference to current Article
  status: PlaybackStatus;          // Current state enum
  currentParagraphIndex: number;   // Active paragraph pointer
  currentSentenceIndex: number;    // Active sentence pointer (global index)
  speedRate: number;               // Current rate: 0.75, 1.0, 1.25, 1.5, 2.0
  activeVoiceId: string;           // Currently selected VoiceProfile ID
  isOfflineFallback: boolean;      // True if operating on device speech API
  error?: string | null;           // Current error message if in 'error' state
}

type PlaybackStatus = 
  | 'idle'        // No active article loaded
  | 'extracting'  // Parsing DOM
  | 'buffering'   // Fetching/streaming initial audio chunk
  | 'playing'     // Audio actively playing
  | 'paused'      // Playback paused at specific word/sentence
  | 'stopped'     // Dismissed or finished
  | 'error';      // Encountered recoverable or fatal issue
```

**State Transition Diagram**:
```text
  [idle]
     │ (trigger reader)
     ▼
  [extracting] ──── (extraction failed) ────► [error]
     │ (success)
     ▼
  [buffering] ◄────── (seek / change voice) ───┐
     │ (audio ready)                            │
     ▼                                          │
  [playing]   ◄──►   [paused]                   │
     │                   │                      │
     ├───────────────────┴──────────────────────┘
     ▼ (stop / finished)
  [stopped] ──► [idle]
```

---

### 1.4 UserSettings
Persistent settings stored in `browser.storage.local`.

```typescript
interface UserSettings {
  voiceId: string;                 // Default: 'en-US-female'
  speedRate: number;               // Default: 1.0 (range: 0.75 - 2.0)
  autoScroll: boolean;             // Default: true (scrolls highlight into view)
  highlightColor: string;          // Default: '#fef08a' (soft yellow)
  sessionBuffering: boolean;       // Default: true (ephemeral memory buffering)
}
```

**Storage Defaults**:
```json
{
  "voiceId": "en-US-female",
  "speedRate": 1.0,
  "autoScroll": true,
  "highlightColor": "#fef08a",
  "sessionBuffering": true
}
```
