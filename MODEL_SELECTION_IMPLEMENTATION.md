# AI Model Selection Implementation

## ✅ Completed Features

### 1. **Model Selection UI**
- **Location**: Top-right corner of chat interface
- **Display**: Shows top 3 available AI models
- **Visual Indicators**:
  - 🤖 Bot icon for each model
  - "Recommended" badge for highest priority model
  - "Free" badge for mock/fallback models

### 2. **Supported AI Models**

#### **With API Keys (Paid/Free Tier)**
1. **Groq** ⭐ (Priority 10 - Recommended)
   - Model: `llama-3.3-70b-versatile`
   - Speed: Very Fast
   - Cost: Free tier available
   - Get API key: https://console.groq.com/keys

2. **OpenAI** (Priority 9)
   - Models: gpt-3.5-turbo, gpt-4
   - Speed: Fast
   - Cost: Paid
   - Get API key: https://platform.openai.com/api-keys

3. **Anthropic** (Priority 8)
   - Models: Claude 3 (Haiku, Sonnet, Opus)
   - Speed: Fast
   - Cost: Paid
   - Get API key: https://console.anthropic.com/

4. **Gemini** (Priority 7)
   - Model: gemini-pro
   - Speed: Medium
   - Cost: Free tier available
   - Get API key: https://makersuite.google.com/app/apikey

5. **DeepSeek** (Priority 6)
   - Model: deepseek-chat
   - Speed: Medium
   - Cost: Paid

6. **Grok** (Priority 5)
   - Model: grok-beta
   - Speed: Medium
   - Cost: Paid
   - Get API key: https://console.x.ai/

#### **Fallback Models (No API Key Required)**
7. **Ollama/LLaMA** (Priority 4)
   - Local installation required
   - Models: llama2, mistral, codellama
   - Speed: Depends on hardware
   - Cost: Free (local)

8. **Mock Provider** (Priority 0)
   - Always available as last resort
   - Returns test responses
   - Used when no API keys configured

### 3. **Model Selection Logic**

```typescript
// Frontend automatically:
1. Fetches active models from backend
2. Displays top 3 models by priority
3. Auto-selects highest priority model
4. Falls back to free models if no API keys
```

### 4. **Backend Configuration**

Models are configured in the database with:
- **Priority**: Higher number = tried first
- **is_active**: Only active models are shown
- **API Key**: Required for activation (except Ollama/Mock)
- **Language Support**: Filters by English/Arabic

### 5. **User Experience**

#### **When API Keys Are Configured:**
```
┌─────────────────────────────────┐
│ Select AI Model:                │
│ ┌─────────────────────────────┐ │
│ │ 🤖 Groq [Recommended]       │ │
│ │ 🤖 OpenAI                   │ │
│ │ 🤖 Anthropic                │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### **When No API Keys (Fallback):**
```
┌─────────────────────────────────┐
│ Select AI Model:                │
│ ┌─────────────────────────────┐ │
│ │ 🤖 Groq                     │ │
│ │ 🤖 Other [Free]             │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 6. **How It Works**

#### **Step 1: Backend Initialization**
```bash
cd Back-end
python manage.py init_ai_models
```

This creates model configurations in database based on available API keys.

#### **Step 2: Frontend Fetches Models**
```typescript
// ChatContext.tsx
const loadAIModels = async () => {
  const models = await chatService.getAIModels();
  setAvailableModels(models); // Sorted by priority
};
```

#### **Step 3: Display Top 3 Models**
```typescript
// Chatbot.tsx
const getDisplayModels = () => {
  if (availableModels.length > 0) {
    return availableModels.slice(0, 3); // Top 3
  }
  // Fallback to free models
  return [
    { name: 'groq', ... },
    { name: 'other', ... }
  ];
};
```

#### **Step 4: Send Message with Selected Model**
```typescript
await sendMessage(
  chatId,
  messageContent,
  language,
  selectedModel // User's choice
);
```

### 7. **API Endpoint**

**GET** `/api/ai-models/`

Returns active models sorted by priority:
```json
[
  {
    "name": "groq",
    "supports_english": true,
    "supports_arabic": true,
    "priority": 10
  },
  {
    "name": "openai",
    "supports_english": true,
    "supports_arabic": true,
    "priority": 9
  },
  {
    "name": "anthropic",
    "supports_english": true,
    "supports_arabic": true,
    "priority": 8
  }
]
```

### 8. **Testing**

#### **Test Model Selection:**
1. Start backend: `cd Back-end && python manage.py runserver`
2. Start frontend: `cd front-end && npm run dev`
3. Open http://localhost:5173
4. Click model selector in top-right
5. See available models
6. Select different models and send messages

#### **Test Fallback:**
1. Remove all API keys from `Back-end/.env`
2. Run: `python manage.py init_ai_models`
3. Restart servers
4. Should see "Groq" and "Other [Free]" as options
5. Messages will use mock responses

### 9. **Configuration Files**

**Backend:**
- `Back-end/.env` - API keys
- `Back-end/chatbot/models.py` - AIModelConfig model
- `Back-end/chatbot/ai_service.py` - Provider implementations
- `Back-end/chatbot/management/commands/init_ai_models.py` - Initialization

**Frontend:**
- `front-end/src/pages/Chatbot.tsx` - Model selector UI
- `front-end/src/contexts/ChatContext.tsx` - Model state management
- `front-end/src/types/chat.ts` - Type definitions
- `front-end/src/services/chatService.ts` - API calls

### 10. **Current Status**

✅ Model selection UI implemented  
✅ Top 3 models displayed  
✅ Groq configured and working  
✅ Fallback to free models  
✅ Visual indicators (badges)  
✅ Auto-selection of best model  
✅ Language-aware filtering  
✅ Priority-based ordering  

### 11. **Next Steps**

To add more models:
1. Add API key to `Back-end/.env`
2. Run `python manage.py init_ai_models`
3. Restart backend
4. Model will appear in selector automatically

### 12. **Troubleshooting**

**Models not showing:**
- Check `python manage.py init_ai_models` was run
- Verify API keys in `.env`
- Check backend logs for errors

**Wrong model selected:**
- Frontend auto-selects highest priority
- Manually select from dropdown
- Check model priority in database

**Model not working:**
- Verify API key is valid
- Check model name is correct
- See backend logs for API errors

## Summary

The chatbot now allows users to choose between **at least 3 AI models** with automatic fallback to free/open-source models when no API keys are configured. The UI clearly indicates which model is recommended and which are free alternatives.
