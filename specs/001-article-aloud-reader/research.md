# Research & Technical Decisions: Simple Aloud Reader

**Feature**: Simple Aloud Reader for Online Articles  
**Branch**: `001-article-aloud-reader`  
**Date**: 2026-10-17  

---

## 1. Extension Platform & Manifest Architecture

### Decision
Use **WebExtensions Manifest V3** with compatibility for both **Desktop Firefox** (109+) and **Firefox for Android** (110+).

### Rationale
- Firefox fully supports Manifest V3 for desktop and Android while maintaining support for persistent or event-driven background scripts via the `background.scripts` key.
- Manifest V3 is the modern WebExtension standard supported by Mozilla Add-ons (AMO), offering improved security and lifecycle management.
- Firefox for Android natively supports standard content scripts, `browser.storage.local`, and audio playback from background or active tab contexts.

### Alternatives Considered
- *Manifest V2*: Functional in Firefox today, but deprecated for new submissions and future-proofing.
- *Native Mobile App*: Violates requirement for a Firefox add-on.

---

## 2. Natural Voice Sourcing & Streaming Protocol

### Decision
Implement a **hybrid speech architecture**:
1. **Primary (Online Natural Voices)**: Connect to high-definition neural voice streaming over secure WebSockets using Edge/Azure zero-auth neural endpoints.
2. **Fallback (Offline System Voices)**: Seamlessly fall back to the native browser `window.speechSynthesis` Web Speech API if network connection drops or is unavailable.

### Curated Voice Profiles (6 Total)
| Dialect | Timbre | Primary Neural Voice | Fallback Match Pattern |
|---|---|---|---|
| **English (US)** | Feminine | `en-US-JennyNeural` | `en-US`, female/natural |
| **English (US)** | Masculine | `en-US-GuyNeural` | `en-US`, male |
| **English (UK)** | Feminine | `en-GB-SoniaNeural` | `en-GB`, female |
| **English (UK)** | Masculine | `en-GB-RyanNeural` | `en-GB`, male |
| **English (India)** | Feminine | `en-IN-NeerjaNeural` | `en-IN`, female |
| **English (India)** | Masculine | `en-IN-PrabhatNeural` | `en-IN`, male |

### Rationale
- Provides true human-like natural voice synthesis without forcing users to register for API keys or pay subscription fees.
- Zero server retention: Raw audio chunks are streamed over TLS/WSS directly into browser audio elements or decoded via Web Audio API, leaving zero logs or user records.
- Guaranteed graceful degradation on airplanes, trains, or weak mobile networks.

### Alternatives Considered
- *Browser Web Speech API only*: Fails the "only natural voices" requirement on Linux and Android, where synthesis frequently defaults to robotic legacy eSpeak voices.
- *Self-hosted cloud TTS server*: Adds operational costs, latency, server maintenance, and privacy liabilities.
- *Local WASM neural models (e.g., Piper/Sherpa)*: Model weights range from 30MB to 100MB+, creating an unacceptable download size for a lightweight browser add-on.

---

## 3. Article Content Extraction

### Decision
Bundle **Mozilla Readability** (`@mozilla/readability`), the standalone library that powers Firefox's native Reader View.

### Rationale
- Industry-gold standard for stripping navigation, sidebars, ads, cookie notices, and footers while preserving article prose hierarchy.
- Zero network dependencies; executes synchronously inside the content script in <50ms.
- Provides fallback to user-selected text (`window.getSelection()`) when highlighted text is detected.

### Alternatives Considered
- *Custom regex / heuristics parser*: Highly brittle across diverse news layouts and modern CMS templates.
- *External extraction API (e.g., Mercury parser API)*: Leaks visited URLs to external services, violating zero-retention privacy.

---

## 4. UI Architecture & CSS Isolation

### Decision
Inject the floating in-page audio bar into a **Shadow DOM** container (`#simple-aloud-player-root` with closed shadow root).

### Rationale
- Completely encapsulates CSS styles: target webpage styles (Tailwind, Bootstrap, dark mode overrides) cannot bleed in or disrupt the player UI.
- Prevents player styles from affecting the host webpage.
- Allows touch-optimized draggable docking at the bottom of the viewport for mobile Firefox, with compact desktop controls.

### Alternatives Considered
- *Standard DOM injection with CSS reset*: Fragile against aggressive `!important` global page rules.
- *Iframe overlay*: Adds overhead, heavier memory footprint, and creates cross-origin communication friction.

---

## 5. Synchronized Visual Highlighting & Paragraph Navigation

### Decision
Sentence/paragraph boundary segmentation via regex/Intl.Segmenter, pairing speech audio progress markers with lightweight non-destructive DOM span highlighting.

### Rationale
- Allows precise seeking: Clicking any paragraph dispatches an event to the audio coordinator to jump speech to the corresponding sentence offset.
- Clean tear-down: When player is dismissed, all injected spans/markers are stripped cleanly in a single DOM pass.

### Alternatives Considered
- *CSS Custom Highlight API*: Elegant, but variable support across mobile browsers and complex for multi-element DOM node ranges.

---

## 6. Background Audio & Screen-Off Playback

### Decision
Manage audio playback in the extension **background script** (or dedicated background audio manager tab/offscreen context) using standard HTML5 Audio and MediaSession API.

### Rationale
- The `MediaSession` API (`navigator.mediaSession`) integrates natively with OS lock screens, mobile notification drawers, and Bluetooth headset controls (Play, Pause, Skip).
- Background script execution ensures audio continues playing without interruption when users switch tabs or lock their phone screens on Firefox for Android.

### Alternatives Considered
- *Content script audio playback only*: Suspended immediately by Android Firefox when the tab loses focus or the screen turns off.
