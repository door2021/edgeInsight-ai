from pydantic import BaseModel, Field
from typing import List, Optional

class InferenceRequest(BaseModel):
    image: str = Field(
        ..., 
        description="Base64 encoded JPEG/PNG frame captured from HTML5 canvas"
    )
    confidence_threshold: Optional[float] = Field(
        default=0.4, 
        ge=0.1, 
        le=1.0, 
        description="Minimum detection confidence score threshold (0.1 to 1.0)"
    )

class BoundingBox(BaseModel):
    x1: float = Field(..., description="Top-left X coordinate")
    y1: float = Field(..., description="Top-left Y coordinate")
    x2: float = Field(..., description="Bottom-right X coordinate")
    y2: float = Field(..., description="Bottom-right Y coordinate")

class DetectionItem(BaseModel):
    label: str = Field(..., description="Detected object class name")
    confidence: float = Field(..., description="Detection confidence score")
    box: List[float] = Field(..., description="Bounding box [x1, y1, x2, y2]")

class InferenceResponse(BaseModel):
    success: bool = True
    fps: float = Field(..., description="Processing speed in frames per second")
    latency_ms: float = Field(..., description="Inference latency in milliseconds")
    detections: List[DetectionItem] = Field(default_factory=list)
    narrative: Optional[str] = Field(
        default=None, 
        description="Natural language scene description from VLM"
    )