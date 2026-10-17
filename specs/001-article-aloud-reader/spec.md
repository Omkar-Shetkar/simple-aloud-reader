# Feature Specification: Simple Aloud Reader for Online Articles

**Feature Branch**: `001-article-aloud-reader`  
**Created**: 2026-10-17  
**Status**: Draft  
**Input**: User description: "We want to create a simple aloud reader Firefox addon for articles online. It reads the articles aloud in natural voice. We want to support only natural voices in English for UK, US, and India. App should be simple and intuitive to use. It should support both desktop and mobile Firefox."

## Clarifications

### Session 2026-10-17

- Q: How should the addon source natural voices for UK, US, and India, and handle offline playback? → A: Hybrid: stream high-definition natural neural voices by default; automatically fall back to local device voices if offline.
- Q: How should playback controls and progress be presented on desktop and mobile? → A: Floating In-Page Audio Bar: a compact, sleek bottom audio bar with Play/Pause, Skip, Speed, Voice picker, and tap-to-seek paragraph jumping.
- Q: What document formats are in scope for v1? → A: HTML web articles only; PDF documents, EPUBs, and local offline files are explicitly out of scope for v1.
- Q: How many natural voice options should be provided per regional dialect? → A: Curated Pair (6 voices total): exactly 2 natural voices per region (1 feminine, 1 masculine for UK, US, and India) with clear descriptive labels.
- Q: What privacy and audio data retention policy should be enforced for neural voice streaming? → A: Strict Zero-Retention + Local Session Buffering: text chunks are transmitted over encrypted connections solely for real-time synthesis with zero remote logging/storage; audio is held in temporary local memory only during the active session.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One-Click Article Narration in Natural Voice (Priority: P1)

As an online reader on Firefox (desktop or mobile), I want to trigger a reader button on any article page so that the main article text is extracted and narrated aloud in a fluent, natural-sounding voice without distracting ads, headers, or sidebar clutter.

**Why this priority**: This represents the foundational MVP functionality. Without reliable article extraction and natural voice playback, the extension provides no core utility.

**Independent Test**: Navigate to any standard news article or blog post, trigger the aloud reader, and verify that the narration begins immediately with human-like cadence, reading only the article content and skipping ads, navigation links, and comment sections.

**Acceptance Scenarios**:

1. **Given** a web page containing a published article on desktop Firefox, **When** the user clicks the aloud reader icon or shortcut, **Then** the main article body is extracted and narration begins within two seconds using the default natural voice.
2. **Given** a web page containing an article on Firefox for Android (mobile), **When** the user triggers the reader from the browser menu or overlay, **Then** narration starts smoothly with a mobile-optimized touch playback interface.
3. **Given** an article being read aloud, **When** the narration progresses across headings, paragraphs, and lists, **Then** the voice maintains natural pacing, pausing appropriately at punctuation marks and paragraph breaks.

---

### User Story 2 - Regional English Voice & Speed Customization (Priority: P2)

As a listener with regional accent preferences, I want to choose among natural English voices for the United Kingdom, United States, and India, and adjust playback speed so that I can listen comfortably at my preferred pace and dialect.

**Why this priority**: Users have strong preferences for familiar accents and individual listening speeds. Ensuring high-quality voices for UK, US, and India is an explicit core requirement.

**Independent Test**: Open the voice selector, switch between English (UK), English (US), and English (India), adjust the speed slider, and verify that speech timbre switches instantly and rate adjusts cleanly without audio distortion.

**Acceptance Scenarios**:

1. **Given** the playback options menu, **When** the user views the voice selection list, **Then** exactly 6 curated natural-sounding voice profiles are displayed: 1 feminine and 1 masculine voice for English (United Kingdom), English (United States), and English (India).
2. **Given** an active or paused reading session, **When** the user selects an English (India) natural voice, **Then** subsequent narration is spoken in the selected accent and timbre.
3. **Given** active narration, **When** the user adjusts the speed control between 0.75x and 2.0x, **Then** speech tempo adjusts immediately while preserving natural vocal pitch.
4. **Given** customized voice accent and speed choices, **When** the user visits another article or reopens the browser, **Then** the selected voice accent and speed settings remain preserved.

---

### User Story 3 - Visual Highlighting & Intuitive Playback Navigation (Priority: P3)

As a reader following along with the audio, I want the extension to highlight the currently spoken sentence or paragraph on the page and provide simple controls to pause, resume, or skip through sections.

**Why this priority**: Visual synchronicity significantly aids comprehension and retention. Transport controls (pause/skip) give users effortless navigation throughout long articles.

**Independent Test**: Initiate playback on a multi-paragraph article, verify that the current sentence is visually highlighted in real time, and verify that clicking Next/Previous Paragraph skips both the audio and the visual highlight accurately.

**Acceptance Scenarios**:

1. **Given** an article being read aloud, **When** each sentence or paragraph is spoken, **Then** the text in the article view is highlighted in real time and automatically scrolled into visible view if needed.
2. **Given** active speech playback, **When** the user taps Pause, **Then** narration ceases immediately at the current word; **When** the user taps Resume, narration restarts from the same point.
3. **Given** active speech playback, **When** the user clicks Skip Forward or Skip Backward, **Then** playback jumps to the next or previous sentence/paragraph and updates the visual highlight accordingly.
4. **Given** a web page where the user has manually highlighted a snippet of text, **When** the reader is activated, **Then** only the highlighted snippet is read aloud rather than the entire page.
5. **Given** an article being read aloud, **When** the user clicks or taps on any paragraph in the article, **Then** playback immediately jumps to that paragraph, resumes narration from the first word, and shifts the visual highlight accordingly.

---

### Edge Cases

- **Page lacks readable article content**: When triggered on homepages, search results, or image galleries with no clear article text, the extension displays a gentle, clear message stating that no article was detected and invites the user to select text manually.
- **Network interruption during speech**: If an online natural voice stream encounters network dropouts or is unreachable, the system automatically falls back to an available local device voice, or pauses smoothly with an alert allowing the user to resume once connection is restored.
- **Background tab and screen-off listening (Mobile)**: When the user switches to another tab or turns off the phone screen on Firefox for Android, audio narration continues uninterrupted with system media notification controls available.
- **Complex formatting (tables, code snippets, mathematical formulas)**: The reader announces table and code structures cleanly or skips decorative non-text characters without stuttering or crashing.
- **Dynamic or infinite-scroll pages**: The reader snapshots the article content at the moment of activation, preventing dynamically injected ads or subsequent infinite-scroll articles from corrupting the ongoing narration queue.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically extract primary article text (title, byline, main body paragraphs) from online web pages, excluding navigation menus, advertisements, sidebars, and user comments.
- **FR-002**: System MUST allow users to narrate manually selected text on any web page as an immediate alternative to full-page article extraction.
- **FR-003**: System MUST provide a curated catalog of exactly 6 natural-sounding English voice profiles (1 feminine and 1 masculine voice each for United Kingdom (en-GB), United States (en-US), and India (en-IN)), delivered via high-definition neural voice streaming by default with automatic graceful fallback to local device voices when offline.
- **FR-004**: System MUST filter out legacy mechanical or low-fidelity robotic voices so that users are presented only with natural-sounding vocal profiles.
- **FR-005**: System MUST provide essential transport controls: Play, Pause, Resume, Stop, Skip Forward (next sentence/paragraph), and Skip Backward (previous sentence/paragraph).
- **FR-006**: System MUST allow users to adjust speech rate (speed) from 0.75x to 2.0x in consistent increments with automatic pitch correction.
- **FR-007**: System MUST provide real-time visual highlighting that synchronizes with the spoken sentence or paragraph on the page.
- **FR-008**: System MUST deliver a responsive floating in-page audio bar docked at the bottom of the viewport on both Desktop and Mobile Firefox, displaying essential controls (Play/Pause, Skip Backward/Forward, Speed selector, Voice selector, and Dismiss) and supporting tap-to-seek paragraph jumping.
- **FR-009**: System MUST support background audio playback when the article tab is minimized or when the mobile device screen is locked.
- **FR-010**: System MUST persist user preferences (selected regional voice, default reading speed, and auto-scroll/highlight settings) across sessions.
- **FR-011**: System MUST provide polite and informative error notifications when an article cannot be extracted, audio playback is blocked, or voice services are temporarily unreachable.
- **FR-012**: System MUST enforce strict zero-retention privacy for cloud speech synthesis by transmitting text snippets over encrypted TLS connections solely for ephemeral real-time speech generation, with zero server logging or persistence, and buffering audio strictly in temporary local client memory during the active session.

### Key Entities

- **Article**: Represents the extracted content of the target web page, containing title, author/byline, ordered paragraphs, sentences, and publication source.
- **Voice Profile**: Represents a voice option from the curated 6-voice catalog (2 per dialect: 1 feminine, 1 masculine for UK, US, India), characterized by unique identifier, descriptive label (e.g., "US - Sarah", "India - Neerja"), vocal timbre/gender, delivery tier (cloud neural stream or local fallback), and availability state (online/offline).
- **Playback Session**: Tracks the state of the active narration, including the active article, current sentence/paragraph index, playback status (playing, paused, stopped), reading rate, and overall completion progress.
- **User Settings**: Encapsulates persistent user preferences including preferred regional voice, baseline playback speed, and visual highlight preferences.

### Out of Scope (v1)

- Processing standalone PDF documents, whether viewed online or locally.
- Non-HTML document formats (EPUB, Word, plain text files).
- Multi-language synthesis or automatic translation beyond English (UK, US, India).
- User account creation, cloud sync across distinct devices, or remote audio file exports.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can initiate article narration with a single click or tap, with audio starting in under 2 seconds on standard broadband/mobile networks.
- **SC-002**: Article extraction accurately isolates the main article content on at least 95% of standard online news publications, blogs, and editorial websites without capturing surrounding ads or navigation links.
- **SC-003**: The voice selector presents exactly 6 natural voice profiles (2 per regional dialect: UK, US, India) adhering to authentic regional accents, with 0 robotic legacy voices exposed to the user.
- **SC-004**: Visual highlight synchronizes with spoken audio with a perceived lag of less than 300 milliseconds.
- **SC-005**: Narration continues smoothly in the background when navigating tabs on desktop or locking the screen on Firefox for Android with 0 unintended playback interruptions.
- **SC-006**: At least 90% of tested users can operate playback controls and switch regional voice accents on first use without requiring tutorials or help documentation.
- **SC-007**: 100% of network synthesis requests transmit exclusively over encrypted connections with zero remote data persistence, leaving no lingering user article text or audio logs on external servers.

## Assumptions

- Users have functioning audio hardware (speakers, headphones) connected to their device.
- Standard web pages follow common semantic HTML conventions (e.g., `<article>`, `<p>`, `<header>`) or readable DOM structures for content extraction.
- Delivering high-fidelity natural voices may utilize available platform neural speech engines or online high-definition voice streams, with graceful offline messaging when disconnected.
- Firefox for Android supports the standard extension capabilities required for background audio playback and touch menu access.
- Users do not need an account, login, or personal API key to use the core reading features.
- Text highlighting is non-destructive to the original web page layout and disappears cleanly when reading is stopped.
