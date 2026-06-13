import time
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from core.llm import get_llm


def split_transcript(transcript: str) -> list:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=3000,
        chunk_overlap=200,
    )
    return splitter.split_text(transcript)


def summarize(transcript: str) -> str:
    llm = get_llm()

    map_prompt = ChatPromptTemplate.from_messages([
        ("system", "Summarize this portion of a video transcript concisely."),
        ("human", "{text}")
    ])
    map_chain = map_prompt | llm | StrOutputParser()

    chunks = split_transcript(transcript)
    chunk_summaries = []
    for i, chunk in enumerate(chunks):
        print(f"  Summarizing chunk {i+1}/{len(chunks)}...")
        chunk_summaries.append(map_chain.invoke({"text": chunk}))
        time.sleep(2)  # ✅ avoid rate limit

    combined = "\n\n".join(chunk_summaries)

    combined_prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are an expert video summarizer. Combine these partial summaries "
            "into one final professional summary in bullet points."
        ),
        ("human", "{text}")
    ])
    combined_chain = combined_prompt | llm | StrOutputParser()
    return combined_chain.invoke({"text": combined})


def generate_title(transcript: str) -> str:
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are an expert at naming videos. Generate a short, catchy, and descriptive "
         "title (max 10 words) for the video based on the transcript. Return only the title, nothing else."),
        ("human", "{text}")
    ])
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"text": transcript[:3000]}).strip()


def extract_key_points(transcript: str) -> str:
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "Extract the top 5-7 key points from this video transcript. "
         "Return them as a numbered list. Be concise and specific."),
        ("human", "{text}")
    ])
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"text": transcript[:6000]})