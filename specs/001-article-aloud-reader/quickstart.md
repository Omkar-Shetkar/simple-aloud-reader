# Quickstart: Simple Aloud Reader

**Feature**: Simple Aloud Reader for Online Articles (Firefox Add-on)  
**Branch**: `001-article-aloud-reader`  
**Date**: 2026-10-17  

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Firefox**: Firefox Desktop (v109+) and/or Firefox for Android (v110+)
- **web-ext CLI** (recommended): `npm install --global web-ext`

---

## 2. Project Installation

```bash
# Navigate to repository root
cd /Users/omkar/projects/simple-aloud-reader

# Install dependencies (Readability, build tools, test runners)
npm install
```

---

## 3. Running in Development Mode

### Desktop Firefox
Run the extension in a temporary isolated Firefox profile:

```bash
# Launch Firefox with automatic reload on file changes
npx web-ext run --target=firefox-desktop
```

### Firefox for Android
Connect an Android device with USB debugging enabled:

```bash
# List connected Android devices
npx web-ext target-list --target=firefox-android

# Launch in Firefox for Android
npx web-ext run --target=firefox-android --android-device=<DEVICE_ID>
```

---

## 4. Running Verification & Tests

```bash
# Run unit and contract tests (extractor, segmented audio queue, message bus)
npm test

# Validate WebExtensions manifest and code rules
npm run lint
# or
npx web-ext lint
```

---

## 5. Manual Testing Verification Checklist

1. **One-Click Reading**:
   - Open any standard news article (e.g., [BBC News](https://www.bbc.com) or [Wikipedia](https://en.wikipedia.org)).
   - Click the Simple Aloud Reader extension icon in the toolbar.
   - Verify narration starts in under 2 seconds and floating bottom audio bar appears.
2. **Synchronized Highlighting**:
   - Verify the sentence currently being read is highlighted with a soft yellow background.
   - Verify page scrolls automatically as reading progresses down long articles.
3. **Voice & Speed Switching**:
   - Open the Voice menu on the floating audio bar.
   - Select each dialect: US ("US - Sarah"), UK ("UK - Oliver"), and India ("India - Neerja").
   - Confirm natural accent switches immediately.
   - Adjust speed slider to 1.25x and 1.5x; verify audio tempo increases smoothly with pitch preservation.
4. **Paragraph Seeking**:
   - Click on any paragraph midway through the article.
   - Verify speech immediately jumps to that paragraph.
5. **Offline Fallback**:
   - Toggle browser offline mode or disconnect Wi-Fi while playing.
   - Verify player transitions seamlessly to local device speech fallback without crashing.
