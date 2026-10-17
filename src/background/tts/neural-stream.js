/**
 * High-definition Neural Speech Streaming Client.
 * Streams natural neural voice audio via secure WebSocket protocol with zero server data retention.
 */

const TRUSTED_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_WS_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}`;

/**
 * Escapes XML special characters for SSML payload.
 * @param {string} text
 * @returns {string}
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an SSML string for synthesis.
 * @param {string} text
 * @param {string} voiceName
 * @param {number} rate
 * @returns {string}
 */
export function buildSsml(text, voiceName, rate = 1.0) {
  const percent = Math.round((rate - 1.0) * 100);
  const rateStr = percent >= 0 ? `+${percent}%` : `${percent}%`;

  return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
    `<voice name='${voiceName}'>` +
    `<prosody rate='${rateStr}'>${escapeXml(text)}</prosody>` +
    `</voice></speak>`;
}

export class NeuralStreamEngine {
  constructor() {
    this.audioElement = null;
    this.currentBlobUrl = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentRate = 1.0;
    this.currentVoiceName = 'en-US-JennyNeural';
    this.activeWs = null;
  }

  /**
   * Initializes audio element
   */
  async initialize() {
    if (typeof Audio !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.playbackRate = this.currentRate;
    }
  }

  /**
   * Synthesizes text chunk into MP3 audio via WebSocket.
   * @param {string} text
   * @param {string} voiceName
   * @param {number} rate
   * @returns {Promise<Blob>}
   */
  async synthesizeToBlob(text, voiceName, rate = 1.0) {
    return new Promise((resolve, reject) => {
      if (typeof WebSocket === 'undefined') {
        return reject(new Error('WebSocket not available in this environment'));
      }

      const connectionTimeout = setTimeout(() => {
        if (ws) ws.close();
        reject(new Error('Neural TTS connection timeout'));
      }, 7000);

      const ws = new WebSocket(EDGE_WS_URL);
      this.activeWs = ws;
      ws.binaryType = 'arraybuffer';

      const audioChunks = [];
      const requestId = Math.random().toString(36).substring(2, 12);

      ws.onopen = () => {
        // Send initial audio config
        const configMessage =
          'Content-Type:application/json; charset=utf-8\r\n' +
          'Path:speech.config\r\n\r\n' +
          JSON.stringify({
            context: {
              synthesis: {
                audio: {
                  metadataoptions: {
                    sentenceBoundaryEnabled: 'false',
                    wordBoundaryEnabled: 'false'
                  },
                  outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
                }
              }
            }
          });
        ws.send(configMessage);

        // Send SSML request
        const ssml = buildSsml(text, voiceName, rate);
        const ssmlMessage =
          `X-RequestId:${requestId}\r\n` +
          'Content-Type:application/ssml+xml\r\n' +
          'Path:ssml\r\n\r\n' +
          ssml;
        ws.send(ssmlMessage);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          if (event.data.includes('Path:turn.end')) {
            clearTimeout(connectionTimeout);
            ws.close();
            const fullBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            resolve(fullBlob);
          }
        } else if (event.data instanceof ArrayBuffer) {
          // Binary message: Header length (2 bytes UInt16) followed by header text and binary audio payload
          const view = new DataView(event.data);
          const headerLength = view.getUint16(0);
          const audioData = event.data.slice(2 + headerLength);
          audioChunks.push(audioData);
        }
      };

      ws.onerror = (err) => {
        clearTimeout(connectionTimeout);
        reject(new Error('WebSocket error during neural TTS streaming'));
      };

      ws.onclose = () => {
        clearTimeout(connectionTimeout);
        if (audioChunks.length > 0) {
          const fullBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          resolve(fullBlob);
        }
      };
    });
  }

  /**
   * Speaks a chunk of text.
   * @param {string} text
   * @param {object} options
   */
  async speak(text, options = {}) {
    this.stop();

    const voiceName = options.serviceVoiceName || this.currentVoiceName;
    const rate = options.rate || this.currentRate;

    const blob = await this.synthesizeToBlob(text, voiceName, rate);
    if (!blob || blob.size === 0) {
      throw new Error('Empty audio stream received');
    }

    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
    }
    this.currentBlobUrl = URL.createObjectURL(blob);

    if (!this.audioElement && typeof Audio !== 'undefined') {
      this.audioElement = new Audio();
    }

    if (!this.audioElement) {
      // In non-DOM testing environment, complete immediately
      if (options.onEnd) options.onEnd();
      return;
    }

    this.audioElement.src = this.currentBlobUrl;
    this.audioElement.playbackRate = rate;

    return new Promise((resolve, reject) => {
      this.audioElement.onended = () => {
        this.isPlaying = false;
        this.isPaused = false;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      this.audioElement.onerror = (e) => {
        this.isPlaying = false;
        this.isPaused = false;
        if (options.onError) options.onError(e);
        reject(e);
      };

      this.audioElement.play()
        .then(() => {
          this.isPlaying = true;
          this.isPaused = false;
        })
        .catch(reject);
    });
  }

  pause() {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
      this.isPaused = true;
    }
  }

  resume() {
    if (this.audioElement && this.isPaused) {
      this.audioElement.play();
      this.isPlaying = true;
      this.isPaused = false;
    }
  }

  stop() {
    if (this.activeWs) {
      try { this.activeWs.close(); } catch (e) {}
      this.activeWs = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
  }

  setRate(rate) {
    this.currentRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }
}
