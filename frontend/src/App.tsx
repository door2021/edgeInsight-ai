import { useState } from 'react'
import './App.css'

import { Header } from './components/Header';

export const App: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Header
        isStreaming={isStreaming}
        onToggleStream={() => setIsStreaming(!isStreaming)}
        fps={isStreaming ? 24 : 0}
        latencyMs={isStreaming ? 42 : 0}
        systemStatus={isStreaming ? 'streaming' : 'idle'}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex items-center justify-center">
        <div className="text-center p-8 rounded-xl border border-slate-800 bg-slate-900/50">
          <p className="text-slate-400 text-sm">
            Header Section mounted successfully! Click <span className="text-emerald-400 font-semibold">Start Camera</span> above to toggle stream state.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;