# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend & SPA Host
FROM python:3.11-slim

# Install system dependencies for OpenCV & PyTorch
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt-get/lists/*

# Install uv for fast python package management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app    

# Copy backend dependencies and install
COPY backend/pyproject.toml backend/uv.lock* ./
RUN uv sync --frozen --no-dev

# Copy backend source code
COPY backend/app ./app
COPY backend/yolov8n.pt ./yolov8n.pt

# Copy React build artifacts from Stage 1 into backend static directory
COPY --from=frontend-builder /frontend/dist ./app/static

# Hugging Face Spaces default port
EXPOSE 7860

# Run FastAPI backend via Uvicorn on 0.0.0.0:7860
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]