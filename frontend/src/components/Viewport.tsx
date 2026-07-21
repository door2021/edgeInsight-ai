import React, { useEffect, useRef } from 'react';
import { BoundingBoxOverlay, type Detection } from './BoundingBoxOverlay';

interface ViewportProps {
  isStreaming: boolean;
  detections: Detection[];
  onFrameCapture?: (base64Image: string) => void;
}

export const Viewport: React.FC<ViewportProps> = ({
  isStreaming,
  detections,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize or terminate the webcam stream cleanly
  useEffect(() => {
    if (!isStreaming) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480, frameRate: 30 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Webcam Access Error:', err);
      });
  }, [isStreaming]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
      {/* Hidden processing canvas used for frame sampling */}
      <canvas ref={canvasRef} width="640" height="480" className="hidden" />

      {/* HTML5 Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isStreaming ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Declarative Bounding Box Layer */}
      {isStreaming && <BoundingBoxOverlay detections={detections} />}

      {/* Idle / Offline Viewport Placeholder */}
      {!isStreaming && (
        <div className="absolute flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="h-12 w-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl">
            📷
          </div>
          <p className="text-sm font-medium">Camera Stream Offline</p>
          <p className="text-xs text-slate-600">
            Click <span className="text-emerald-400 font-semibold">Start Camera</span> to initialize edge processing
          </p>
        </div>
      )}
    </div>
  );
};