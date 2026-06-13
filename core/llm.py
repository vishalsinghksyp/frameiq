from langchain_mistralai import ChatMistralAI
import os

def get_llm(temperature: float = 0):
    return ChatMistralAI(
        model="mistral-small-latest",
        api_key=os.getenv("MISTRAL_API_KEY"),
        temperature=temperature,
        max_retries=5,      # ✅ auto-retry on 429
    )