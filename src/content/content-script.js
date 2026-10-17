import { MESSAGE_TYPES, PLAYER_ACTIONS, PLAYBACK_STATUS } from '../common/constants.js';
import { addMessageListener, sendMessageToBackground } from '../common/messages.js';
import { extractArticleContent } from './extractor.js';
import { segmentParagraphsIntoSentences } from './segmenter.js';
import { SentenceHighlighter } from './highlighter.js';
import { PlayerBar } from './ui/player-bar.js';

console.log('[SimpleAloud] Content script active on:', window.location.href);

let currentArticle = null;
const highlighter = new SentenceHighlighter(document);
let playerBar = null;
let isDelegationAttached = false;

/**
 * Message listener from background
 */
addMessageListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  switch (message.type) {
    case MESSAGE_TYPES.READER_START:
      handleReaderStart();
      sendResponse({ received: true });
      return true;

    case MESSAGE_TYPES.SENTENCE_PROGRESS:
      if (message.payload) {
        highlighter.highlightSentence(message.payload.paragraphIndex, message.payload.sentenceIndex);
      }
      break;

    case MESSAGE_TYPES.STATE_CHANGED:
      if (playerBar && message.payload) {
        playerBar.updateState(message.payload);
      }
      break;

    default:
      break;
  }
});

/**
 * Attaches paragraph click-to-seek delegation.
 */
function attachClickToSeek() {
  if (isDelegationAttached) return;
  isDelegationAttached = true;

  document.addEventListener('click', (e) => {
    // Only handle if article is currently active
    if (!currentArticle) return;

    const targetSpan = e.target.closest('.simple-aloud-sentence');
    if (targetSpan) {
      const pIndex = parseInt(targetSpan.getAttribute('data-p-index'), 10);
      if (!isNaN(pIndex)) {
        sendMessageToBackground(MESSAGE_TYPES.PARAGRAPH_CLICKED, {
          paragraphIndex: pIndex
        });
      }
    }
  });
}

/**
 * Executes article extraction and dispatches to background audio stream
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
        const action = playerBar.status === PLAYBACK_STATUS.PLAYING
          ? PLAYER_ACTIONS.PAUSE
          : PLAYER_ACTIONS.RESUME;
        sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, { action });
      },
      onSkipForward: () => {
        sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
          action: PLAYER_ACTIONS.SKIP_FORWARD
        });
      },
      onSkipBackward: () => {
        sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
          action: PLAYER_ACTIONS.SKIP_BACKWARD
        });
      },
      onVoiceChange: (voiceId) => {
        sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
          action: PLAYER_ACTIONS.SET_VOICE,
          value: voiceId
        });
      },
      onSpeedChange: (speed) => {
        sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
          action: PLAYER_ACTIONS.SET_SPEED,
          value: speed
        });
      },
      onClose: () => {
        highlighter.clear();
        if (playerBar) {
          playerBar.destroy();
          playerBar = null;
        }
        currentArticle = null;
        sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
          action: PLAYER_ACTIONS.STOP
        });
      }
    });
  }

  playerBar.mount(document);
  playerBar.updateState({ status: PLAYBACK_STATUS.PLAYING });

  // Send to background for speech synthesis
  await sendMessageToBackground(MESSAGE_TYPES.ARTICLE_PARSED, {
    article: result.article
  });
}
