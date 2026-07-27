import logging
from contextlib import asynccontextmanager
import os
import gradio as gr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.vision import vision_service
from app.api.routes import router as api_router

logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Modern FastAPI Lifespan Handler:
    Triggers startup initialization (pre-warming YOLO) and graceful shutdown.
    """
    logger.info("Initializing EdgeInsight AI Engine...")
    _ = vision_service  # Triggers Singleton instantiation on boot
    yield
    logger.info("Shutting down EdgeInsight AI Engine cleanly.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Enterprise CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production environment as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve React static assets in production if dist directory exists
static_dir = os.path.join(os.path.dirname(__file__), "static")

if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API calls to pass through
        if full_path.startswith("api/"):
            return None
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))

# Create Gradio interface and mount FastAPI
with gr.Blocks(title="EdgeInsight AI") as demo:
    gr.Markdown("# EdgeInsight AI Dashboard")
    gr.HTML('<iframe src="/index.html" style="width:100%; height:800px; border:none;"></iframe>')

# Mount the FastAPI app onto Gradio
app = gr.mount_gradio_app(app, demo, path="/")    

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)