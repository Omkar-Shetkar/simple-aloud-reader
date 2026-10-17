import { MESSAGE_TYPES, PLAYER_ACTIONS, PLAYBACK_STATUS } from '../common/constants.js';
import { sendMessageToBackground, sendMessageToTab } from '../common/messages.js';

let activeTabId = null;
let currentStatus = PLAYBACK_STATUS.IDLE;

const btnPlayPause = document.getElementById('btn-play-pause');
const btnPlayLabel = document.getElementById('btn-play-label');
const btnStop = document.getElementById('btn-stop');
const statusBadge = document.getElementById('status-badge');
const articleTitle = document.getElementById('article-title');
const voiceSelect = document.getElementById('voice-select');
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
const logoIcon = document.querySelector('.logo-icon');

async function getActiveTab() {
  if (typeof browser !== 'undefined' && browser.tabs && browser.tabs.query) {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0] || null;
  }
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0] || null));
    });
  }
  return null;
}

function updateUIState(state) {
  if (!state) return;
  currentStatus = state.status || PLAYBACK_STATUS.IDLE;

  statusBadge.className = 'badge';
  if (currentStatus === PLAYBACK_STATUS.PLAYING) {
    statusBadge.textContent = 'Reading';
    statusBadge.classList.add('badge-playing');
    btnPlayLabel.textContent = 'Pause';
    btnStop.disabled = false;
    logoIcon.classList.add('is-playing');
  } else if (currentStatus === PLAYBACK_STATUS.PAUSED) {
    statusBadge.textContent = 'Paused';
    statusBadge.classList.add('badge-paused');
    btnPlayLabel.textContent = 'Resume';
    btnStop.disabled = false;
    logoIcon.classList.remove('is-playing');
  } else {
    statusBadge.textContent = 'Ready';
    statusBadge.classList.add('badge-idle');
    btnPlayLabel.textContent = 'Read Aloud';
    btnStop.disabled = true;
    logoIcon.classList.remove('is-playing');
  }

  if (state.articleTitle) {
    articleTitle.textContent = state.articleTitle;
  }

  if (state.voiceId && voiceSelect.value !== state.voiceId) {
    voiceSelect.value = state.voiceId;
  }

  if (state.speedRate) {
    speedSlider.value = state.speedRate;
    speedDisplay.textContent = `${state.speedRate}x`;
  }
}

async function init() {
  const tab = await getActiveTab();
  if (tab) {
    activeTabId = tab.id;
  }

  // Load stored settings
  const settingsRes = await sendMessageToBackground(MESSAGE_TYPES.GET_SETTINGS);
  if (settingsRes && settingsRes.settings) {
    const { voiceId, speedRate } = settingsRes.settings;
    if (voiceId) voiceSelect.value = voiceId;
    if (speedRate) {
      speedSlider.value = speedRate;
      speedDisplay.textContent = `${speedRate}x`;
    }
  }

  // Query background status
  const stateRes = await sendMessageToBackground(MESSAGE_TYPES.GET_STATE, { tabId: activeTabId });
  if (stateRes && stateRes.session) {
    updateUIState(stateRes.session);
  }
}

btnPlayPause.addEventListener('click', async () => {
  if (currentStatus === PLAYBACK_STATUS.PLAYING) {
    await sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
      tabId: activeTabId,
      action: PLAYER_ACTIONS.PAUSE
    });
    updateUIState({ status: PLAYBACK_STATUS.PAUSED });
  } else if (currentStatus === PLAYBACK_STATUS.PAUSED) {
    await sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
      tabId: activeTabId,
      action: PLAYER_ACTIONS.RESUME
    });
    updateUIState({ status: PLAYBACK_STATUS.PLAYING });
  } else {
    // Start reading on the active tab
    if (activeTabId) {
      statusBadge.textContent = 'Extracting...';
      await sendMessageToTab(activeTabId, MESSAGE_TYPES.READER_START, { tabId: activeTabId });
      window.close(); // Close popup so user sees the in-page reader
    }
  }
});

btnStop.addEventListener('click', async () => {
  await sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
    tabId: activeTabId,
    action: PLAYER_ACTIONS.STOP
  });
  updateUIState({ status: PLAYBACK_STATUS.STOPPED, articleTitle: 'Click Read Aloud to begin' });
});

voiceSelect.addEventListener('change', async (e) => {
  const newVoice = e.target.value;
  await sendMessageToBackground(MESSAGE_TYPES.UPDATE_SETTINGS, { voiceId: newVoice });
  await sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
    tabId: activeTabId,
    action: PLAYER_ACTIONS.SET_VOICE,
    value: newVoice
  });
});

speedSlider.addEventListener('input', async (e) => {
  const rate = parseFloat(e.target.value);
  speedDisplay.textContent = `${rate}x`;
  await sendMessageToBackground(MESSAGE_TYPES.UPDATE_SETTINGS, { speedRate: rate });
  await sendMessageToBackground(MESSAGE_TYPES.PLAYER_COMMAND, {
    tabId: activeTabId,
    action: PLAYER_ACTIONS.SET_SPEED,
    value: rate
  });
});

init();
