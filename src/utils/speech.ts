import { useState, useRef, useCallback, useEffect } from 'react';

// Speech Synthesis (Text-to-Speech)
export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(text: string, options: SpeakOptions = {}): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.(new Error('SpeechSynthesis is not supported in this browser.'));
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Arthur'))
    ) || voices.find((v) => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    if (e.error === 'canceled' || e.error === 'interrupted') {
      options.onEnd?.();
      return;
    }
    options.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

// Browser Speech Recognition Check
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

export type RecognitionState = 'stopped' | 'listening' | 'processing';

export interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  recognitionState: RecognitionState;
  error: string | null;
  isSupported: boolean;
  isSecureContext: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setManualTranscript: (text: string) => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognitionState, setRecognitionState] = useState<RecognitionState>('stopped');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const isListening = recognitionState === 'listening';

  const isSupported = isSpeechRecognitionSupported();
  const isSecureContext = typeof window !== 'undefined' ? window.isSecureContext : true;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    // Prevent duplicate sessions
    if (recognitionState === 'listening' || recognitionState === 'processing') {
      return;
    }

    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please type your answer directly.');
      setRecognitionState('stopped');
      return;
    }

    if (!isSecureContext) {
      setError('Microphone access requires a secure context (HTTPS or localhost). Please type your answer directly.');
      setRecognitionState('stopped');
      return;
    }

    // Check microphone permission via getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (mediaErr: any) {
        console.warn('getUserMedia permission check failed:', mediaErr);
        if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
          setError('Microphone permission was denied. Please allow microphone access in your browser settings or type your answer.');
        } else if (mediaErr.name === 'NotFoundError' || mediaErr.name === 'DevicesNotFoundError') {
          setError('No microphone device was found. Please check your hardware or type your answer.');
        } else if (mediaErr.name === 'NotReadableError' || mediaErr.name === 'TrackStartError') {
          setError('Microphone is busy or in use by another application.');
        } else {
          setError('Could not access microphone in this preview environment. You can type your answer directly.');
        }
        setRecognitionState('stopped');
        return;
      }
    }

    setError(null);
    shouldListenRef.current = true;

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Keep recording active continuously until user stops
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setRecognitionState('listening');
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentFinal = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript + ' ';
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentFinal) {
          setTranscript((prev) => (prev ? prev.trim() + ' ' + currentFinal.trim() : currentFinal.trim()));
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        const errType = event.error;

        if (errType === 'not-allowed') {
          setError('Microphone permission was denied. Please allow microphone access in your browser settings or type your answer directly.');
        } else if (errType === 'audio-capture') {
          setError('No microphone was found or the audio input is busy.');
        } else if (errType === 'network') {
          setError('Speech recognition network error. Please check your connection or type your answer.');
        } else if (errType === 'service-not-allowed') {
          setError('Speech recognition service is blocked in this environment. You can type your answer.');
        } else if (errType === 'aborted') {
          // Normal manual abort
        } else {
          setError(`Speech recognition error (${errType}). You can type your answer directly.`);
        }

        shouldListenRef.current = false;
        setRecognitionState('stopped');
      };

      recognition.onend = () => {
        // If shouldListenRef is true, browser ended session unexpectedly, attempt restart or set stopped
        if (shouldListenRef.current) {
          try {
            recognition.start();
            return;
          } catch {
            shouldListenRef.current = false;
          }
        }
        setRecognitionState('stopped');
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      shouldListenRef.current = false;
      setRecognitionState('stopped');
      setError('Could not start speech recognition in this environment. You can type your answer directly.');
    }
  }, [isSupported, isSecureContext, recognitionState]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setRecognitionState('stopped');
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const setManualTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    recognitionState,
    error,
    isSupported,
    isSecureContext,
    startListening,
    stopListening,
    resetTranscript,
    setManualTranscript,
  };
}
