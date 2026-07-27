import type { Detection } from '../components/BoundingBoxOverlay';

const API_BASE_URL = import.meta.env.PROD 
  ? '/api/v1' 
  : 'http://localhost:8000/api/v1';

export interface InferenceResponse {
  success: boolean;
  fps: number;
  latency_ms: number;
  detections: Detection[];
  narrative?: string;
}

export async function sendFrameForInference(
  base64Image: string,
  confidenceThreshold = 0.4
): Promise<InferenceResponse> {
  const response = await fetch(`${API_BASE_URL}/inference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      confidence_threshold: confidenceThreshold,
    }),
  });

  if (!response.ok) {
    throw new Error(`Inference API failed with status ${response.status}`);
  }

  return response.json();
}