# Contract: WebExtension Messaging Protocol

**Context**: Defines message passing between `background.js` (orchestration, audio streaming, MediaSession), `content-script.js` (DOM parsing, player injection, visual highlight), and `popup.js` (toolbar interface).

---

## 1. Message Structure

All messages conform to the following envelope:

```typescript
interface ExtensionMessage<T = any> {
  type: string;                    // Action identifier (e.g., 'READER_START')
  payload?: T;                     // Action-specific payload
  sender?: 'background' | 'content' | 'popup';
}
```

---

## 2. Actions & Payloads

### 2.1 Content Script to Background

#### `READER_START`
Sent when user triggers reading on a page (via toolbar or shortcut).
- **Payload**:
  ```json
  {
    "url": "https://example.com/article",
    "selectedTextOnly": false
  }
  ```
- **Response**:
  ```json
  {
    "status": "extracting" | "error",
    "sessionId": "uuid-v4"
  }
  ```

#### `ARTICLE_PARSED`
Content script sends parsed article data to background for audio queueing.
- **Payload**:
  ```json
  {
    "article": {
      "id": "sha256-hash",
      "title": "Article Title",
      "paragraphs": [...]
    }
  }
  ```

#### `PARAGRAPH_CLICKED`
User tapped a paragraph to jump playback.
- **Payload**:
  ```json
  {
    "paragraphIndex": 4
  }
  ```

#### `PLAYER_COMMAND`
User interacted with the floating audio bar.
- **Payload**:
  ```json
  {
    "action": "play" | "pause" | "skip_forward" | "skip_backward" | "stop" | "set_speed" | "set_voice",
    "value": 1.25 // optional: e.g. speed rate or voiceId
  }
  ```

---

### 2.2 Background to Content Script

#### `STATE_CHANGED`
Broadcasted when playback state changes (buffering, playing, paused, stopped).
- **Payload**:
  ```json
  {
    "status": "playing",
    "currentParagraphIndex": 2,
    "currentSentenceIndex": 8,
    "speedRate": 1.0,
    "voiceId": "en-US-female",
    "isOffline": false
  }
  ```

#### `SENTENCE_PROGRESS`
High-frequency position update for visual highlighting.
- **Payload**:
  ```json
  {
    "paragraphIndex": 2,
    "sentenceIndex": 3,
    "charOffset": 45
  }
  ```

#### `SHOW_NOTIFICATION`
Instructs content script to display a toast notification inside the shadow root.
- **Payload**:
  ```json
  {
    "type": "info" | "warning" | "error",
    "message": "No article detected on this page."
  }
  ```
