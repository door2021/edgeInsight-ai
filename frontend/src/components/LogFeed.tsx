import React from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'hazard' | 'system';
}

interface LogFeedProps {
  logs: LogEntry[];
}

export const LogFeed: React.FC<LogFeedProps> = ({ logs }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          System Activity Log
        </h3>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
          {logs.length} events
        </span>
      </div>

      {/* Scrolling Log Container */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 h-[120px] overflow-y-auto space-y-2 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-slate-600 italic text-center py-4">No recent activity</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-tight">
              <span className="text-slate-600 text-[10px] shrink-0 pt-0.5">{log.timestamp}</span>
              <span
                className={`shrink-0 text-[10px] px-1 rounded font-bold ${
                  log.type === 'hazard'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : log.type === 'system'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                [{log.type.toUpperCase()}]
              </span>
              <span className="text-slate-300 break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};