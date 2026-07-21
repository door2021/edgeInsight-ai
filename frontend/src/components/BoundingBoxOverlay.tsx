import React from 'react';

export interface Detection {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
}

interface BoundingBoxOverlayProps {
  detections: Detection[];
  frameWidth?: number;
  frameHeight?: number;
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  detections,
  frameWidth = 640,
  frameHeight = 480,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {detections.map((det, index) => {
        const [x1, y1, x2, y2] = det.box;

        // Calculate relative percentages for responsive scaling
        const left = (x1 / frameWidth) * 100;
        const top = (y1 / frameHeight) * 100;
        const width = ((x2 - x1) / frameWidth) * 100;
        const height = ((y2 - y1) / frameHeight) * 100;

        // Color coding based on hazard categories
        const isHazard = ['car', 'bus', 'truck', 'person'].includes(
          det.label.toLowerCase()
        );

        return (
          <div
            key={`${det.label}-${index}`}
            className={`absolute border-2 transition-all duration-75 rounded ${
              isHazard
                ? 'border-rose-500 bg-rose-500/10'
                : 'border-emerald-400 bg-emerald-400/10'
            }`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            {/* Label Tag */}
            <div
              className={`absolute -top-6 left-0 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded-t ${
                isHazard
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {det.label.toUpperCase()} {(det.confidence * 100).toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};