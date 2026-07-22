import React, { useState } from 'react';

interface InsightPanelProps {
  description: string;
  isStreaming: boolean;
  latencyMs: number;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({
  description,
  isStreaming,
  latencyMs,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Native Browser Text-To-Speech (Web Speech API)
  const handleSpeak = () => {
    if (!description || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.rate = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4">
      <div>
        {/* Header Block */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Groq Cloud VLM Narrative
            </h3>
          </div>

          <button
            onClick={handleSpeak}
            disabled={!description || !isStreaming}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <span>{isSpeaking ? '🔊 Speaking...' : '🔊 Read Aloud'}</span>
          </button>
        </div>

        {/* Narrative Box */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 min-h-[90px] flex items-center">
          <p className="text-sm text-indigo-200 leading-relaxed font-sans">
            {isStreaming
              ? description || 'Analyzing video stream context with Groq Vision...'
              : 'Stream is offline. Start camera to initialize real-time AI reasoning.'}
          </p>
        </div>
      </div>

      {/* Latency Footer */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-800/60">
        <span>Model: qwen/qwen3.6-27b</span>
        <span className="text-amber-400">{latencyMs > 0 ? `${latencyMs}ms latency` : '0ms'}</span>
      </div>
    </div>
  );
};