import time
import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.inference import InferenceRequest, InferenceResponse, DetectionItem
from app.core.vision import vision_service

logger = logging.getLogger("uvicorn.error")
router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Service health monitoring endpoint."""
    return {
        "status": "online",
        "yolo_loaded": vision_service.yolo_model is not None,
        "groq_enabled": vision_service.groq_client is not None,
    }

@router.post(
    "/inference",
    response_model=InferenceResponse,
    status_code=status.HTTP_200_OK,
    summary="Process Frame for Edge-Cloud Dual Pipeline"
)
async def process_inference_frame(payload: InferenceRequest):
    """
    Core dual-track endpoint:
    1. Decodes base64 payload into OpenCV image matrix.
    2. Runs high-speed local spatial YOLO detection.
    3. Runs contextual natural language reasoning via Groq VLM.
    """
    start_time = time.perf_counter()

    try:
        # 1. Decode base64 image
        frame = vision_service.decode_base64_image(payload.image)

        # 2. Track 1: Fast local YOLO inference
        raw_detections = vision_service.run_yolo_detection(
            frame, 
            conf_threshold=payload.confidence_threshold
        )
        
        formatted_detections = [
            DetectionItem(
                label=det["label"],
                confidence=det["confidence"],
                box=det["box"]
            )
            for det in raw_detections
        ]

        # 3. Track 2: Groq Cloud VLM Narrative
        narrative = vision_service.run_groq_vlm_narrative(payload.image)

        # Performance metrics
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        calculated_fps = 1000.0 / elapsed_ms if elapsed_ms > 0 else 0.0

        return InferenceResponse(
            success=True,
            fps=round(calculated_fps, 1),
            latency_ms=round(elapsed_ms, 1),
            detections=formatted_detections,
            narrative=narrative,
        )

    except ValueError as ve:
        logger.error(f"Validation error during inference: {str(ve)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unhandled inference exception: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal computer vision processing error"
        )