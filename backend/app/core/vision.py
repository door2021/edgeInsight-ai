import base64
import logging
from urllib import response
import cv2
import numpy as np
import re
from ultralytics import YOLO
from groq import Groq
from .config import settings

logger = logging.getLogger("uvicorn.error")

class VisionService:
    """
    Singleton class managing ML inference pipelines.
    Guarantees models are loaded ONCE during application startup.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VisionService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        logger.info(f"Loading YOLO model from: {settings.YOLO_MODEL_PATH}")
        # Initialize YOLOv8 object detector
        self.yolo_model = YOLO(settings.YOLO_MODEL_PATH)
        
        # Initialize Groq Cloud Client
        self.groq_client = None
        if settings.GROQ_API_KEY:
            logger.info("Initializing Groq API Client")
            self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        else:
            logger.warning("GROQ_API_KEY not found. VLM narrative track will be disabled.")

    @staticmethod
    def decode_base64_image(base64_str: str) -> np.ndarray:
        """
        Converts Base64 data URL string into an OpenCV (BGR) NumPy array.
        """
        try:
            # Strip data URL prefix if present (e.g., 'data:image/jpeg;base64,')
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]

            image_data = base64.b64decode(base64_str)
            np_arr = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                raise ValueError("Decoded image frame is None")

            return frame
        except Exception as e:
            logger.error(f"Image decoding failed: {str(e)}")
            raise ValueError("Invalid base64 image encoding")

    def run_yolo_detection(self, frame: np.ndarray, conf_threshold: float = 0.4):
        """
        Performs fast local spatial object detection using YOLOv8.
        Returns list of structured detections: [{'label': str, 'confidence': float, 'box': [x1, y1, x2, y2]}]
        """
        results = self.yolo_model(frame, conf=conf_threshold, verbose=False)[0]
        detections = []

        for box in results.boxes:
            coords = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = self.yolo_model.names[cls_id]

            detections.append({
                "label": label,
                "confidence": round(conf, 2),
                "box": [round(c, 1) for c in coords]
            })

        return detections

    def run_groq_vlm_narrative(self, base64_image: str) -> str:
        """
        Calls Groq VLM for contextual natural language scene description.
        """
        if not self.groq_client:
            return "Groq VLM disabled (API Key missing)."

        try:
            # Format base64 string for Groq visual input payload
            formatted_image_url = f"data:image/jpeg;base64,{base64_image.split(',')[-1]}"

            response = self.groq_client.chat.completions.create(
                model=settings.GROQ_MODEL_NAME,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Provide a concise, 1-2 sentence real-time safety narration describing this scene. Highlight hazards or key activities."
                            },
                            {
                                "type": "image_url",
                                "image_url": {"url": formatted_image_url}
                            }
                        ]
                    }
                ],
                max_tokens=200,
                temperature=0.2,
                extra_body={
                    "reasoning_format": "hidden", # Suppresses <think> tags from Groq API output
                    "reasoning_effort": "none"   # Disables reasoning mode for fast direct outputs
                }
            )
            raw_content = response.choices[0].message.content.strip()

            # Clean out <think>...</think> reasoning blocks if present
            clean_content = re.sub(r'<think>.*?</think>', '', raw_content, flags=re.DOTALL).strip()
            return clean_content if clean_content else "Scene analyzed."
        except Exception as e:
            logger.error(f"Groq VLM API Error: {str(e)}")
            return "VLM narrative temporarily unavailable."

# Global Singleton Service Accessor
vision_service = VisionService()