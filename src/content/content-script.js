import { MESSAGE_TYPES, PLAYER_ACTIONS, PLAYBACK_STATUS } from '../common/constants.js';
import { addMessageListener, sendMessageToBackground } from '../common/messages.js';
import { extractArticleContent } from './extractor.js';
import { segmentParagraphsIntoSentences } from './segmenter.js';
import { SentenceHighlighter } from './highlighter.js';
import { PlayerBar } from './ui/player-bar.js';
import { AudioManager } from '../background/audio-manager.js';
import { getStoredSettings } from '../common/storage.js';

console.log('[SimpleAloud] Content script active on:', window.location.href);

let currentArticle = null;
const highlighter = new SentenceHighlighter(document);
let playerBar = null;
let isDelegationAttached = false;

// In-page Audio Manager ensures speech synthesis operates in the active DOM context with audible speaker output
const audioManager = new AudioManager({
  onSentenceChange: (paragraphIndex, sentenceIndex) => {
    highlighter.highlightSentence(paragraphIndex, sentenceIndex);
  },
  onStateChange: (state) => {
    if (playerBar) {
      playerBar.updateState(state);
    }
    sendMessageToBackground(MESSAGE_TYPES.STATE_CHANGED, state).catch(() => {});
  }
});

/**
 * Message listener from background & popup
 */
addMessageListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  switch (message.type) {
    case MESSAGE_TYPES.READER_START:
      handleReaderStart();
      sendResponse({ received: true });
      return true;

    case MESSAGE_TYPES.PLAYER_COMMAND:
      if (message.payload) {
        handlePlayerCommand(message.payload);
      }
      sendResponse({ success: true });
      break;

    case MESSAGE_TYPES.PARAGRAPH_CLICKED:
      if (message.payload && typeof message.payload.paragraphIndex === 'number') {
        audioManager.seekToParagraph(message.payload.paragraphIndex);
      }
      sendResponse({ success: true });
      break;

    case MESSAGE_TYPES.GET_STATE:
      sendResponse({ session: audioManager.getState() });
      break;

    default:
      break;
  }
});

function handlePlayerCommand(payload = {}) {
  const { action, value } = payload;
  switch (action) {
    case PLAYER_ACTIONS.PLAY:
    case PLAYER_ACTIONS.RESUME:
      audioManager.resume();
      break;
    case PLAYER_ACTIONS.PAUSE:
      audioManager.pause();
      break;
    case PLAYER_ACTIONS.STOP:
      audioManager.stop();
      highlighter.clear();
      if (playerBar) {
        playerBar.destroy();
        playerBar = null;
      }
      currentArticle = null;
      break;
    case PLAYER_ACTIONS.SKIP_FORWARD:
      audioManager.skipForward();
      break;
    case PLAYER_ACTIONS.SKIP_BACKWARD:
      audioManager.skipBackward();
      break;
    case PLAYER_ACTIONS.SET_SPEED:
      if (typeof value === 'number') audioManager.setSpeed(value);
      break;
    case PLAYER_ACTIONS.SET_VOICE:
      if (typeof value === 'string') audioManager.setVoice(value);
      break;
    default:
      break;
  }
}

/**
 * Attaches paragraph click-to-seek delegation.
 */
function attachClickToSeek() {
  if (isDelegationAttached) return;
  isDelegationAttached = true;

  document.addEventListener('click', (e) => {
    if (!currentArticle) return;

    const targetSpan = e.target.closest('.simple-aloud-sentence');
    if (targetSpan) {
      const pIndex = parseInt(targetSpan.getAttribute('data-p-index'), 10);
      if (!isNaN(pIndex)) {
        audioManager.seekToParagraph(pIndex);
      }
    }
  });
}

/**
 * Executes article extraction and launches playback in active page
 */
export async function handleReaderStart() {
  const result = extractArticleContent(document);

  if (!result.success || !result.article) {
    console.warn('[SimpleAloud] No article detected:', result.errorMessage);
    alert('Simple Aloud Reader: No readable article was detected on this page. Tip: Highlight text manually and click Read Aloud to narrate the selection.');
    return;
  }

  // Segment paragraphs into structured sentences
  const segmentedParagraphs = segmentParagraphsIntoSentences(result.article.paragraphs);
  result.article.paragraphs = segmentedParagraphs;

  let totalSentences = 0;
  for (const p of segmentedParagraphs) {
    totalSentences += (p.sentences ? p.sentences.length : 0);
  }
  result.article.totalSentences = totalSentences;
  currentArticle = result.article;

  // Non-destructive DOM visual highlight setup
  if (!result.isSelection) {
    highlighter.attachToArticle(result.article);
    attachClickToSeek();
  }

  // Initialize and mount floating bottom player bar
  if (!playerBar) {
    playerBar = new PlayerBar({
      onPlayPause: () => {
        if (audioManager.status === PLAYBACK_STATUS.PLAYING) {
          audioManager.pause();
        } else {
          audioManager.resume();
        }
      },
      onSkipForward: () => {
        audioManager.skipForward();
      },
      onSkipBackward: () => {
        audioManager.skipBackward();
      },
      onVoiceChange: (voiceId) => {
        audioManager.setVoice(voiceId);
      },
      onSpeedChange: (speed) => {
        audioManager.setSpeed(speed);
      },
      onClose: () => {
        audioManager.stop();
        highlighter.clear();
        if (playerBar) {
          playerBar.destroy();
          playerBar = null;
        }
        currentArticle = null;
      }
    });
  }

  playerBar.mount(document);

  // Retrieve user settings (voice, speed)
  const settings = await getStoredSettings().catch(() => ({}));
  if (settings.voiceId && playerBar.voiceSel) {
    playerBar.voiceSel.value = settings.voiceId;
  }
  if (settings.speedRate && playerBar.speedCtrl) {
    playerBar.speedCtrl.textContent = `${settings.speedRate}x`;
  }

  // Start audible playback directly within the active DOM page
  await audioManager.loadArticleAndPlay(null, result.article, settings);
}
