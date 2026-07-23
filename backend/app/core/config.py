import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EdgeInsight AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Model Configuration
    YOLO_MODEL_PATH: str = "yolov8n.pt"  # Lightweight nano model for low latency
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL_NAME: str = "llama-3.2-11b-vision-preview"

    class Config:
        case_sensitive = True

settings = Settings()