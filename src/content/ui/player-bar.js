import { createVoiceSelector } from './voice-selector.js';
import { createSpeedController } from './speed-controller.js';
import { PLAYBACK_STATUS } from '../../common/constants.js';

function createSvgIcon(pathD, size = 18, isStroke = false) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 24 24');
  if (isStroke) {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.5');
  } else {
    svg.setAttribute('fill', 'currentColor');
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);
  return svg;
}

export class PlayerBar {
  constructor(options = {}) {
    this.onPlayPause = options.onPlayPause || (() => {});
    this.onSkipForward = options.onSkipForward || (() => {});
    this.onSkipBackward = options.onSkipBackward || (() => {});
    this.onVoiceChange = options.onVoiceChange || (() => {});
    this.onSpeedChange = options.onSpeedChange || (() => {});
    this.onClose = options.onClose || (() => {});

    this.host = null;
    this.shadow = null;
    this.btnPlay = null;
    this.speedCtrl = null;
    this.voiceSel = null;
    this.status = PLAYBACK_STATUS.IDLE;
  }

  mount(doc = document) {
    if (this.host) return;

    this.host = doc.createElement('div');
    this.host.id = 'simple-aloud-player-root';
    this.shadow = this.host.attachShadow({ mode: 'open' });

    // Load CSS
    const style = doc.createElement('style');
    style.textContent = `
      :host {
        all: initial;
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483647;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        user-select: none;
      }
      .aloud-player-container {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(15, 23, 42, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9999px;
        padding: 8px 16px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(99, 102, 241, 0.25);
        color: #f8fafc;
      }
      .aloud-btn {
        background: transparent;
        border: none;
        color: #f8fafc;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        transition: all 0.15s ease;
      }
      .aloud-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        transform: scale(1.05);
      }
      .aloud-btn-play {
        background: linear-gradient(135deg, #6366f1, #818cf8);
        width: 42px;
        height: 42px;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }
      .aloud-btn-play:hover {
        background: linear-gradient(135deg, #4f46e5, #6366f1);
      }
      .aloud-voice-select {
        background: rgba(30, 41, 59, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #f8fafc;
        border-radius: 20px;
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
      }
      .aloud-speed-btn {
        background: rgba(30, 41, 59, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #6366f1;
        border-radius: 20px;
        padding: 6px 10px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }
      .aloud-btn-close {
        color: #94a3b8;
      }
      .aloud-btn-close:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.15);
      }
    `;
    this.shadow.appendChild(style);

    const container = doc.createElement('div');
    container.className = 'aloud-player-container';

    // Skip backward button
    const btnPrev = doc.createElement('button');
    btnPrev.type = 'button';
    btnPrev.className = 'aloud-btn';
    btnPrev.title = 'Previous Sentence';
    btnPrev.appendChild(createSvgIcon('M6 6h2v12H6zm3.5 6l8.5 6V6z', 18));
    btnPrev.addEventListener('click', () => this.onSkipBackward());

    // Play/Pause button
    this.btnPlay = doc.createElement('button');
    this.btnPlay.type = 'button';
    this.btnPlay.className = 'aloud-btn aloud-btn-play';
    this.btnPlay.title = 'Play / Pause';
    this.renderPlayIcon();
    this.btnPlay.addEventListener('click', () => this.onPlayPause());

    // Skip forward button
    const btnNext = doc.createElement('button');
    btnNext.type = 'button';
    btnNext.className = 'aloud-btn';
    btnNext.title = 'Next Sentence';
    btnNext.appendChild(createSvgIcon('M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z', 18));
    btnNext.addEventListener('click', () => this.onSkipForward());

    // Voice selector
    this.voiceSel = createVoiceSelector('en-US-female', (voiceId) => this.onVoiceChange(voiceId));

    // Speed controller
    this.speedCtrl = createSpeedController(1.0, (speed) => this.onSpeedChange(speed));

    // Close button
    const btnClose = doc.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'aloud-btn aloud-btn-close';
    btnClose.title = 'Dismiss Player';
    btnClose.appendChild(createSvgIcon('M18 6L6 18M6 6l12 12', 16, true));
    btnClose.addEventListener('click', () => this.onClose());

    container.appendChild(btnPrev);
    container.appendChild(this.btnPlay);
    container.appendChild(btnNext);
    container.appendChild(this.voiceSel);
    container.appendChild(this.speedCtrl);
    container.appendChild(btnClose);

    this.shadow.appendChild(container);
    doc.body.appendChild(this.host);
  }

  renderPlayIcon() {
    if (!this.btnPlay) return;
    this.btnPlay.replaceChildren();
    if (this.status === PLAYBACK_STATUS.PLAYING) {
      this.btnPlay.appendChild(createSvgIcon('M6 19h4V5H6v14zm8-14v14h4V5h-4z', 22));
    } else {
      this.btnPlay.appendChild(createSvgIcon('M8 5v14l11-7z', 22));
    }
  }

  updateState(state = {}) {
    if (state.status) {
      this.status = state.status;
      this.renderPlayIcon();
    }
    if (state.speedRate && this.speedCtrl && this.speedCtrl.setSpeed) {
      this.speedCtrl.setSpeed(state.speedRate);
    }
    if (state.voiceId && this.voiceSel) {
      this.voiceSel.value = state.voiceId;
    }
  }

  destroy() {
    if (this.host && this.host.isConnected) {
      this.host.remove();
    }
    this.host = null;
    this.shadow = null;
  }
}
