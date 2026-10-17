import { MESSAGE_TYPES, PLAYER_ACTIONS, PLAYBACK_STATUS } from '../common/constants.js';
import { sendMessageToBackground, sendMessageToTab } from '../common/messages.js';

let activeTabId = null;
let currentStatus = PLAYBACK_STATUS.IDLE;

// Player View Elements
const playerView = document.getElementById('player-view');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnPlayLabel = document.getElementById('btn-play-label');
const btnStop = document.getElementById('btn-stop');
const statusBadge = document.getElementById('status-badge');
const articleTitle = document.getElementById('article-title');
const voiceSelect = document.getElementById('voice-select');
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
const logoIcon = document.querySelector('.logo-icon');

// Settings View Elements
const settingsView = document.getElementById('settings-view');
const btnToggleSettings = document.getElementById('btn-toggle-settings');
const btnBackPlayer = document.getElementById('btn-back-player');
const providerSelect = document.getElementById('provider-select');
const btnSaveSettings = document.getElementById('btn-save-settings');
const settingsStatus = document.getElementById('settings-status');

// Provider Fields
const providerFieldGroups = {
  system: document.getElementById('provider-fields-system'),
  azure: document.getElementById('provider-fields-azure'),
  openai: document.getElementById('provider-fields-openai'),
  elevenlabs: document.getElementById('provider-fields-elevenlabs'),
  custom: document.getElementById('provider-fields-custom')
};

const azureKeyInput = document.getElementById('azure-key');
const azureRegionInput = document.getElementById('azure-region');
const openaiKeyInput = document.getElementById('openai-key');
const openaiVoiceSelect = document.getElementById('openai-voice');
const elevenlabsKeyInput = document.getElementById('elevenlabs-key');
const elevenlabsVoiceIdInput = document.getElementById('elevenlabs-voice-id');
const customUrlInput = document.getElementById('custom-url');
const customModelInput = document.getElementById('custom-model');
const customKeyInput = document.getElementById('custom-key');

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

function switchProviderFields(provider) {
  for (const [key, element] of Object.entries(providerFieldGroups)) {
    if (element) {
      element.hidden = key !== provider;
    }
  }
}

function toggleSettingsView(show) {
  const isSettingsActive = show !== undefined ? show : settingsView.hidden;
  if (isSettingsActive) {
    playerView.hidden = true;
    settingsView.hidden = false;
    btnToggleSettings.classList.add('active');
  } else {
    settingsView.hidden = true;
    playerView.hidden = false;
    btnToggleSettings.classList.remove('active');
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
    const s = settingsRes.settings;
    if (s.voiceId) voiceSelect.value = s.voiceId;
    if (s.speedRate) {
      speedSlider.value = s.speedRate;
      speedDisplay.textContent = `${s.speedRate}x`;
    }
    if (s.provider) {
      providerSelect.value = s.provider;
    }
    if (s.azureKey) azureKeyInput.value = s.azureKey;
    if (s.azureRegion) azureRegionInput.value = s.azureRegion;
    if (s.openaiKey) openaiKeyInput.value = s.openaiKey;
    if (s.openaiVoice) openaiVoiceSelect.value = s.openaiVoice;
    if (s.elevenlabsKey) elevenlabsKeyInput.value = s.elevenlabsKey;
    if (s.elevenlabsVoiceId) elevenlabsVoiceIdInput.value = s.elevenlabsVoiceId;
    if (s.customUrl) customUrlInput.value = s.customUrl;
    if (s.customModel) customModelInput.value = s.customModel;
    if (s.customKey) customKeyInput.value = s.customKey;

    switchProviderFields(s.provider || 'system');
  } else {
    switchProviderFields('system');
  }

  // Query background status
  const stateRes = await sendMessageToBackground(MESSAGE_TYPES.GET_STATE, { tabId: activeTabId });
  if (stateRes && stateRes.session) {
    updateUIState(stateRes.session);
  }
}

// Navigation Events
btnToggleSettings.addEventListener('click', () => {
  toggleSettingsView();
});

btnBackPlayer.addEventListener('click', () => {
  toggleSettingsView(false);
});

providerSelect.addEventListener('change', (e) => {
  switchProviderFields(e.target.value);
});

// Save Settings Event
btnSaveSettings.addEventListener('click', async () => {
  const payload = {
    provider: providerSelect.value,
    azureKey: azureKeyInput.value.trim(),
    azureRegion: azureRegionInput.value.trim() || 'eastus',
    openaiKey: openaiKeyInput.value.trim(),
    openaiVoice: openaiVoiceSelect.value,
    elevenlabsKey: elevenlabsKeyInput.value.trim(),
    elevenlabsVoiceId: elevenlabsVoiceIdInput.value.trim() || '21m00Tcm4TlvDq8ikWAM',
    customUrl: customUrlInput.value.trim(),
    customModel: customModelInput.value.trim() || 'hexgrad/Kokoro-82M',
    customKey: customKeyInput.value.trim()
  };

  btnSaveSettings.disabled = true;
  settingsStatus.textContent = 'Saving...';
  settingsStatus.style.color = 'var(--text-muted)';

  try {
    await sendMessageToBackground(MESSAGE_TYPES.UPDATE_SETTINGS, payload);
    if (activeTabId) {
      sendMessageToTab(activeTabId, MESSAGE_TYPES.UPDATE_SETTINGS, payload).catch(() => {});
    }
    settingsStatus.textContent = 'Saved ✓';
    settingsStatus.style.color = '#10b981';
  } catch (err) {
    console.error('[SimpleAloud] Failed to save settings:', err);
    settingsStatus.textContent = 'Failed to save';
    settingsStatus.style.color = 'var(--danger)';
  } finally {
    btnSaveSettings.disabled = false;
    setTimeout(() => {
      if (settingsStatus.textContent === 'Saved ✓') {
        settingsStatus.textContent = '';
      }
    }, 2500);
  }
});

// Playback Control Events
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
      try {
        await sendMessageToTab(activeTabId, MESSAGE_TYPES.READER_START, { tabId: activeTabId });
        window.close();
      } catch (err) {
        console.warn('[SimpleAloud] Tab messaging failed, attempting dynamic injection:', err);
        let injected = false;
        try {
          if (typeof browser !== 'undefined' && browser.scripting && browser.scripting.executeScript) {
            await browser.scripting.executeScript({
              target: { tabId: activeTabId },
              files: ['dist/content-script.js']
            });
            await sendMessageToTab(activeTabId, MESSAGE_TYPES.READER_START, { tabId: activeTabId });
            injected = true;
            window.close();
            return;
          }
        } catch (injectErr) {
          console.warn('[SimpleAloud] Injection failed:', injectErr);
        }

        if (!injected) {
          statusBadge.textContent = 'Unavailable';
          articleTitle.textContent = 'Open an article & refresh the page';
          setTimeout(() => {
            if (currentStatus === PLAYBACK_STATUS.IDLE) {
              statusBadge.textContent = 'Ready';
              articleTitle.textContent = 'Click Read Aloud to begin';
            }
          }, 4000);
        }
      }
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
