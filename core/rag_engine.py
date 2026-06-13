import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from core.vector_store import build_vector_store, load_vector_store, get_retriever
from core.llm import get_llm  


RAG_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are a friendly assistant that helps users understand a video's transcript.

For greetings, small talk, or general conversation (like "hi", "hello", "thanks", "bye"), 
respond naturally and warmly.

For questions about the video content, answer ONLY based on the transcript context provided below.
If the answer is not found in the context, say: 
"I could not find this information in the transcript."

Always be concise and precise. If quoting someone, mention it clearly.

Context from transcript:
{context}""",
    ),
    ("human", "{question}"),
])


def format_docs(docs):
    return "\n\n".join([doc.page_content for doc in docs])


def build_rag_chain(transcript: str):
    """Build RAG chain from fresh transcript — indexes into ChromaDB."""
    vector_store = build_vector_store(transcript)
    retriever = get_retriever(vector_store, k=4)
    llm = get_llm(temperature=0.3)

    rag_chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough()
        }
        | RAG_PROMPT | llm | StrOutputParser()
    )
    return rag_chain


def load_rag_chain():
    """Load RAG chain from existing ChromaDB — no re-indexing."""
    vector_store = load_vector_store()
    retriever = get_retriever(vector_store, k=4)  # ✅ was missing vector_store arg
    llm = get_llm(temperature=0.3)

    rag_chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough()
        }
        | RAG_PROMPT | llm | StrOutputParser()
    )
    return rag_chain


def ask_question(rag_chain, question: str) -> str:
    print(f"\nQuestion: {question}")
    answer = rag_chain.invoke(question)
    print(f"Answer: {answer}")
    return answer