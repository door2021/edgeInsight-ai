import { useState } from 'react'
import './App.css'

import { Header } from './components/Header';
import { Viewport } from './components/Viewport';
import { type Detection } from './components/BoundingBoxOverlay';

// Mock detections to verify coordinate overlay rendering
const MOCK_DETECTIONS: Detection[] = [
  { label: 'person', confidence: 0.94, box: [120, 80, 320, 420] },
  { label: 'chair', confidence: 0.81, box: [380, 200, 580, 440] },
];

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

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col items-center justify-center gap-6">
        <Viewport
          isStreaming={isStreaming}
          detections={isStreaming ? MOCK_DETECTIONS : []}
        />
      </main>
    </div>
  );
};

export default App;