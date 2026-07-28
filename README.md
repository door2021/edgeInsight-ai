# 👁️ EdgeInsight AI

> **Hybrid Edge-Cloud Computer Vision & Contextual Safety Narration System**  
> Sub-30ms local spatial object detection paired with cloud multimodal scene reasoning and browser-native voice synthesis.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Groq](https://img.shields.io/badge/Groq_Cloud-F05032?style=for-the-badge&logo=git&logoColor=white)](https://groq.com/)

---

## 📸 Screenshots & Demo

<div align="center">
<p><b>Live Dashboard View</b></p>
<img src="docs/screenshots/dashboard-main.png" alt="EdgeInsight AI Main Dashboard" width="850px"/>
</div>

<br/>

<div align="center">

| Spatial Detection & Overlays | Real-Time Scene Narration |
|------------------------------|---------------------------|
| <img width="1510" height="785" alt="Screenshot 2026-07-28 at 4 43 45 PM" src="https://github.com/user-attachments/assets/0bc9a54b-093e-42f3-9dc6-e951fe4a46e1" />
 | <img width="1510" height="785" alt="Screenshot 2026-07-28 at 4 45 03 PM" src="https://github.com/user-attachments/assets/d4c9f416-2144-48c9-842f-b6ec1e6c55cb" />
 |

</div>

---

## 🌟 Overview

**EdgeInsight AI** is a full-stack, edge-cloud computer vision application designed for real-time video stream analysis and accessible hazard alerts.

By combining low-latency local inference (**YOLOv8**) with high-level cloud reasoning (**Groq VLM**), the platform provides both precise bounding-box spatial tracking and contextual natural language safety descriptions—spoken aloud in real time using native browser text-to-speech.

### ✨ Key Features

- ⚡ Hybrid Vision Engine
- 🗣️ Automated Voice Alerts
- 🧠 Reasoning Suppression
- 🛡️ Rate-Guard Sampling
- 📊 Live System Metrics
- 🐳 Dockerized with GitHub Actions CI/CD

---

## 🏗️ Architecture Design

```text
┌─────────────────────────────────────────┐
│         React 19 Frontend (SPA)         │
│  - Webcam Frame Sampler (5 FPS)         │
│  - Rate Limit Throttle Guard (3s VLM)   │
│  - Web Speech API Synthesis Engine      │
└────────────────────┬────────────────────┘
                     │
             Base64 Frame Payload
                     │
                     ▼
┌───────────────────────────────────────────────────────────────┐
│                   FastAPI Backend Engine                      │
│                                                               │
│  ┌────────────────────────┐  ┌─────────────────────────────┐  │
│  │ Local Edge (YOLOv8)    │  │ Cloud Vision (Groq VLM)     │  │
│  │ • Bounding Boxes       │  │ • Scene Narration           │  │
│  │ • Confidence Scores    │  │ • Regex Cleanup             │  │
│  │ • Sub-30ms Latency     │  │ • Safety Alerts             │  │
│  └────────────────────────┘  └─────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite, Web Speech API
- **Backend:** FastAPI, Python 3.11, Ultralytics YOLOv8, PyTorch, Pydantic v2
- **AI Models:** YOLOv8 Nano (`yolov8n.pt`), Groq VLM (`qwen/qwen3.6-27b`)
- **Tooling:** uv, Node.js, npm
- **DevOps:** Docker, GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- uv
- Node.js 20+
- npm
- Groq API Key

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/EdgeInsight-AI.git
cd EdgeInsight-AI
```

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🐳 Docker

```bash
docker build -t edgeinsight-ai .
docker run -p 7860:7860 -e GROQ_API_KEY="your_groq_api_key" edgeinsight-ai
```

Visit: http://localhost:7860

## ⚙️ Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Backend `.env` / Docker | Groq API key |
| `GROQ_MODEL_NAME` | `backend/app/core/config.py` | Default: `qwen/qwen3.6-27b` |
| `YOLO_MODEL_PATH` | `backend/app/core/config.py` | Default: `yolov8n.pt` |
