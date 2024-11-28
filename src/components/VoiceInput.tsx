import React, { useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechToText();

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
      clearTranscript();
    }
  }, [transcript, isListening, onTranscript, clearTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <motion.button
      onClick={toggleListening}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-full transition-colors ${
        isListening
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isListening ? 'Stop recording' : 'Start recording'}
    >
      <motion.div
        animate={isListening ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {isListening ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
}