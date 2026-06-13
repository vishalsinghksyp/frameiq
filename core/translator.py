from deep_translator import GoogleTranslator
import time


def translate_to_english(text: str) -> str:
    """Translate any language to English, handles Google's limits with retries."""
    max_chunk = 2000  # smaller, safer chunks
    chunks = [text[i:i+max_chunk] for i in range(0, len(text), max_chunk)]

    translated = []
    for i, chunk in enumerate(chunks):
        print(f"Translating chunk {i+1}/{len(chunks)}...")

        for attempt in range(3):
            try:
                result = GoogleTranslator(source='auto', target='english').translate(chunk)
                translated.append(result)
                break
            except Exception as e:
                print(f"  ⚠️  Attempt {attempt+1} failed: {e}")
                if attempt < 2:
                    time.sleep(2)
                else:
                    print(f"  ❌ Skipping chunk {i+1}")
                    translated.append("")

        time.sleep(0.5)

    print("✅ Translation complete.")
    return "\n".join(translated)