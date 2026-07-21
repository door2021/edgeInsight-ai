import React from 'react';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  isStreaming: boolean;
  onToggleStream: () => void;
  fps: number;
  latencyMs: number;
  systemStatus: 'idle' | 'streaming' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  isStreaming,
  onToggleStream,
  fps,
  latencyMs,
  systemStatus,
}) => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            👁️
          </div>
          <div>
            <h1 className="text-lg font-bold !text-white tracking-tight leading-none">
              EdgeInsight <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Hybrid Edge-Cloud Assistive Vision Engine
            </p>
          </div>
        </div>

        {/* Live Telemetry Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <StatusBadge
            label="System"
            value={systemStatus.toUpperCase()}
            variant={
              systemStatus === 'streaming'
                ? 'success'
                : systemStatus === 'error'
                ? 'error'
                : 'neutral'
            }
            pulse={systemStatus === 'streaming'}
          />
          <StatusBadge
            label="FPS"
            value={isStreaming ? fps : 0}
            variant={fps > 15 ? 'success' : fps > 5 ? 'warning' : 'neutral'}
          />
          <StatusBadge
            label="Latency"
            value={isStreaming ? `${latencyMs}ms` : '--'}
            variant={latencyMs < 100 ? 'success' : latencyMs < 300 ? 'warning' : 'error'}
          />
        </div>

        {/* Primary Stream Toggle CTA Button */}
        <div>
          <button
            onClick={onToggleStream}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-black/20 ${
              isStreaming
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-semibold'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-rose-400 animate-pulse' : 'bg-slate-950'}`} />
            {isStreaming ? 'Stop Stream' : 'Start Camera'}
          </button>
        </div>

      </div>
    </header>
  );
};