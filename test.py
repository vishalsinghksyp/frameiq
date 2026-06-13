import os
from dotenv import load_dotenv
load_dotenv()
import time

from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.translator import translate_to_english
from core.summarize import summarize, generate_title, extract_key_points
from core.extractor import extract_action_items, extract_key_decisions, extract_questions
from core.rag_engine import build_rag_chain, ask_question

SOURCE = "https://youtu.be/6FNRVY2vYXw"
os.makedirs("outputs", exist_ok=True)

RAW_PATH = "outputs/transcript_raw.txt"
EN_PATH = "outputs/transcript_en.txt"
SUMMARY_PATH = "outputs/summary.txt"

# Step 1 & 2: Audio + Transcribe (skip both if raw transcript exists)
print("\n" + "="*50)
print("STEP 1 & 2: Audio + Transcription")
print("="*50)
if os.path.exists(RAW_PATH):
    print("⏭️  Found existing raw transcript, skipping audio + transcription...")
    with open(RAW_PATH, "r", encoding="utf-8") as f:
        transcript_raw = f.read()
else:
    chunks = process_input(SOURCE)
    transcript_raw = transcribe_all(chunks)
    with open(RAW_PATH, "w", encoding="utf-8") as f:
        f.write(transcript_raw)
    print("✅ Raw transcript saved.")

# Step 3: Translate
print("\n" + "="*50)
print("STEP 3: Translating to English")
print("="*50)
if os.path.exists(EN_PATH):
    print("⏭️  Found existing English transcript, skipping...")
    with open(EN_PATH, "r", encoding="utf-8") as f:
        transcript_en = f.read()
else:
    transcript_en = translate_to_english(transcript_raw)
    with open(EN_PATH, "w", encoding="utf-8") as f:
        f.write(transcript_en)
    print("✅ English transcript saved.")

# Step 4: LLM Processing


# Step 4: LLM Processing
print("\n" + "="*50)
print("STEP 4: LLM Processing")
print("="*50)
if os.path.exists(SUMMARY_PATH):
    print("⏭️  Found existing summary, skipping...")
else:
    def safe_call(func, *args, **kwargs):
        """Call LLM function with retry on rate limit."""
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

    title        = safe_call(generate_title, transcript_en)
    time.sleep(5)
    key_points   = safe_call(extract_key_points, transcript_en)
    time.sleep(5)
    summary      = safe_call(summarize, transcript_en)
    time.sleep(5)
    action_items = safe_call(extract_action_items, transcript_en)
    time.sleep(5)
    decisions    = safe_call(extract_key_decisions, transcript_en)
    time.sleep(5)
    questions    = safe_call(extract_questions, transcript_en)

    with open(SUMMARY_PATH, "w", encoding="utf-8") as f:
        f.write(f"TITLE:\n{title}\n\n")
        f.write(f"KEY POINTS:\n{key_points}\n\n")
        f.write(f"SUMMARY:\n{summary}\n\n")
        f.write(f"ACTION ITEMS:\n{action_items}\n\n")
        f.write(f"DECISIONS:\n{decisions}\n\n")
        f.write(f"QUESTIONS:\n{questions}\n\n")
    print("✅ Summary saved.")
    print(f"\nTITLE: {title}\n")

# Step 5: Build vectorstore
print("\n" + "="*50)
print("STEP 5: Building Vector Store")
print("="*50)
rag_chain = build_rag_chain(transcript_en)

# Step 6: Test Q&A
print("\n" + "="*50)
print("STEP 6: Testing RAG Q&A")
print("="*50)
ask_question(rag_chain, "What is this video about?")
ask_question(rag_chain, "What are the main topics discussed?")

print("\n" + "="*50)
print("✅ ALL STEPS COMPLETE")
print("="*50)