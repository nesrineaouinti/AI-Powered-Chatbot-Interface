import logging
logger = logging.getLogger(__name__)

def translate_text(text: str, target_lang: str = "en") -> str:
    """
    Translate given text to target language using GroqProvider via AIService.
    Returns only the translated text, no explanations.
    """
    from chatbot.ai_service import AIService

    messages = [{
        "role": "user",
        "content": (
            f"Translate the following text to {'Arabic' if target_lang == 'ar' else 'English'} "
            "and return only the translated text. Do not add any explanations, comments, or quotes.\n\n"
            f"{text}"
        )
    }]

    try:
        response, model_used, tokens_used, response_time = AIService.generate_response(
            messages=messages,
            language=target_lang,
            preferred_model='groq'
        )
        return response.strip().strip('"').strip("'")
    except Exception as e:
        logger.error(f"Translation failed: {str(e)}")
        return text
