#!/usr/bin/env python
"""
Test script to verify AI model configuration
Run from Back-end directory: python ../test_ai_config.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Back-end'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_backend.settings')
django.setup()

from chatbot.ai_service import AIService
from chatbot.models import AIModelConfig

def test_ai_configuration():
    """Test AI model configuration and availability"""
    
    print("=" * 60)
    print("AI MODEL CONFIGURATION TEST")
    print("=" * 60)
    print()
    
    # Check database models
    print("📊 Checking database configuration...")
    all_models = AIModelConfig.objects.all()
    
    if not all_models.exists():
        print("⚠️  No models found in database!")
        print("   Run: python manage.py init_ai_models")
        print()
        return
    
    print(f"   Found {all_models.count()} models in database")
    print()
    
    # List all models
    print("📋 All configured models:")
    for model in all_models.order_by('-priority'):
        status = "✅ ACTIVE" if model.is_active else "❌ INACTIVE"
        has_key = "🔑" if model.api_key else "⚠️  No API key"
        print(f"   {status} {model.name:12} (priority: {model.priority:2}) {has_key}")
    print()
    
    # Check active models
    active_models = AIModelConfig.objects.filter(is_active=True)
    print(f"✅ Active models: {active_models.count()}")
    print()
    
    # Test with a simple message
    print("🧪 Testing AI response generation...")
    messages = [{"role": "user", "content": "Say 'Hello, I am working!' in one sentence."}]
    
    try:
        response_text, model_used, tokens, time_taken = AIService.generate_response(
            messages=messages,
            language='en'
        )
        
        print(f"   ✅ SUCCESS!")
        print(f"   Model used: {model_used}")
        print(f"   Response: {response_text[:100]}...")
        print(f"   Tokens: {tokens}")
        print(f"   Time: {time_taken:.2f}s")
        print()
        
    except Exception as e:
        print(f"   ❌ ERROR: {str(e)}")
        print()
    
    print("=" * 60)
    print("NEXT STEPS:")
    print("=" * 60)
    print()
    print("1. Add your API keys to Back-end/.env file")
    print("2. Run: cd Back-end && python manage.py init_ai_models")
    print("3. Test in Django shell:")
    print()
    print("   from chatbot.ai_service import AIService")
    print("   messages = [{'role': 'user', 'content': 'Hello!'}]")
    print("   response = AIService.generate_response(messages, 'en', 'groq')")
    print("   print(response)")
    print()

if __name__ == '__main__':
    test_ai_configuration()
