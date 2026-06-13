from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import video


app = FastAPI(title="Video Agent API")

# Allow Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video.router, prefix="/api/video")

@app.get("/")
def root():
    return {"status": "Video Agent API running"}