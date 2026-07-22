import { useState } from 'react'
import './App.css'

import { Header } from './components/Header';
import { Viewport } from './components/Viewport';
import { type Detection } from './components/BoundingBoxOverlay';
import { LogFeed, type LogEntry } from './components/LogFeed';
import { InsightPanel } from './components/InsightPanel';

// Mock detections to verify coordinate overlay rendering
const MOCK_DETECTIONS: Detection[] = [
  { label: 'person', confidence: 0.94, box: [120, 80, 320, 420] },
  { label: 'chair', confidence: 0.81, box: [380, 200, 580, 440] },
];

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '12:00:01', message: 'Camera stream initialized.', type: 'system' },
  { id: '2', timestamp: '12:00:02', message: 'YOLOv8 weights loaded locally.', type: 'info' },
  { id: '3', timestamp: '12:00:03', message: 'Detected hazard: Person in proximity.', type: 'hazard' },
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

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-center">
          <Viewport
            isStreaming={isStreaming}
            detections={isStreaming ? MOCK_DETECTIONS : []}
          />
          </div>
        {/* Right / Bottom Column: Telemetry & Groq Insight Panels */}
        <div className="flex flex-col gap-6 justify-center">
          <InsightPanel
            description={
              isStreaming
                ? 'A person is seated near an office chair in a brightly lit indoor space.'
                : ''
            }
            isStreaming={isStreaming}
            latencyMs={isStreaming ? 240 : 0}
          />

          <LogFeed logs={isStreaming ? MOCK_LOGS : []} />
        </div>
      </main>
    </div>
  );
};

export default App;