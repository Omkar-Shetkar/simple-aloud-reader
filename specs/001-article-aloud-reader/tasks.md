# Tasks: Simple Aloud Reader for Online Articles

**Input**: Design documents from `/specs/001-article-aloud-reader/`  
**Prerequisites**: [plan.md](file:///Users/omkar/projects/simple-aloud-reader/specs/001-article-aloud-reader/plan.md), [spec.md](file:///Users/omkar/projects/simple-aloud-reader/specs/001-article-aloud-reader/spec.md), [research.md](file:///Users/omkar/projects/simple-aloud-reader/specs/001-article-aloud-reader/research.md), [data-model.md](file:///Users/omkar/projects/simple-aloud-reader/specs/001-article-aloud-reader/data-model.md), [contracts/](file:///Users/omkar/projects/simple-aloud-reader/specs/001-article-aloud-reader/contracts/)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, manifest configuration, and build/test tooling.

- [x] T001 Create project package.json with @mozilla/readability and vitest dependencies in package.json
- [x] T002 [P] Create WebExtensions Manifest V3 configuration for Firefox Desktop and Android in manifest.json
- [x] T003 [P] Create extension action icons (16, 32, 48, 96, 128) in icons/
- [x] T004 [P] Configure Vitest test runner with JSDOM environment in vitest.config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core communication bus, storage layer, and voice catalog required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this foundational phase is complete.

- [x] T005 Create shared constants, storage keys, and default settings in src/common/constants.js
- [x] T006 [P] Implement browser.storage.local wrapper with default preferences in src/common/storage.js
- [x] T007 [P] Implement typed message helpers and event bus envelope in src/common/messages.js
- [x] T008 [P] Implement curated 6-voice catalog definitions and locale mappings in src/background/tts/voices.js
- [x] T009 Implement background service coordinator skeleton in src/background/background.js
- [x] T010 Implement content script listener and message dispatcher skeleton in src/content/content-script.js

**Checkpoint**: Foundation ready - User Story 1 implementation can now begin.

---

## Phase 3: User Story 1 - One-Click Article Narration in Natural Voice (Priority: P1) 🎯 MVP

**Goal**: Deliver core MVP functionality where clicking the aloud reader extracts the main article text and begins streaming natural voice playback immediately, omitting ads, sidebars, and comments.

**Independent Test**: Navigate to any standard news article or blog post, trigger the aloud reader, and verify that narration begins within 2 seconds using the default natural voice (`en-US-JennyNeural`), skipping navigation links and ads.

### Tests for User Story 1 ⚠️
- [x] T011 [P] [US1] Unit test for Mozilla Readability article extraction in tests/unit/extractor.test.js
- [x] T012 [P] [US1] Unit test for sentence segmentation and boundary parsing in tests/unit/segmenter.test.js
- [x] T013 [P] [US1] Contract test for TTS engine interface in tests/contract/tts-engine.test.js

### Implementation for User Story 1
- [x] T014 [US1] Implement DOM article extraction using @mozilla/readability in src/content/extractor.js
- [x] T015 [US1] Implement sentence and paragraph chunking using Intl.Segmenter in src/content/segmenter.js
- [x] T016 [US1] Implement high-definition neural WebSocket streaming client in src/background/tts/neural-stream.js
- [x] T017 [US1] Implement local window.speechSynthesis fallback engine in src/background/tts/local-speech.js
- [x] T018 [US1] Implement TTS engine factory with automatic offline fallback in src/background/tts/tts-factory.js
- [x] T019 [US1] Implement audio manager and MediaSession background playback in src/background/audio-manager.js
- [x] T020 [US1] Implement toolbar popup trigger and quick-play interface in src/popup/popup.html and src/popup/popup.js
- [x] T021 [US1] Integrate extraction, background audio streaming, and playback lifecycle in src/background/background.js

**Checkpoint**: User Story 1 MVP is fully functional and testable independently.

---

## Phase 4: User Story 2 - Regional English Voice & Speed Customization (Priority: P2)

**Goal**: Enable users to switch between curated natural English voices for the UK, US, and India (1 feminine and 1 masculine each) and adjust speech tempo between 0.75x and 2.0x with persistent preferences.

**Independent Test**: Open the voice picker, switch dialects among UK, US, and India, adjust the speed slider, and verify voice timbre switches instantly, playback tempo scales smoothly without pitch distortion, and choices persist across sessions.

### Tests for User Story 2 ⚠️
- [x] T022 [P] [US2] Unit test for voice profile switching and pitch-preserved speed adjustment in tests/unit/voices.test.js
- [x] T023 [P] [US2] Unit test for user preference persistence in tests/unit/storage.test.js

### Implementation for User Story 2
- [x] T024 [US2] Implement voice selector component with curated 6-voice catalog in src/content/ui/voice-selector.js
- [x] T025 [US2] Implement speed control slider and rate change handler in src/content/ui/speed-controller.js
- [x] T026 [US2] Connect voice and speed changes to TTS stream and persist in storage in src/background/audio-manager.js
- [x] T027 [US2] Add voice and speed preference controls to desktop toolbar popup in src/popup/popup.html and src/popup/popup.js

**Checkpoint**: User Stories 1 AND 2 are fully integrated and independently testable.

---

## Phase 5: User Story 3 - Visual Highlighting & Intuitive Playback Navigation (Priority: P3)

**Goal**: Display a floating in-page audio bar inside a Shadow DOM container, provide real-time visual sentence highlighting with auto-scrolling, allow tap-to-seek paragraph jumping, and support reading manually selected text snippets.

**Independent Test**: Start playback on an article, verify current sentence is highlighted and scrolled into view, click any paragraph to jump speech directly there, and verify selecting text reads only the excerpt.

### Tests for User Story 3 ⚠️
- [x] T028 [P] [US3] Unit test for DOM highlight injection and non-destructive cleanup in tests/unit/highlighter.test.js
- [x] T029 [P] [US3] Contract test for extension message exchange in tests/contract/messaging.test.js

### Implementation for User Story 3
- [x] T030 [US3] Implement non-destructive sentence span highlighting and auto-scroll in src/content/highlighter.js
- [x] T031 [US3] Implement Shadow DOM container and floating bottom audio bar in src/content/ui/player-bar.js
- [x] T032 [US3] Implement isolated CSS styles for floating bottom audio bar in src/content/ui/player-bar.css
- [x] T033 [US3] Implement paragraph click-to-seek event delegation in src/content/content-script.js
- [x] T034 [US3] Support manual text selection fallback in src/content/extractor.js and src/content/content-script.js

**Checkpoint**: All three user stories are now complete, integrated, and verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-platform verification (Desktop & Mobile Firefox), mobile touch ergonomics, security validation, and linting.

- [x] T035 [P] Implement mobile touch-friendly controls and responsive layout in src/content/ui/player-bar.css
- [x] T036 [P] Implement dark and light mode theme adaptation for popup in src/popup/popup.css
- [x] T037 Validate extension manifest and security rules using web-ext lint
- [x] T038 Validate zero-retention TLS encrypted requests and audio stream teardown
- [x] T039 Execute end-to-end verification checklist per quickstart.md on Desktop and Android Firefox

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories.
- **User Story 1 (Phase 3 - P1)**: Depends on Phase 2. Core MVP milestone.
- **User Story 2 (Phase 4 - P2)**: Depends on Phase 2. Integrates with US1 audio manager.
- **User Story 3 (Phase 5 - P3)**: Depends on Phase 2. Integrates with US1 extractor and player.
- **Polish (Phase 6)**: Depends on all user stories being implemented.

### Parallel Opportunities
- **Within Setup (Phase 1)**: T002 (manifest), T003 (icons), and T004 (vitest config) can run in parallel after T001.
- **Within Foundational (Phase 2)**: T006 (storage), T007 (messages), and T008 (voices) can run in parallel.
- **Within User Story 1 (Phase 3)**: T011, T012, and T013 test suites can run in parallel; T016 (neural stream) and T017 (local speech) can be developed in parallel.
- **Within User Story 2 (Phase 4)**: T022 and T023 tests can run in parallel; T024 (voice selector) and T025 (speed slider) can be developed in parallel.
- **Within User Story 3 (Phase 5)**: T028 and T029 tests can run in parallel; T031 (player bar JS) and T032 (player bar CSS) can be developed in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch test suite creation for User Story 1 in parallel:
Task: "Unit test for Mozilla Readability article extraction in tests/unit/extractor.test.js"
Task: "Unit test for sentence segmentation and boundary parsing in tests/unit/segmenter.test.js"
Task: "Contract test for TTS engine interface in tests/contract/tts-engine.test.js"

# Launch speech engine implementations in parallel:
Task: "Implement high-definition neural WebSocket streaming client in src/background/tts/neural-stream.js"
Task: "Implement local window.speechSynthesis fallback engine in src/background/tts/local-speech.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete **Phase 1: Setup** (T001 - T004)
2. Complete **Phase 2: Foundational** (T005 - T010)
3. Complete **Phase 3: User Story 1** (T011 - T021)
4. **STOP and VALIDATE**: Test User Story 1 independently on Desktop Firefox via `npx web-ext run`.
5. Deliver viable MVP!

### Incremental Delivery
1. Foundation + US1 (MVP): Read articles aloud in default natural voice.
2. Add US2: Unlock UK, US, India voice picker and speed adjustment (0.75x–2.0x).
3. Add US3: Floating bottom player bar, synchronized text highlighting, and paragraph tap-to-seek.
4. Phase 6 Polish: Touch optimization for Firefox for Android, `web-ext lint` pass, and zero-retention verification.
