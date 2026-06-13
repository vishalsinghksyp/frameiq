# FrameIQ — Frontend

A Next.js web app for analyzing YouTube videos and local files: paste a link or upload a file, watch live processing progress, then explore an AI-generated summary, key points, action items, decisions, and open questions — plus chat with the video using RAG.

## Tech Stack

- **Next.js 16** (App Router, JavaScript)
- **Tailwind CSS** — utility styling (global resets/animations)
- **react-markdown** — render LLM-generated markdown content
- **react-hot-toast** — toast notifications
- **lucide-react** — icons

## Project Structure

```
frontend/
├── app/
│   ├── page.js               # Main app — state, polling, layout
│   ├── layout.js             # Root layout, fonts, ThemeProvider, Toaster
│   └── globals.css           # Animations & markdown styles
├── components/
│   ├── InputForm.jsx          # YouTube URL / file upload with validation
│   ├── ProgressStages.jsx      # Live polling + animated stage cards
│   ├── ResultsTabs.jsx         # Tabbed results (Summary, Key Points, etc.)
│   ├── ChatInterface.jsx       # RAG-powered chat with the video
│   ├── Skeleton.jsx            # Shimmer loading placeholders
│   ├── ParticleField.jsx       # Animated floating background dots
│   ├── Explanation.jsx         # "How it works" + feature sections
│   ├── FAQ.jsx                 # FAQ accordion
│   └── Footer.jsx              # Credits & portfolio link
├── lib/
│   ├── api.js                  # Backend API wrappers
│   └── ThemeContext.js         # Dark/light mode context + provider
└── next.config.js
```

## Setup

### Prerequisites

- Node.js 18+
- Backend running (see backend README) at `http://localhost:8000`

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Features

- **Dual input modes** — YouTube URL (with validation) or local video/audio file upload
- **Async processing with live progress** — polls `/status/{job_id}` every 3s, animates through pipeline stages (Processing Audio → Transcribing → Translating → AI Analysis → Indexing)
- **Loading skeletons** — shimmer placeholders shown alongside progress stages
- **Tabbed results** — Summary, Key Points, Action Items, Decisions, Questions, Transcript — each markdown-rendered with a one-click copy button
- **RAG chat** — ask follow-up questions about the video; grounded in the transcript via vector search, with natural handling of greetings/small talk
- **Dark/light theme toggle** — persisted via `localStorage`
- **Animated particle background** — subtle floating dots across the page
- **"New Analysis" button** — reset state to process another video without reloading
- **FAQ accordion** + **"How it works" explanation** sections for landing-page context

## How It Works (User Flow)

```
1. User pastes a YouTube URL or uploads a file
   → POST /api/video/process-url or /process-file
   → receives { job_id }

2. Frontend polls GET /api/video/status/{job_id} every 3s
   → shows live stage progress + skeleton placeholders

3. On status: "done"
   → renders ResultsTabs with title, summary, key points, etc.
   → renders ChatInterface using session_id = job_id

4. User asks questions in chat
   → POST /api/video/ask { session_id, question }
   → grounded answer returned and rendered as markdown
```

## Theming

Theme state lives in `lib/ThemeContext.js` (React Context + localStorage). All components accept a `dark` boolean prop (default `true`) and use a shared helper:

```javascript
const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);
```

Toggle the theme via the sun/moon button in the header.

## Deployment

Designed to deploy on **Vercel**:

```bash
vercel
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL (e.g. Render) in Vercel's environment variables.

Ensure the backend's CORS config (`main.py`) includes your deployed frontend's origin.

## Credits

Built by Vishal Singh · Next.js + FastAPI + Mistral AI + faster-whisper
