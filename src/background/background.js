import { MESSAGE_TYPES, PLAYER_ACTIONS, PLAYBACK_STATUS } from '../common/constants.js';
import { getStoredSettings, updateStoredSettings } from '../common/storage.js';
import { getCuratedVoices } from './tts/voices.js';
import { addMessageListener, sendMessageToTab } from '../common/messages.js';
import { AudioManager } from './audio-manager.js';

console.log('[SimpleAloud] Background coordinator starting...');

const audioManager = new AudioManager();

let latestSessionState = null;

/**
 * Handle incoming runtime messages from content script & popup
 */
addMessageListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  const tabId = sender.tab ? sender.tab.id : message.payload?.tabId;

  switch (message.type) {
    case MESSAGE_TYPES.GET_SETTINGS:
      getStoredSettings().then((settings) => sendResponse({ settings }));
      return true;

    case MESSAGE_TYPES.UPDATE_SETTINGS:
      updateStoredSettings(message.payload)
        .then((settings) => sendResponse({ success: true, settings }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true;

    case MESSAGE_TYPES.STATE_CHANGED:
      if (message.payload) {
        latestSessionState = message.payload;
      }
      break;

    case MESSAGE_TYPES.GET_STATE:
      sendResponse({
        session: latestSessionState || audioManager.getState(),
        voices: getCuratedVoices()
      });
      return false;

    case MESSAGE_TYPES.PLAYER_COMMAND:
      if (tabId) {
        sendMessageToTab(tabId, MESSAGE_TYPES.PLAYER_COMMAND, message.payload).catch(() => {});
      }
      handlePlayerCommand(message.payload);
      sendResponse({ success: true });
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
 * Handle browser action click on desktop/mobile
 */
if (typeof browser !== 'undefined' && browser.action && browser.action.onClicked) {
  browser.action.onClicked.addListener(async (tab) => {
    if (tab && tab.id) {
      triggerReadingOnTab(tab.id);
    }
  });
}

/**
 * Handle extension commands / shortcuts
 */
if (typeof browser !== 'undefined' && browser.commands && browser.commands.onCommand) {
  browser.commands.onCommand.addListener(async (command) => {
    if (command === '_execute_action') {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        triggerReadingOnTab(tab.id);
      }
    }
  });
}

export async function triggerReadingOnTab(tabId) {
  try {
    await sendMessageToTab(tabId, MESSAGE_TYPES.READER_START, { tabId });
  } catch (err) {
    console.warn(`[SimpleAloud] Could not trigger reading on tab ${tabId}:`, err);
  }
}
