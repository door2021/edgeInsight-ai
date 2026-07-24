import { useCallback, useRef, useState } from 'react'
import './App.css'

import { Header } from './components/Header';
import { Viewport } from './components/Viewport';
import { type Detection } from './components/BoundingBoxOverlay';
import { LogFeed, type LogEntry } from './components/LogFeed';
import { InsightPanel } from './components/InsightPanel';
import { sendFrameForInference } from './services/api';

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
  const [detections, setDetections] = useState<Detection[]>([]);
  const [narrative, setNarrative] = useState<string>('');
  const [fps, setFps] = useState<number>(0);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Prevent overlapping in-flight API calls
  const isProcessingRef = useRef<boolean>(false);

  const lastVlmCallRef = useRef<number>(0);

  const addLog = (message: string, type: 'info' | 'hazard' | 'system') => {
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 14)]); // Keep max 15 logs
  };

  const handleToggleStream = () => {
    const nextState = !isStreaming;
    setIsStreaming(nextState);
    if (!nextState) {
      setDetections([]);
      setNarrative('');
      setFps(0);
      setLatencyMs(0);
      addLog('Stream stopped by user.', 'system');
    } else {
      addLog('Camera stream initialized. Connecting to FastAPI...', 'system');
    }
  };

  const handleFrameCaptured = useCallback(async (base64Frame: string) => {
    const now = Date.now();
    // Only trigger backend full VLM if 3 seconds have passed since last call
    if (now - lastVlmCallRef.current < 3000) return;

    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    lastVlmCallRef.current = now;

    try {
      const response = await sendFrameForInference(base64Frame);

      if (response.success) {
        setDetections(response.detections);
        setFps(response.fps);
        setLatencyMs(response.latency_ms);
        if (response.narrative) {
          setNarrative(response.narrative);
        }

        // Check if any hazard items are detected
        const hazards = response.detections.filter((d) =>
          ['person', 'car', 'bus', 'truck'].includes(d.label.toLowerCase())
        );

        if (hazards.length > 0) {
          const labels = hazards.map((h) => h.label).join(', ');
          addLog(`Hazard detected in frame: ${labels}`, 'hazard');
        }
      }
    } catch (err) {
      console.error('Inference Error:', err);
      addLog('Inference frame processing failed', 'system');
    } finally {

      // 3. Always release the processing lock
      isProcessingRef.current = false;

    }
  }, []);

  // const handleFrameCaptured = useCallback(
  //   async (base64Frame: string) => {
  //     if (isProcessingRef.current) return; // Skip if previous frame is still processing
  //     isProcessingRef.current = true;

  //     try {
  //       const response = await sendFrameForInference(base64Frame);

  //       if (response.success) {
  //         setDetections(response.detections);
  //         setFps(response.fps);
  //         setLatencyMs(response.latency_ms);
  //         if (response.narrative) {
  //           setNarrative(response.narrative);
  //         }

  //         // Check if any hazard items are detected
  //         const hazards = response.detections.filter((d) =>
  //           ['person', 'car', 'bus', 'truck'].includes(d.label.toLowerCase())
  //         );

  //         if (hazards.length > 0) {
  //           const labels = hazards.map((h) => h.label).join(', ');
  //           addLog(`Hazard detected in frame: ${labels}`, 'hazard');
  //         }
  //       }
  //     } catch (err) {
  //       console.error('Inference Error:', err);
  //       addLog('Inference frame processing failed', 'system');
  //     } finally {
  //       isProcessingRef.current = false;
  //     }
  //   },
  //   []
  // );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Header
        isStreaming={isStreaming}
        onToggleStream={handleToggleStream}
        fps={fps}
        latencyMs={latencyMs}
        systemStatus={isStreaming ? 'streaming' : 'idle'}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-center">
          <Viewport
            isStreaming={isStreaming}
            detections={detections}
            onFrameCaptured={handleFrameCaptured}
          />
        </div>

        <div className="flex flex-col gap-6 justify-center">
          <InsightPanel
            description={narrative}
            isStreaming={isStreaming}
            latencyMs={latencyMs}
          />

          <LogFeed logs={logs} />
        </div>
      </main>
    </div>
  );
};

export default App;