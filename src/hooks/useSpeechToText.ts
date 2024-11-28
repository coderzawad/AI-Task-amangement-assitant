import { useState, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from 'react-hot-toast';

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Browser does not support speech recognition.');
      return;
    }

    if (!isMicrophoneAvailable) {
      toast.error('Please allow microphone access to use voice input.');
      return;
    }

    setIsListening(true);
    SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  }, []);

  const clearTranscript = useCallback(() => {
    resetTranscript();
  }, [resetTranscript]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  };
}