from faster_whisper import WhisperModel
import os

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small")

_model = None

def load_model() -> WhisperModel:
    global _model
    if _model is None:
        print(f"Loading Faster-Whisper model: '{WHISPER_MODEL}'...")
        _model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
        print("Model loaded successfully.")
    return _model


def transcribe_chunk(chunk_path: str, translate: bool = False, language: str = None) -> str:
    model = load_model()
    task = "translate" if translate else "transcribe"
    segments, info = model.transcribe(
        chunk_path,
        task=task,
        language=language,
        beam_size=5,
        vad_filter=True,        # skips silence/noise/music sections
        vad_parameters=dict(min_silence_duration_ms=500)
    )
    print(f"  Detected language: {info.language} ({info.language_probability:.0%})")
    return " ".join(segment.text.strip() for segment in segments)


def transcribe_all(chunks: list, translate: bool = False, language: str = None) -> str:
    full_transcript = []

    for i, chunk in enumerate(chunks):
        print(f"Transcribing chunk {i+1}/{len(chunks)}...")
        text = transcribe_chunk(chunk, translate=translate, language=language)
        full_transcript.append(text)

    print("Transcription completed.")
    return "\n".join(full_transcript)