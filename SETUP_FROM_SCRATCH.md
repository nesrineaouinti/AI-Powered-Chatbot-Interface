# Setup AI Models From Scratch

## ✅ Cleanup Complete

All unused markdown documentation files have been removed. The workspace is now clean and ready for fresh configuration.

## 🚀 Quick Start Guide

### 1. Configure Your API Keys

Edit `Back-end/.env` file and add at least one API key:

```bash
# Recommended: Groq (Free & Fast)
GROQ_API_KEY=gsk_your_actual_groq_key_here

# Or use OpenAI
OPENAI_API_KEY=sk-your_openai_key_here

# Or use Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here

# For local models (optional)
OLLAMA_BASE_URL=http://localhost:11434
```

**Get API Keys:**
- **Groq**: https://console.groq.com/keys (Free, fastest)
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/

### 2. Initialize Database Models

```bash
cd Back-end
python manage.py init_ai_models
```

This command will:
- Create AI model configurations in the database
- Activate models that have API keys configured
- Show you which models are ready to use

### 3. Test Your Setup

**Option A: Quick Test Script**
```bash
python test_ai_config.py
```

**Option B: Django Shell Test**
```bash
cd Back-end
python manage.py shell
```

Then in the Python shell:
```python
from chatbot.ai_service import AIService

# Create a test message
messages = [{"role": "user", "content": "Hello! Please respond with 'I am working!'"}]

# Generate response (will use highest priority active model)
response_text, model_used, tokens, time_taken = AIService.generate_response(
    messages=messages,
    language='en'
)

print(f"✅ Model: {model_used}")
print(f"✅ Response: {response_text}")
```

**To test a specific provider:**
```python
# Test Groq specifically
response_text, model_used, tokens, time_taken = AIService.generate_response(
    messages=messages,
    language='en',
    preferred_model='groq'  # Use 'groq', 'openai', 'anthropic', etc.
)
```

### 4. Start the Backend Server

```bash
cd Back-end
python manage.py runserver
```

### 5. Start the Frontend

```bash
cd front-end
npm run dev
```

## 📋 Supported Providers

| Provider | Priority | Cost | Speed | Notes |
|----------|----------|------|-------|-------|
| **Groq** | 10 | Free | ⚡ Very Fast | Recommended for testing |
| **OpenAI** | 9 | Paid | Fast | Most popular |
| **Anthropic** | 8 | Paid | Fast | Claude models |
| **Gemini** | 7 | Free tier | Medium | Google's model |
| **DeepSeek** | 6 | Paid | Medium | - |
| **Grok** | 5 | Paid | Medium | X.AI |
| **Ollama** | 4 | Free | Slow | Local models |

## 🔧 Troubleshooting

### Error: "No active AI models configured"
**Solution:** Run `python manage.py init_ai_models` after adding API keys to `.env`

### Error: "API key not configured"
**Solution:** 
1. Check your `Back-end/.env` file has the correct API key
2. Restart Django server after adding keys
3. Run `python manage.py init_ai_models` again

### Error: "AttributeError: 'AIService' object has no attribute 'get_ai_response'"
**Solution:** Use the correct class method syntax:
```python
# ❌ Wrong
service = AIService()
response = service.get_ai_response(...)

# ✅ Correct
response = AIService.generate_response(messages=[...], language='en')
```

### Models not showing in frontend
**Solution:**
1. Make sure backend is running
2. Check that `init_ai_models` command was run
3. Verify at least one model is active in database

## 📚 Documentation Files

- **AI_MODELS_SETUP.md** - Detailed setup guide for all providers
- **test_ai_config.py** - Quick test script
- **README.md** - Main project documentation

## 🎯 Next Steps

1. ✅ Add API key to `Back-end/.env`
2. ✅ Run `python manage.py init_ai_models`
3. ✅ Test with `python test_ai_config.py`
4. ✅ Start backend: `python manage.py runserver`
5. ✅ Start frontend: `npm run dev`
6. ✅ Open http://localhost:5173 and start chatting!

## 💡 Tips

- **Start with Groq** - It's free and very fast for testing
- **Use mock provider** - If no API keys configured, system falls back to mock responses
- **Check logs** - Backend logs show which model is being used for each request
- **Priority matters** - Higher priority models are tried first (Groq=10, OpenAI=9, etc.)
