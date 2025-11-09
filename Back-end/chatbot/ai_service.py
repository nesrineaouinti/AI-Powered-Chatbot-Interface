"""
AI Service Integration Layer (LangChain ≥1.1)
Integrates Groq (via LangChain), LLaMA, and Chroma vector DB for RAG.
"""

import os
import time
import logging
from typing import Dict, List, Optional, Tuple
from dotenv import load_dotenv

# Core LangChain imports
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables import RunnableLambda
# Vector stores and embeddings
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Chat model (Groq)
from langchain_groq import ChatGroq

# Chroma client
from chromadb import Client
from chromadb.config import Settings

# Models
from .models import AIModelConfig

logger = logging.getLogger(__name__)
load_dotenv()


# ======================================================
# 🔹 Embeddings
# ======================================================
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# ======================================================
# 🔹 Initialize Chroma Vector DB
# ======================================================
CHROMA_DIR = "./chroma_db"
client = Client(Settings(anonymized_telemetry=False))

vector_store = Chroma(
    client=client,
    collection_name="ai_memory",
    persist_directory=CHROMA_DIR,
    embedding_function=embeddings
)

retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# ======================================================
# 🔹 Chat Model (Groq)
# ======================================================
model = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7,
    max_tokens=2000,
)

# ======================================================
# 🔹 Conversational Memory (new v1.x API)
# ======================================================
memory_store: Dict[str, InMemoryChatMessageHistory] = {}

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
    """Simple in-memory chat history storage."""
    if session_id not in memory_store:
        memory_store[session_id] = InMemoryChatMessageHistory()
    return memory_store[session_id]

# ======================================================
# 🔹 Prompt Template with RAG context
# ======================================================
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use the context and chat history to answer."),
    ("human", "Context:\n{context}\n\nQuestion: {question}\nAnswer in {language}:")
])



# ======================================================
# 🔹 Exceptions & Providers
# ======================================================
class AIServiceException(Exception):
    pass


class BaseAIProvider:
    def __init__(self, config: AIModelConfig):
        self.config = config
        self.name = config.name
        self.api_key = getattr(config, 'api_key', None)
        self.max_tokens = getattr(config, 'max_tokens', 2000)
        self.temperature = getattr(config, 'temperature', 0.7)

    def generate_response(self, messages: List[Dict], language: str):
        raise NotImplementedError


class MockAIProvider(BaseAIProvider):
    """Mock model for local testing without Groq."""
    def generate_response(self, messages: List[Dict], language: str):
        time.sleep(0.3)
        last_message = messages[-1]['content']
        response = (
            f"(MOCK) Answer to: {last_message[:60]}..."
            if language == "en"
            else f"(وهمي) رد على: {last_message[:60]}..."
        )
        return response, 50, 0.3


class LangChainProvider(BaseAIProvider):
    """Groq AI provider (LangChain v1.x compatible)"""

    def __init__(self, config: Optional[AIModelConfig] = None):
        model_name = config.name if config else "llama-3.3-70b-versatile"
        self.model = ChatGroq(
            model=model_name,
            api_key=os.getenv("GROQ_API_KEY")
        )

    def generate_response(self, messages: List[Dict], language="en"):
        text_input = "\n".join(f"{m['role'].capitalize()}: {m['content']}" for m in messages)
        start = time.time()
        response = self.model.invoke(text_input)
        elapsed = round(time.time() - start, 2)
        return response.content, len(response.content.split()), elapsed


# ======================================================
# 🔹 AIService (central RAG logic)
# ======================================================
class AIService:

    @staticmethod
    def add_document(text: str) -> None:
        """Store text in Chroma vector DB."""
        doc = Document(page_content=text)
        vector_store.add_documents([doc])
        logger.info(f"✅ Added document: {text[:60]}...")

    @staticmethod
    def generate_response(
        messages: List[Dict],
        language: str = "en",
        session_id: str = "default",
        preferred_model: Optional[str] = None,
    ):
        """Generate response using Groq + Chroma RAG + memory."""
        try:
            user_message = messages[-1]["content"]
            model_name = preferred_model or "llama-3.3-70b-versatile"

            # 1️⃣ Initialize model
            model = ChatGroq(
                model=model_name,
                api_key=os.getenv("GROQ_API_KEY"),
                temperature=0.7,
                max_tokens=2000,
            )

            # 2️⃣ Retrieve context from vector store
            docs = retriever.invoke(user_message)
            if isinstance(docs, list):
                context_text = "\n".join([d.page_content for d in docs])
            else:
                context_text = str(docs)

            print("\n📚 --- Context used for this query ---")
            print(context_text[:500] + ("..." if len(context_text) > 500 else ""))

            # 3️⃣ Define prompt expecting context, question, language
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a helpful assistant. Use the given context and chat history to respond clearly."),
                ("human", "Context:\n{context}\n\nQuestion: {question}\nAnswer in {language}:")
            ])

            # 4️⃣ Define a subchain that adds context before the prompt
            def enrich_input(x):
                """Add the retrieved context to inputs before passing to the prompt."""
                return {
                    "context": context_text,  # inject context here
                    "question": x["question"],
                    "language": x["language"]
                }

            enriched_chain = RunnableLambda(enrich_input) | prompt | model

            # 5️⃣ Add memory
            conversation = RunnableWithMessageHistory(
                enriched_chain,
                get_session_history,
                input_messages_key="question",
                history_messages_key="chat_history",
            )

            # 6️⃣ Invoke chain
            inputs = {
                "question": user_message,
                "language": language,
            }
            
            print("\n⚙️ Running RAG + Memory pipeline...")
            start = time.time()
            response = conversation.invoke(
                inputs,
                config={"configurable": {"session_id": session_id}},
            )

            elapsed = round(time.time() - start, 2)
            content = getattr(response, "content", str(response))
            tokens = len(content.split())
            
            print("\n✅ [AIService] Generation complete.")
            logger.info(f"🧠 AI generated response in {elapsed}s using {model_name}")
            return content, model_name, tokens, elapsed

        except Exception as e:
            logger.error(f"❌ AIService error: {e}")
            raise AIServiceException(str(e))
    
    @staticmethod
    def generate_user_summary(user_messages: list, language: str = "en") -> str:
        """
        Generate a user summary from their message history.
        
        Args:
            user_messages: List of user message texts
            language: Language for the summary ('en' or 'ar')
        
        Returns:
            JSON string with structure:
            {
                "summary": "User summary text",
                "topics": ["topic1", "topic2"],
                "Common queries": ["query1", "query2"]
            }
        """
        try:
            # Combine messages into context
            messages_context = "\n".join(user_messages[:50])  # Limit to last 50 messages
            
            # Create prompt for summary generation
            prompt = f"""Based on the following user messages, generate a comprehensive summary in {language}.
            
User Messages:
{messages_context}

Generate a JSON response with:
1. summary: A brief summary of the user's interests and conversation patterns
2. topics: List of main topics the user discusses
3. Common queries: List of common questions or requests

Respond ONLY with valid JSON in this exact format:
{{
    "summary": "...",
    "topics": ["topic1", "topic2", ...],
    "Common queries": ["query1", "query2", ...]
}}"""

            # Use the AI model to generate summary
            model = ChatGroq(
                model="llama-3.3-70b-versatile",
                api_key=os.getenv("GROQ_API_KEY"),
                temperature=0.5,  # Lower temperature for more consistent output
                max_tokens=1000,
            )
            
            response = model.invoke(prompt)
            content = getattr(response, "content", str(response))
            
            logger.info(f"✅ Generated user summary for {len(user_messages)} messages")
            return content
            
        except Exception as e:
            logger.error(f"❌ Error generating user summary: {e}")
            raise AIServiceException(str(e))