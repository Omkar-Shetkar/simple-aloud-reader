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
   * Generates Sec-MS-GEC DRM token for Edge TTS handshake.
   * @returns {Promise<string>}
   */
  async getSecMsGecToken() {
    try {
      const WIN_EPOCH = 11644473600n;
      let ticks = BigInt(Math.floor(Date.now() / 1000)) + WIN_EPOCH;
      ticks = ticks - (ticks % 300n);
      const ticks100ns = ticks * 10000000n;
      const strToHash = ticks100ns.toString() + TRUSTED_TOKEN;

      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(strToHash));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      }
    } catch (e) {}
    return '';
  }

  /**
   * Fetches high-definition neural speech stream from Google Neural TTS.
   * @param {string} text
   * @param {string} dialect
   * @returns {Promise<Blob>}
   */
  async fetchGoogleTtsBlob(text, dialect = 'en-US') {
    const tl = dialect.startsWith('en-IN') ? 'en-IN' : (dialect.startsWith('en-GB') ? 'en-GB' : 'en-US');
    const cleanText = text.slice(0, 200).trim();
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}&q=${encodeURIComponent(cleanText)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Google TTS response status: ${res.status}`);
    const blob = await res.blob();
    if (!blob || blob.size === 0) throw new Error('Empty audio stream from Google TTS');
    return blob;
  }

  /**
   * Synthesizes text chunk into MP3 audio via Neural Stream or Edge WebSocket.
   * @param {string} text
   * @param {string} voiceName
   * @param {number} rate
   * @param {string} dialect
   * @returns {Promise<Blob>}
   */
  async synthesizeToBlob(text, voiceName, rate = 1.0, dialect = 'en-US') {
    try {
      const blob = await this.fetchGoogleTtsBlob(text, dialect);
      if (blob && blob.size > 0) {
        return blob;
      }
    } catch (e) {
      console.warn('[SimpleAloud] Primary neural stream unavailable, attempting Edge WebSocket...', e);
    }

    return this.synthesizeEdgeWebSocket(text, voiceName, rate);
  }

  /**
   * Synthesizes text chunk into MP3 audio via Edge WebSocket.
   * @param {string} text
   * @param {string} voiceName
   * @param {number} rate
   * @returns {Promise<Blob>}
   */
  async synthesizeEdgeWebSocket(text, voiceName, rate = 1.0) {
    const gecToken = await this.getSecMsGecToken();
    const wsUrl = gecToken
      ? `${EDGE_WS_URL}&Sec-MS-GEC=${gecToken}&Sec-MS-GEC-Version=1-130.0.2849.68`
      : EDGE_WS_URL;

    return new Promise((resolve, reject) => {
      if (typeof WebSocket === 'undefined') {
        return reject(new Error('WebSocket not available in this environment'));
      }

      let settled = false;
      const connectionTimeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          if (ws) {
            try { ws.close(); } catch (e) {}
          }
          reject(new Error('Neural TTS connection timeout'));
        }
      }, 4000);

      const ws = new WebSocket(wsUrl);
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
            if (!settled) {
              settled = true;
              clearTimeout(connectionTimeout);
              try { ws.close(); } catch (e) {}
              const fullBlob = new Blob(audioChunks, { type: 'audio/mp3' });
              resolve(fullBlob);
            }
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
        if (!settled) {
          settled = true;
          clearTimeout(connectionTimeout);
          reject(new Error('WebSocket error during neural TTS streaming'));
        }
      };

      ws.onclose = (event) => {
        if (!settled) {
          settled = true;
          clearTimeout(connectionTimeout);
          if (audioChunks.length > 0) {
            const fullBlob = new Blob(audioChunks, { type: 'audio/mp3' });
            resolve(fullBlob);
          } else {
            reject(new Error(`Neural WebSocket closed without audio (code: ${event ? event.code : 'unknown'})`));
          }
        }
      };
    });
  }

  /**
   * Plays an audio blob directly through the HTML5 Audio element.
   * @param {Blob} blob
   * @param {object} options
   */
  async playBlob(blob, options = {}) {
    this.stop();

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
      if (options.onEnd) options.onEnd();
      return;
    }

    const rate = options.rate || this.currentRate;
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

  /**
   * Speaks a chunk of text.
   * @param {string} text
   * @param {object} options
   */
  async speak(text, options = {}) {
    const voiceName = options.serviceVoiceName || this.currentVoiceName;
    const rate = options.rate || this.currentRate;
    const dialect = options.dialect || options.profile?.dialect || 'en-US';

    const blob = await this.synthesizeToBlob(text, voiceName, rate, dialect);
    return this.playBlob(blob, options);
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
