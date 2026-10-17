# Contract: TTS Engine Interface

**Context**: Defines the unified speech synthesis abstraction implemented by the hybrid speech engine (Edge WebSocket Neural Stream + Local Web Speech API Fallback).

---

## 1. Interface Definition

```typescript
export interface ITtsEngine {
  /**
   * Initializes the engine, checks network availability, and discovers local fallback voices.
   */
  initialize(): Promise<VoiceProfile[]>;

  /**
   * Returns list of available curated voice profiles.
   */
  getAvailableVoices(): VoiceProfile[];

  /**
   * Synthesizes and plays a sentence or paragraph chunk.
   * Emits progress callbacks for audio-visual highlight synchronization.
   */
  speak(chunk: UtteranceChunk, options: SpeakOptions): Promise<void>;

  /**
   * Pauses the active speech utterance.
   */
  pause(): void;

  /**
   * Resumes playback from the paused offset.
   */
  resume(): void;

  /**
   * Immediately stops audio playback and purges buffering queues.
   */
  stop(): void;

  /**
   * Adjusts playback rate on the active audio stream.
   * Rate: 0.75 to 2.0
   */
  setRate(rate: number): void;
}

export interface UtteranceChunk {
  paragraphIndex: number;
  sentenceIndex: number;
  text: string;
}

export interface SpeakOptions {
  voiceId: string;
  rate: number;
  onSentenceBoundary?: (sentenceIndex: number) => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}
```

---

## 2. Implementations

### 2.1 NeuralStreamEngine (Primary)
- **Protocol**: Secure WebSocket (`wss://`) streaming chunked MP3/Opus audio packets.
- **Audio Decoding**: Decoded via Web Audio API `AudioContext` or piped to HTML5 `<audio>` element with `srcObject` / `Blob` URL.
- **Privacy & Lifecycle**: Stream closes immediately upon utterance completion or explicit stop. No text or user identifiers are logged.

### 2.2 LocalSpeechEngine (Fallback)
- **API**: `window.speechSynthesis` / `SpeechSynthesisUtterance`.
- **Trigger**: Automatic fallback when online stream errors, times out (>3s), or `navigator.onLine === false`.
- **Voice Mapping**: Selects closest local OS match for dialect (`en-US`, `en-GB`, `en-IN`) and gender.
