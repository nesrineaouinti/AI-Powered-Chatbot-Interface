"""
AI Service Integration Layer
Handles communication with multiple AI models (Grok, DeepSeek, LLaMA, OpenAI, Gemini)
with fallback support and multi-language capabilities.
"""

import time
import logging
from typing import Dict, List, Optional, Tuple
from django.conf import settings
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from .models import AIModelConfig, Message

logger = logging.getLogger(__name__)


class AIServiceException(Exception):
    """Custom exception for AI service errors"""
    pass


class BaseAIProvider:
    """Base class for AI providers"""
    
    def __init__(self, config: AIModelConfig):
        self.config = config
        self.name = config.name
        self.api_key = config.api_key
        self.api_endpoint = config.api_endpoint
        self.max_tokens = config.max_tokens
        self.temperature = config.temperature
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        """
        Generate AI response
        Returns: (response_text, tokens_used, response_time)
        """
        raise NotImplementedError("Subclasses must implement generate_response")
    
    def _make_request(self, payload: Dict, headers: Dict, retries: int = 3) -> Dict:
        """Make HTTP request to AI API with retries"""
        last_error = None
        
        for attempt in range(retries):
            try:
                start_time = time.time()
                response = requests.post(
                    self.api_endpoint,
                    json=payload,
                    headers=headers,
                    timeout=60  # Increased timeout
                )
                response_time = time.time() - start_time
                
                if response.status_code != 200:
                    raise AIServiceException(
                        f"API returned status {response.status_code}: {response.text}"
                    )
                
                return response.json(), response_time
                
            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
                last_error = e
                if attempt < retries - 1:
                    logger.warning(f"Request attempt {attempt + 1} failed, retrying...")
                    time.sleep(1)  # Wait before retry
                    continue
                raise AIServiceException(f"Request failed after {retries} attempts: {str(e)}")
            except requests.exceptions.RequestException as e:
                raise AIServiceException(f"Request failed: {str(e)}")


class OpenAIProvider(BaseAIProvider):
    """OpenAI GPT provider"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        if not self.api_key:
            raise AIServiceException("OpenAI API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Add language instruction
        system_message = {
            "role": "system",
            "content": f"You are a helpful assistant. Respond in {'Arabic' if language == 'ar' else 'English'}."
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [system_message] + messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }
        
        try:
            data, response_time = self._make_request(payload, headers)
            response_text = data['choices'][0]['message']['content']
            tokens_used = data.get('usage', {}).get('total_tokens', 0)
            return response_text, tokens_used, response_time
        except Exception as e:
            logger.error(f"OpenAI error: {str(e)}")
            raise AIServiceException(f"OpenAI error: {str(e)}")


class GeminiProvider(BaseAIProvider):
    """Google Gemini provider"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        if not self.api_key:
            raise AIServiceException("Gemini API key not configured")
        
        # Gemini uses a different format
        endpoint = f"{self.api_endpoint}?key={self.api_key}"
        
        # Convert messages to Gemini format
        prompt = self._convert_messages_to_prompt(messages, language)
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": self.max_tokens
            }
        }
        
        headers = {"Content-Type": "application/json"}
        
        try:
            start_time = time.time()
            response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
            response_time = time.time() - start_time
            
            if response.status_code != 200:
                error_msg = f"Gemini API error: status {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                raise AIServiceException(error_msg)
            
            data = response.json()
            response_text = data['candidates'][0]['content']['parts'][0]['text']
            tokens_used = data.get('usageMetadata', {}).get('totalTokenCount', 0)
            
            return response_text, tokens_used, response_time
        except requests.exceptions.ConnectionError as e:
            raise AIServiceException(f"Connection failed - Gemini API may be unreachable: {str(e)}")
        except requests.exceptions.Timeout as e:
            raise AIServiceException(f"Request timed out: {str(e)}")
        except AIServiceException:
            raise
        except Exception as e:
            logger.error(f"Gemini error: {str(e)}")
            raise AIServiceException(f"Gemini error: {str(e)}")
    
    def _convert_messages_to_prompt(self, messages: List[Dict], language: str) -> str:
        """Convert message history to a single prompt"""
        lang_instruction = "Respond in Arabic." if language == 'ar' else "Respond in English."
        prompt = f"{lang_instruction}\n\n"
        for msg in messages:
            role = "User" if msg['role'] == 'user' else "Assistant"
            prompt += f"{role}: {msg['content']}\n"
        return prompt


class DeepSeekProvider(BaseAIProvider):
    """DeepSeek AI provider"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        if not self.api_key:
            raise AIServiceException("DeepSeek API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        system_message = {
            "role": "system",
            "content": f"You are a helpful assistant. Respond in {'Arabic' if language == 'ar' else 'English'}."
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [system_message] + messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }
        
        try:
            data, response_time = self._make_request(payload, headers)
            response_text = data['choices'][0]['message']['content']
            tokens_used = data.get('usage', {}).get('total_tokens', 0)
            return response_text, tokens_used, response_time
        except Exception as e:
            logger.error(f"DeepSeek error: {str(e)}")
            raise AIServiceException(f"DeepSeek error: {str(e)}")


class LLaMAProvider(BaseAIProvider):
    """LLaMA provider (supports both API and local Ollama)"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        system_message = {
            "role": "system",
            "content": f"You are a helpful assistant. Respond in {'Arabic' if language == 'ar' else 'English'}."
        }
        
        # Check if using API (has API key) or local Ollama (no API key)
        if self.api_key:
            # API-based LLaMA (Together AI, Groq, Replicate, etc.)
            return self._generate_via_api(messages, system_message)
        else:
            # Local Ollama
            return self._generate_via_ollama(messages, system_message)
    
    def _generate_via_api(self, messages: List[Dict], system_message: Dict) -> Tuple[str, int, float]:
        """Generate response via API (Together AI, Groq, etc.)"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Determine model name based on endpoint
        if "groq.com" in self.api_endpoint:
            # Groq's current available models (verified working)
            model_name = "llama-3.3-70b-versatile"
        elif "together.xyz" in self.api_endpoint:
            model_name = "meta-llama/Llama-2-70b-chat-hf"  # Together AI model
        else:
            model_name = "llama2"  # Default
        
        # OpenAI-compatible format (works with Together AI, Groq, etc.)
        payload = {
            "model": model_name,
            "messages": [system_message] + messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }
        
        try:
            data, response_time = self._make_request(payload, headers)
            response_text = data['choices'][0]['message']['content']
            tokens_used = data.get('usage', {}).get('total_tokens', 0)
            return response_text, tokens_used, response_time
        except Exception as e:
            logger.error(f"LLaMA API error: {str(e)}")
            raise AIServiceException(f"LLaMA API error: {str(e)}")
    
    def _generate_via_ollama(self, messages: List[Dict], system_message: Dict) -> Tuple[str, int, float]:
        """Generate response via local Ollama"""
        headers = {"Content-Type": "application/json"}
        
        payload = {
            "model": "llama2",
            "messages": [system_message] + messages,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens
            }
        }
        
        try:
            data, response_time = self._make_request(payload, headers)
            response_text = data['message']['content']
            tokens_used = data.get('eval_count', 0) + data.get('prompt_eval_count', 0)
            return response_text, tokens_used, response_time
        except Exception as e:
            logger.error(f"LLaMA Ollama error: {str(e)}")
            raise AIServiceException(f"LLaMA Ollama error: {str(e)}")


class GroqProvider(BaseAIProvider):
    """Groq AI provider (Fast inference)"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        if not self.api_key:
            raise AIServiceException("Groq API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        system_message = {
            "role": "system",
            "content": f"You are a helpful assistant. Respond in {'Arabic' if language == 'ar' else 'English'}."
        }
        
        # Use llama-3.3-70b-versatile (current working model)
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [system_message] + messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }
        
        try:
            data, response_time = self._make_request(payload, headers)
            response_text = data['choices'][0]['message']['content']
            tokens_used = data.get('usage', {}).get('total_tokens', 0)
            return response_text, tokens_used, response_time
        except Exception as e:
            logger.error(f"Groq error: {str(e)}")
            raise AIServiceException(f"Groq error: {str(e)}")


class AnthropicProvider(BaseAIProvider):
    """Anthropic Claude provider"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        if not self.api_key:
            raise AIServiceException("Anthropic API key not configured")
        
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        # Convert messages to Anthropic format
        system_content = f"You are a helpful assistant. Respond in {'Arabic' if language == 'ar' else 'English'}."
        
        # Anthropic expects messages without system role in messages array
        anthropic_messages = []
        for msg in messages:
            if msg['role'] != 'system':
                anthropic_messages.append({
                    "role": "user" if msg['role'] == 'user' else "assistant",
                    "content": msg['content']
                })
        
        payload = {
            "model": "claude-3-haiku-20240307",
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "system": system_content,
            "messages": anthropic_messages
        }
        
        try:
            data, response_time = self._make_request(payload, headers)
            response_text = data['content'][0]['text']
            tokens_used = data.get('usage', {}).get('input_tokens', 0) + data.get('usage', {}).get('output_tokens', 0)
            return response_text, tokens_used, response_time
        except Exception as e:
            logger.error(f"Anthropic error: {str(e)}")
            raise AIServiceException(f"Anthropic error: {str(e)}")


class GrokProvider(BaseAIProvider):
    """Grok AI provider (X.AI)"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        if not self.api_key:
            raise AIServiceException("Grok API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        system_message = {
            "role": "system",
            "content": f"You are Grok, a helpful assistant. Respond in {'Arabic' if language == 'ar' else 'English'}."
        }
        
        payload = {
            "model": "grok-beta",
            "messages": [system_message] + messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }
        
        try:
            data, response_time = self._make_request(payload, headers)
            response_text = data['choices'][0]['message']['content']
            tokens_used = data.get('usage', {}).get('total_tokens', 0)
            return response_text, tokens_used, response_time
        except Exception as e:
            logger.error(f"Grok error: {str(e)}")
            raise AIServiceException(f"Grok error: {str(e)}")


class MockAIProvider(BaseAIProvider):
    """Mock provider for testing without API keys"""
    
    def generate_response(self, messages: List[Dict], language: str) -> Tuple[str, int, float]:
        time.sleep(0.5)  # Simulate API delay
        
        last_message = messages[-1]['content'] if messages else ""
        
        if language == 'ar':
            response = f"هذا رد تجريبي على: {last_message[:50]}... (استخدام نموذج وهمي)"
        else:
            response = f"This is a mock response to: {last_message[:50]}... (Using mock model)"
        
        return response, 50, 0.5


class AIService:
    """Main AI service that manages multiple providers with fallback"""
    
    PROVIDER_MAP = {
        'groq': GroqProvider,
        'openai': OpenAIProvider,
        'anthropic': AnthropicProvider,
        'gemini': GeminiProvider,
        'deepseek': DeepSeekProvider,
        'llama': LLaMAProvider,
        'grok': GrokProvider,
        'other': MockAIProvider,
    }
    
    @classmethod
    def get_available_models(cls, language: str = 'en') -> List[AIModelConfig]:
        """Get all active AI models that support the given language"""
        filters = {'is_active': True}
        if language == 'ar':
            filters['supports_arabic'] = True
        else:
            filters['supports_english'] = True
        
        return list(AIModelConfig.objects.filter(**filters).order_by('-priority'))
    
    @classmethod
    def generate_response(
        cls,
        messages: List[Dict],
        language: str = 'en',
        preferred_model: Optional[str] = None
    ) -> Tuple[str, str, int, float]:
        """
        Generate AI response with automatic fallback
        Returns: (response_text, model_used, tokens_used, response_time)
        """
        available_models = cls.get_available_models(language)
        
        if not available_models:
            # Use mock provider if no models configured
            # Use preferred_model name if provided, otherwise 'other'
            model_name = preferred_model if preferred_model in cls.PROVIDER_MAP else 'other'
            logger.warning(f"No active AI models configured, using mock provider for '{model_name}'")
            
            mock_config = AIModelConfig(
                name=model_name,
                api_endpoint='',
                max_tokens=2000,
                temperature=0.7
            )
            provider = MockAIProvider(mock_config)
            response, tokens, time_taken = provider.generate_response(messages, language)
            return response, model_name, tokens, time_taken
        
        # Try preferred model first
        if preferred_model:
            models_to_try = [m for m in available_models if m.name == preferred_model]
            models_to_try.extend([m for m in available_models if m.name != preferred_model])
        else:
            models_to_try = available_models
        
        errors = []
        for model_config in models_to_try:
            try:
                provider_class = cls.PROVIDER_MAP.get(model_config.name, MockAIProvider)
                provider = provider_class(model_config)
                
                logger.info(f"Attempting to use {model_config.name} for {language} response")
                response, tokens, time_taken = provider.generate_response(messages, language)
                
                logger.info(f"Successfully generated response using {model_config.name}")
                return response, model_config.name, tokens, time_taken
                
            except AIServiceException as e:
                error_msg = f"{model_config.name}: {str(e)}"
                errors.append(error_msg)
                logger.warning(f"Failed to use {model_config.name}: {str(e)}")
                continue
            except Exception as e:
                error_msg = f"{model_config.name}: Unexpected error - {str(e)}"
                errors.append(error_msg)
                logger.error(f"Unexpected error with {model_config.name}: {str(e)}")
                continue
        
        # If all configured models fail, fall back to mock provider as last resort
        logger.warning("All configured AI models failed, falling back to mock provider")
        try:
            mock_config = AIModelConfig(
                name='mock',
                api_endpoint='',
                max_tokens=2000,
                temperature=0.7
            )
            provider = MockAIProvider(mock_config)
            response, tokens, time_taken = provider.generate_response(messages, language)
            logger.info("Using mock provider as fallback")
            return response, 'mock (fallback)', tokens, time_taken
        except Exception as e:
            # If even mock fails, raise comprehensive error
            all_errors = "\n".join(errors)
            raise AIServiceException(
                f"All AI models failed:\n{all_errors}\nMock fallback also failed: {str(e)}"
            )
    
    @classmethod
    def generate_user_summary(
        cls,
        user_messages: List[str],
        language: str = 'en'
    ) -> Tuple[str, List[str], Dict]:
        """
        Generate AI-powered user summary from chat history
        Returns: (summary_text, topics, preferences)
        """
        # Create a prompt for summary generation
        messages = [{
            "role": "user",
            "content": f"""Analyze the following user messages and create a summary in {'Arabic' if language == 'ar' else 'English'}.
Include:
1. Main topics of interest
2. Communication style
3. Common questions or needs
4. User preferences

User messages:
{chr(10).join(user_messages[:50])}  # Limit to 50 messages

Provide the response in JSON format with keys: summary, topics (array), preferences (object)"""
        }]
        
        try:
            response, model, tokens, time_taken = cls.generate_response(messages, language)
            
            # Parse JSON response (simplified - in production, use proper JSON parsing)
            import json
            try:
                data = json.loads(response)
                return (
                    data.get('summary', response),
                    data.get('topics', []),
                    data.get('preferences', {})
                )
            except json.JSONDecodeError:
                # If not valid JSON, return raw response
                return response, [], {}
                
        except Exception as e:
            logger.error(f"Failed to generate user summary: {str(e)}")
            raise AIServiceException(f"Summary generation failed: {str(e)}")
