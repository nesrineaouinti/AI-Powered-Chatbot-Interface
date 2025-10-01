# AI Models Configuration Guide

## Overview
This guide will help you configure AI models from scratch for the chatbot.

## Supported AI Providers

### 1. Groq (Recommended - Free & Fast)
- **Models**: llama3-8b-8192, llama3-70b-8192, mixtral-8x7b-32768, gemma-7b-it
- **API Key**: Get from https://console.groq.com/keys
- **Setup**:
  ```bash
  # Add to Back-end/.env
  GROQ_API_KEY=your_groq_api_key_here
  ```

### 2. OpenAI
- **Models**: gpt-3.5-turbo, gpt-4, gpt-4-turbo
- **API Key**: Get from https://platform.openai.com/api-keys
- **Setup**:
  ```bash
  # Add to Back-end/.env
  OPENAI_API_KEY=your_openai_api_key_here
  ```

### 3. Anthropic (Claude)
- **Models**: claude-3-opus, claude-3-sonnet, claude-3-haiku
- **API Key**: Get from https://console.anthropic.com/
- **Setup**:
  ```bash
  # Add to Back-end/.env
  ANTHROPIC_API_KEY=your_anthropic_api_key_here
  ```

### 4. Ollama (Local - No API Key Required)
- **Models**: llama2, mistral, codellama, etc.
- **Setup**:
  ```bash
  # Install Ollama
  curl -fsSL https://ollama.com/install.sh | sh
  
  # Pull a model
  ollama pull llama2
  
  # Start Ollama service
  ollama serve
  
  # Add to Back-end/.env
  OLLAMA_BASE_URL=http://localhost:11434
  ```

## Configuration Steps

### Step 1: Update Environment Variables
Edit `Back-end/.env` and add your API keys:
```bash
# Choose at least one provider
GROQ_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
# OLLAMA_BASE_URL=http://localhost:11434
```

### Step 2: Initialize AI Models in Database
```bash
cd Back-end
python manage.py init_ai_models
```

This will create/update all AI model configurations in the database.

### Step 3: Test Your Configuration

**Quick Test (Recommended):**
```bash
python test_ai_config.py
```

**Manual Test in Django Shell:**
```bash
cd Back-end
python manage.py shell

# Test in Python shell:
from chatbot.ai_service import AIService

# Correct usage - AIService uses class methods
messages = [{"role": "user", "content": "Hello, how are you?"}]
response_text, model_used, tokens, time_taken = AIService.generate_response(
    messages=messages,
    language='en',
    preferred_model='groq'  # Provider name: groq, openai, anthropic, etc.
)

print(f"Response: {response_text}")
print(f"Model: {model_used}")
```

### Step 4: Available Models by Provider

**Groq (Current Working Models):**
- llama-3.3-70b-versatile ⭐ (Recommended - Fast & capable)
- llama-3.2-90b-text-preview (Most capable)
- llama-3.1-8b-instant (Fastest)
- gemma2-9b-it (Google's latest)

**OpenAI:**
- gpt-3.5-turbo (Fast, affordable)
- gpt-4 (Most capable)
- gpt-4-turbo (Faster GPT-4)

**Anthropic:**
- claude-3-haiku (Fast)
- claude-3-sonnet (Balanced)
- claude-3-opus (Most capable)

**Ollama (Local):**
- llama2
- mistral
- codellama
- phi
- neural-chat

## Quick Start with Groq (Easiest)

1. Get API key from https://console.groq.com/keys
2. Add to `Back-end/.env`:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
3. Run: `cd Back-end && python manage.py init_ai_models`
4. Restart Django server
5. Groq will automatically use `llama-3.3-70b-versatile` model

## Troubleshooting

### Error: "API key not configured"
- Check that your `.env` file has the correct API key
- Restart the Django server after adding keys

### Error: "Model not found"
- Verify the model name matches exactly
- Check provider documentation for available models

### Error: "Connection refused" (Ollama)
- Make sure Ollama service is running: `ollama serve`
- Check the base URL is correct: `http://localhost:11434`

## Testing Models

Test script location: `test_groq_models.py`

```bash
python test_groq_models.py
```

This will test all configured providers and show which ones are working.
