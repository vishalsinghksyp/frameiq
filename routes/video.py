from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
import os
import shutil
import time
import traceback

from utils.audio_processor import process_input, get_youtube_transcript
from core.transcriber import transcribe_all
from core.translator import translate_to_english
from core.summarize import summarize, generate_title, extract_key_points
from core.extractor import extract_action_items, extract_key_decisions, extract_questions
from core.rag_engine import build_rag_chain, ask_question
from core.job_manager import create_job, update_job, get_job, JobStatus

router = APIRouter()
rag_sessions = {}


def safe_call(func, *args, **kwargs):
    for attempt in range(5):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if "429" in str(e) or "rate_limited" in str(e):
                wait = 10 * (attempt + 1)
                print(f"  ⚠️  Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise Exception("Failed after 5 retries")


def run_pipeline(job_id: str, source: str, is_file: bool = False):
    """The actual pipeline — runs in background."""
    try:
        update_job(job_id, status=JobStatus.PROCESSING, step="processing_audio")

        transcript_raw = None

        # For YouTube URLs: try captions first (fast, no audio download needed)
        if not is_file:
            transcript_raw = get_youtube_transcript(source)

        if transcript_raw is None:
            # Fallback: download audio + whisper transcription
            chunks = process_input(source)
            update_job(job_id, step="transcribing")
            transcript_raw = transcribe_all(chunks)

        update_job(job_id, step="translating")
        transcript_en = translate_to_english(transcript_raw)

        update_job(job_id, step="generating_title")
        title = safe_call(generate_title, transcript_en)
        time.sleep(3)

        update_job(job_id, step="extracting_key_points")
        key_points = safe_call(extract_key_points, transcript_en)
        time.sleep(3)

        update_job(job_id, step="summarizing")
        summary = safe_call(summarize, transcript_en)
        time.sleep(3)

        update_job(job_id, step="extracting_action_items")
        action_items = safe_call(extract_action_items, transcript_en)
        time.sleep(3)

        update_job(job_id, step="extracting_decisions")
        decisions = safe_call(extract_key_decisions, transcript_en)
        time.sleep(3)

        update_job(job_id, step="extracting_questions")
        questions = safe_call(extract_questions, transcript_en)

        update_job(job_id, step="building_vector_store")
        rag_chain = build_rag_chain(transcript_en)
        rag_sessions[job_id] = rag_chain

        update_job(
            job_id,
            status=JobStatus.DONE,
            step="complete",
            result={
                "session_id": job_id,
                "transcript": transcript_en,
                "title": title,
                "summary": summary,
                "key_points": key_points,
                "action_items": action_items,
                "decisions": decisions,
                "questions": questions,
            }
        )

    except Exception as e:
        traceback.print_exc()
        update_job(job_id, status=JobStatus.FAILED, error=str(e))


class URLRequest(BaseModel):
    url: str


class QuestionRequest(BaseModel):
    session_id: str
    question: str


@router.post("/process-url")
def process_url(request: URLRequest, background_tasks: BackgroundTasks):
    job_id = create_job()
    background_tasks.add_task(run_pipeline, job_id, request.url, False)
    return {"job_id": job_id, "status": "pending"}


@router.post("/process-file")
def process_file(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    job_id = create_job()
    background_tasks.add_task(run_pipeline, job_id, file_path, True)
    return {"job_id": job_id, "status": "pending"}


@router.get("/status/{job_id}")
def get_status(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/ask")
def ask(request: QuestionRequest):
    rag_chain = rag_sessions.get(request.session_id)
    if not rag_chain:
        raise HTTPException(status_code=404, detail="Session not found or still processing.")

    answer = ask_question(rag_chain, request.question)
    return {"answer": answer}