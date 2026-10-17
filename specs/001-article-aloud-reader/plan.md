# Implementation Plan: Simple Aloud Reader for Online Articles

**Branch**: `001-article-aloud-reader` | **Date**: 2026-10-17 | **Spec**: [spec.md](file:///Users/omkar/projects/simple-aloud-reader/specs/001-article-aloud-reader/spec.md)  
**Input**: Feature specification from `/specs/001-article-aloud-reader/spec.md`

---

## Summary

Build a high-performance, privacy-first Firefox add-on (supporting Desktop Firefox and Firefox for Android) that reads online articles aloud in natural human voice. The extension extracts article text cleanly using Mozilla Readability, streams high-definition neural voices for UK, US, and Indian English via zero-retention WebSockets with automatic local device speech fallback when offline, displays a touch-friendly floating audio bar inside a Shadow DOM container, and provides synchronized visual text highlighting with paragraph seek navigation.

---

## Technical Context

**Language/Version**: JavaScript (ES2022+) / HTML5 / CSS3  
**Primary Dependencies**: `@mozilla/readability` (for DOM article extraction)  
**Storage**: `browser.storage.local` (for user preferences: voice selection, reading speed, highlight settings)  
**Testing**: Vitest / Node Test Runner + JSDOM / `web-ext lint`  
**Target Platform**: Desktop Firefox (109+) and Firefox for Android (110+) via WebExtensions Manifest V3  
**Project Type**: Browser Extension (Firefox Add-on)  
**Performance Goals**: <2s time-to-first-audio from trigger; <300ms visual highlight sync lag; <150ms UI response time  
**Constraints**: Zero server-side logging/retention of article text or user audio; offline graceful degradation; Shadow DOM CSS isolation; background playback on mobile screen-off  
**Scale/Scope**: Client-side extension; 6 curated natural voices (2 per dialect: UK, US, India); HTML web articles only in v1  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Analysis / Compliance Notes |
|---|---|---|
| **I. Library-First & Modularity** | **PASS** | Extractor (`extractor.js`), TTS Engine (`tts/`), and Highlighter (`highlighter.js`) are decoupled, self-contained ES modules independently testable with JSDOM. |
| **II. Clean Interface Contracts** | **PASS** | Strict interfaces defined in `contracts/` for messaging, TTS streaming, and DOM article extraction. |
| **III. Test-First (TDD)** | **PASS** | Unit tests for extraction scoring, sentence chunking, voice profile filtering, and playback state machine defined before implementation. |
| **IV. Integration Testing** | **PASS** | `web-ext lint` and mock browser runtime test suites validate extension manifest and message passing. |
| **V. Simplicity & YAGNI** | **PASS** | Vanilla JS without bloated frontend framework overhead; bundles zero unnecessary libraries; relies directly on standard WebExtensions and Web Audio APIs. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-article-aloud-reader/
├── spec.md              # Feature specification & clarified requirements
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0: Technical research & architectural decisions
├── data-model.md        # Phase 1: Entity schemas, voice catalog & state machine
├── quickstart.md        # Phase 1: Developer quickstart & manual test guide
├── contracts/           # Phase 1: Interface contracts
│   ├── extension-messaging.md
│   ├── tts-engine.md
│   └── article-extractor.md
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
simple-aloud-reader/
├── manifest.json                # WebExtensions Manifest V3 for Firefox Desktop & Android
├── package.json                 # Project dependencies (@mozilla/readability, dev tools)
├── icons/                       # Extension action icons (16, 32, 48, 96, 128)
│   ├── icon-48.png
│   └── icon-96.png
├── src/
│   ├── background/
│   │   ├── background.js        # Service entry point: tab coordinator & audio session
│   │   ├── audio-manager.js     # Audio playback pipeline & MediaSession integration
│   │   └── tts/
│   │       ├── tts-factory.js   # Dispatches to neural stream or local fallback
│   │       ├── neural-stream.js # High-definition neural WebSocket streaming client
│   │       ├── local-speech.js  # window.speechSynthesis fallback engine
│   │       └── voices.js        # Curated 6-voice catalog (UK, US, India)
│   ├── content/
│   │   ├── content-script.js    # Content script entry: orchestrates extraction & player
│   │   ├── extractor.js         # Mozilla Readability wrapper & selection extractor
│   │   ├── segmenter.js         # Sentence & paragraph chunker (Intl.Segmenter)
│   │   ├── highlighter.js       # Non-destructive DOM span marker & auto-scroller
│   │   └── ui/
│   │       ├── player-bar.js    # Floating bottom audio bar component (Shadow DOM)
│   │       └── player-bar.css   # Isolated styles for floating audio bar
│   ├── popup/
│   │   ├── popup.html           # Desktop toolbar action popup
│   │   ├── popup.js             # Trigger reading, open options, quick voice switch
│   │   └── popup.css            # Premium dark/light styled popup interface
│   └── common/
│       ├── constants.js         # Storage keys, default settings, event types
│       ├── messages.js          # Typed message helpers
│       └── storage.js           # browser.storage.local promise wrapper
└── tests/
    ├── unit/
    │   ├── extractor.test.js    # DOM extraction accuracy tests on sample articles
    │   ├── segmenter.test.js    # Sentence boundary and offset tracking tests
    │   ├── voices.test.js       # Voice catalog validation & fallback mapping
    │   └── storage.test.js      # Preference persistence tests
    └── contract/
        ├── messaging.test.js    # Message schema & payload contract tests
        └── tts-engine.test.js   # ITtsEngine interface compliance tests
```

**Structure Decision**: Standard WebExtensions modular layout separating background coordination (audio lifecycle + MediaSession), content scripts (DOM extraction + Shadow DOM UI + visual highlighting), and lightweight popup, with shared common utilities and comprehensive test coverage.

---

## Complexity Tracking

> No architectural constitution violations detected. Standard WebExtension architecture with zero-framework footprint, strictly adhering to browser APIs and client-side processing.
