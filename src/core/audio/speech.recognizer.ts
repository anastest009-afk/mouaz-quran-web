export type SpeechStatus = 'idle' | 'listening' | 'unsupported' | 'error';

export interface SpeechTranscriptEvent {
  fullText: string;
  latestFinal: string;
  latestInterim: string;
  hasFinal: boolean;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionInstanceLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechCtor = new () => SpeechRecognitionInstanceLike;

function getSpeechConstructor(): SpeechCtor | null {
  const win = window as unknown as {
    SpeechRecognition?: SpeechCtor;
    webkitSpeechRecognition?: SpeechCtor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export class SpeechRecognizerService {
  private recognition: SpeechRecognitionInstanceLike | null = null;
  private shouldStayActive = false;
  private finalizedSegments: string[] = [];
  private activeSegmentOffset = 0;
  private transcriptListener: ((ev: SpeechTranscriptEvent) => void) | null = null;
  private statusListener: ((status: SpeechStatus, errorCode?: string) => void) | null = null;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && getSpeechConstructor() !== null;
  }

  onTranscript(cb: ((ev: SpeechTranscriptEvent) => void) | null): void {
    this.transcriptListener = cb;
  }

  onStatusChange(cb: ((status: SpeechStatus, errorCode?: string) => void) | null): void {
    this.statusListener = cb;
  }

  start(lang = 'ar-SA'): boolean {
    const Ctor = getSpeechConstructor();
    if (!Ctor) {
      this.statusListener?.('unsupported');
      return false;
    }

    this.stop();
    this.finalizedSegments = [];
    this.activeSegmentOffset = 0;
    this.shouldStayActive = true;
    this.bootRecognizer(Ctor, lang);
    return true;
  }

  resetCursor(): void {
    this.activeSegmentOffset = this.finalizedSegments.length;
  }

  stop(): void {
    this.shouldStayActive = false;
    if (this.recognition) {
      try {
        this.recognition.onend = null;
        this.recognition.stop();
      } catch {
        // Ignore stop errors
      }
      this.recognition = null;
    }
    this.statusListener?.('idle');
  }

  destroy(): void {
    this.stop();
    this.transcriptListener = null;
    this.statusListener = null;
  }

  private bootRecognizer(Ctor: SpeechCtor, lang: string): void {
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let latestInterim = '';
      let latestFinal = '';
      let hasFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result[0]?.transcript?.trim() || '';
        if (!piece) continue;
        if (result.isFinal) {
          this.finalizedSegments.push(piece);
          latestFinal = `${latestFinal} ${piece}`.trim();
          hasFinal = true;
        } else {
          latestInterim = `${latestInterim} ${piece}`.trim();
        }
      }

      const activeFinals = this.finalizedSegments.slice(this.activeSegmentOffset).join(' ');
      const fullText = `${activeFinals} ${latestInterim}`.trim();

      this.transcriptListener?.({
        fullText,
        latestFinal,
        latestInterim,
        hasFinal,
      });
    };

    rec.onerror = (ev) => {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        this.shouldStayActive = false;
        this.statusListener?.('error', 'not-allowed');
      } else if (ev.error !== 'no-speech' && ev.error !== 'aborted') {
        this.statusListener?.('error', ev.error);
      }
    };

    rec.onend = () => {
      if (this.shouldStayActive) {
        try {
          this.bootRecognizer(Ctor, lang);
        } catch {
          this.shouldStayActive = false;
          this.statusListener?.('error', 'restart_failed');
        }
      } else {
        this.statusListener?.('idle');
      }
    };

    try {
      rec.start();
      this.recognition = rec;
      this.statusListener?.('listening');
    } catch {
      this.shouldStayActive = false;
      this.statusListener?.('error', 'start_failed');
    }
  }
}
