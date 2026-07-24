import { useState, useCallback, useEffect } from 'react';

export function useTextToSpeech() {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speak = useCallback(
    (text: string) => {
      if (isMuted || !text || !('speechSynthesis' in window)) return;

      // Cancel any ongoing speech before starting new sentence
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;  // Standard speed
      utterance.pitch = 1.0; // Natural pitch

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) stop();
      return !prev;
    });
  }, [stop]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isMuted, toggleMute, isSpeaking };
}