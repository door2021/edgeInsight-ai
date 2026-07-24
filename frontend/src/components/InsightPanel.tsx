import React, { useEffect } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

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
  const { speak, stop, isMuted, toggleMute, isSpeaking } = useTextToSpeech();

  // Automatically trigger voice output when narrative updates
  useEffect(() => {
    if (description && isStreaming) {
      speak(description);
    } else if (!isStreaming) {
      stop();
    }
  }, [description, isStreaming, speak, stop]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      {/* Panel Header with Voice Toggle Button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isStreaming ? 'bg-emerald-400' : 'bg-slate-500'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isStreaming ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            />
          </span>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            AI Narrative Insights
          </h3>
        </div>

        {/* Audio Toggle Control */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            isMuted
              ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/50'
          }`}
        >
          <span>{isMuted ? '🔇 Muted' : isSpeaking ? '🔊 Speaking...' : '🔊 Audio On'}</span>
        </button>
      </div>

      {/* Dynamic Scene Description Text */}
      <div className="min-h-[80px] flex items-center justify-center bg-slate-950/50 border border-slate-800/80 rounded-lg p-4">
        {isStreaming ? (
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {description || 'Analyzing scene context with Groq VLM...'}
          </p>
        ) : (
          <p className="text-xs text-slate-500 italic text-center">
            Start camera stream to activate automated scene narration and voice synthesis.
          </p>
        )}
      </div>

      {/* Latency Indicator Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Pipeline Mode: Dual (YOLO + Groq VLM)</span>
        <span className="font-mono text-slate-400">{latencyMs} ms</span>
      </div>
    </div>
  );
};