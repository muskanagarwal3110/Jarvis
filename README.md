<div align="center">

# 🌍 AI Trip Planner

**An agentic travel planning assistant that researches, budgets, and writes your itinerary - then hands you a PDF.**

Ask it where you want to go. It figures out the rest.

</div>

---

## What this is

AI Trip Planner is a conversational agent built on **LangGraph** and **Groq**-hosted LLMs. Instead of hallucinating an itinerary from memory, the agent has real tools at its disposal - live weather, place search, currency conversion, and budgeting - and decides for itself which ones to call, in what order, to answer your request.

You type: *"plan a 2 day trip to manali"*
It researches attractions, restaurants, activities, transport, checks the weather, does the math on your budget, and writes it all up — downloadable as a clean PDF.

---

## How it works

```
 You ask a question
        │
        ▼
 ┌─────────────────┐        ┌──────────────────────────┐
 │  React frontend │──POST─▶│   FastAPI backend         │
 │  (chat UI)      │◀───────│   /query                  │
 └─────────────────┘        └──────────────┬────────────┘
                                            │
                                            ▼
                              ┌─────────────────────────┐
                              │   LangGraph Agent        │
                              │   (Groq LLM + tools)      │
                              └─────────────┬─────────────┘
                                            │
              ┌───────────────┬────────────┼────────────┬───────────────┐
              ▼               ▼            ▼            ▼               ▼
          Weather        Place Search   Currency     Calculator     (loops back
          Tool           (Google/Tavily) Converter    Tool          to agent until
                                                                     done)
```

The agent runs in a loop: think → decide if a tool is needed → call it → read the result → repeat, until it has enough to answer. This is what "agentic" means here — the model is doing the planning, not just following a script.

---

## Tech stack

| Layer | Technology |
|---|---|
| **Agent orchestration** | LangGraph — builds the think/act loop as a state graph |
| **LLM inference** | Groq (via LangChain) — fast, free-tier-friendly inference |
| **Backend API** | FastAPI + Uvicorn |
| **Frontend** | React + TypeScript + Tailwind CSS (Vite) |
| **PDF generation** | xhtml2pdf + markdown |
| **Packaging** | uv (backend), npm (frontend) |
| **Containerization** | Docker + Docker Compose |

---

## Getting started

### Prerequisites

- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Node.js 20+
- API keys for: **Groq**, **OpenWeatherMap**, **Google Places**, **Tavily**, **ExchangeRate-API**

### 1 · Backend

```bash
cd ai-service_backend
cp .env.example .env      # add your API keys
uv run uvicorn main:app --reload --port 8000
```

### 2 · Frontend

```bash
cd frontend
cp .env.example .env      
npm install
npm run dev
```

---

## Running with Docker

No local Python or Node setup required — just Docker.

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |

Stop everything with `docker compose down`.

---

## Environment variables

### `ai-service_backend/.env`

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | LLM inference via Groq |
| `OPENWEATHERMAP_API_KEY` | Weather data |
| `GPLACES_API_KEY` | Google Places search |
| `TAVILY_API_KEY` | Fallback place/web search |
| `EXCHANGE_RATE_API_KEY` | Currency conversion |
| `FRONTEND_URL` | Allowed CORS origin (default `http://localhost:5173`) |

### `frontend/.env`

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (default `http://localhost:8000`) |

---

<div align="center">

Built with LangGraph, Groq, FastAPI, and React.

</div>
