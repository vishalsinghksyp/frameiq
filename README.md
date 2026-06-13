---
title: FrameIQ Backend
emoji: 🎬
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# FrameIQ — Backend

AI-powered video analysis pipeline: turn any YouTube video or local video/audio file into a transcript, English translation, structured summary (title, key points, action items, decisions, open questions), and a chat-ready RAG knowledge base.

## Tech Stack

- **FastAPI** — async REST API with background job processing
- **yt-dlp** — YouTube audio extraction
- **ffmpeg-python** — audio conversion & chunking
- **faster-whisper** — local, multilingual speech-to-text
- **Mistral AI** (via LangChain) — translation, summarization, extraction, RAG chat
- **ChromaDB** + **HuggingFace embeddings** — vector store for semantic search
- **uv** — package management

## Project Structure

```
FrameIQ/
├── utils/
│   └── audio_processor.py     # YouTube download, audio conversion, chunking
├── core/
│   ├── llm.py                 # Mistral LLM config
│   ├── transcriber.py         # faster-whisper transcription
│   ├── translator.py          # Mistral-based translation to English
│   ├── summarize.py           # title, summary, key points
│   ├── extractor.py           # action items, decisions, open questions
│   ├── vector_store.py        # ChromaDB setup
│   ├── rag_engine.py          # RAG chat chain
│   └── job_manager.py         # in-memory job/status tracking
├── routes/
│   └── video.py               # API endpoints
├── main.py                     # FastAPI app entry point
└── pyproject.toml
```

## Pipeline Flow

```
YouTube URL / Local file
    ↓
Audio extraction & chunking (ffmpeg)
    ↓
Transcription (faster-whisper) — any language
    ↓
Translation to English (Mistral)
    ↓
LLM Processing (Mistral):
    - Title generation
    - Key points extraction
    - Summary (map-reduce over chunks)
    - Action items / Decisions / Open questions
    ↓
Vector store indexing (ChromaDB)
    ↓
Ready for RAG-based Q&A
```

## Setup

### Prerequisites

- Python 3.14+
- `uv` package manager
- `ffmpeg` installed (`brew install ffmpeg` on macOS)
- Node.js (for yt-dlp's JS runtime requirement)

### Installation

```bash
uv sync
```

### Environment Variables

Create a `.env` file in the project root:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
WHISPER_MODEL=small
```

- `MISTRAL_API_KEY` — get a free key at [console.mistral.ai](https://console.mistral.ai)
- `WHISPER_MODEL` — `tiny`, `base`, `small`, `medium`, or `large` (default: `small`)

### Run the server

```bash
uv run uvicorn main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

## API Endpoints

### `POST /api/video/process-url`

Start processing a YouTube video (async).

**Request:**

```json
{ "url": "https://youtu.be/VIDEO_ID" }
```

**Response:**

```json
{ "job_id": "uuid-string", "status": "pending" }
```

### `POST /api/video/process-file`

Start processing an uploaded video/audio file (async).

**Request:** `multipart/form-data` with `file` field

**Response:**

```json
{ "job_id": "uuid-string", "status": "pending" }
```

### `GET /api/video/status/{job_id}`

Poll for job progress and results.

**Response (in progress):**

```json
{
  "status": "processing",
  "step": "transcribing",
  "result": null,
  "error": null
}
```

**Response (done):**

```json
{
  "status": "done",
  "step": "complete",
  "result": {
    "session_id": "uuid-string",
    "transcript": "...",
    "title": "...",
    "summary": "...",
    "key_points": "...",
    "action_items": "...",
    "decisions": "...",
    "questions": "..."
  },
  "error": null
}
```

**Pipeline steps (`step` values):**

```
processing_audio → transcribing → translating → generating_title
→ extracting_key_points → summarizing → extracting_action_items
→ extracting_decisions → extracting_questions → building_vector_store → complete
```

### `POST /api/video/ask`

Ask a question about a processed video (RAG).

**Request:**

```json
{ "session_id": "uuid-string", "question": "What is this video about?" }
```

**Response:**

```json
{ "answer": "..." }
```

## Notes

- **Rate limiting:** LLM calls include automatic retry with backoff for Mistral's free-tier rate limits (429 errors).
- **Multilingual support:** Whisper auto-detects the source language; transcripts are translated to English before any LLM processing.
- **Session storage:** RAG chains are stored in-memory (`rag_sessions` dict) — lost on server restart. For production, consider Redis or a persistent vector store.
- **CORS:** configured for `http://localhost:3000` (Next.js dev server) in `main.py`.

## Known Limitations

- Long videos (1hr+) can take 5-15 minutes to fully process due to CPU-bound transcription and rate-limited LLM calls.
- In-memory job store means jobs are lost on server restart.
