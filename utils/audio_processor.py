import yt_dlp
import os
import ffmpeg

DOWNLOAD_DIRECTORY = "downloads"

def download_youtube_audio(url: str) -> str:
    os.makedirs(DOWNLOAD_DIRECTORY, exist_ok=True)

    output_path = os.path.join(DOWNLOAD_DIRECTORY, "%(title)s.%(ext)s")

    ydl_opts = {
      "format": "bestaudio/best",
      "outtmpl": output_path,
      "postprocessors": [
        {
            "key": "FFmpegExtractAudio",
            "preferredcodec": "wav",
        }
      ],
      "extractor_args": {"youtube": {"js_runtimes": ["nodejs:/opt/homebrew/bin/node"]}},  # 
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        downloaded_file = ydl.prepare_filename(info)
        filename = os.path.splitext(downloaded_file)[0] + ".wav"

    return filename


def convert_to_wav(input_path: str) -> str:
    """Convert any audio/video file to mono 16kHz WAV using ffmpeg."""
    output_path = os.path.splitext(input_path)[0] + "_converted.wav"
    (
        ffmpeg
        .input(input_path)
        .output(output_path, ac=1, ar=16000)
        .overwrite_output()
        .run(quiet=True)
    )
    return output_path


def chunk_audio(wav_path: str, chunk_minutes: int = 10) -> list:
    """Split a WAV file into equal chunks, returns list of chunk file paths."""
    
    # Get total duration in seconds
    probe = ffmpeg.probe(wav_path)
    duration = float(probe["format"]["duration"])
    
    chunk_seconds = chunk_minutes * 60
    total_chunks = int(duration // chunk_seconds) + (1 if duration % chunk_seconds > 0 else 0)
    
    base = os.path.splitext(wav_path)[0]
    chunk_paths = []

    for i in range(total_chunks):
        start = i * chunk_seconds
        chunk_path = f"{base}_chunk{i+1}.wav"

        (
            ffmpeg
            .input(wav_path, ss=start, t=chunk_seconds)
            .output(chunk_path, ac=1, ar=16000)
            .overwrite_output()
            .run(quiet=True)
        )
        chunk_paths.append(chunk_path)

    return chunk_paths
    
def process_input(source: str) -> list:
    """Trigger function: handles YouTube URL or local file, returns list of WAV chunk paths."""
    
    if source.startswith("http://") or source.startswith("https://"):
        print("Detected YouTube URL. Downloading audio...")
        raw_path = download_youtube_audio(source)
        wav_path = convert_to_wav(raw_path)
    else:
        print("Detected local file. Converting to WAV...")
        wav_path = convert_to_wav(source)

    print("Chunking audio...")
    chunks = chunk_audio(wav_path)
    print(f"Audio ready - {len(chunks)} chunk(s) created.")
    
    return chunks