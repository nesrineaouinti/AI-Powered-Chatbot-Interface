#!/usr/bin/env python3
"""
Test script to verify AI service improvements
"""
import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_backend.settings')
django.setup()

from chatbot.ai_service import AIService
from chatbot.models import AIModelConfig

def test_ai_service():
    print("=" * 60)
    print("AI Service Connection Test")
    print("=" * 60)
    
    # Check available models
    print("\n1. Checking AI Model Configuration...")
    models = AIModelConfig.objects.all().order_by('-priority')
    print(f"   Total models in database: {models.count()}")
    
    for model in models:
        status = "✓ Active" if model.is_active else "✗ Inactive"
        key_status = "with API key" if model.api_key else "no API key"
        print(f"   - {model.name:12} [{status}] ({key_status}) - Priority: {model.priority}")
    
    # Test message generation
    print("\n2. Testing AI Response Generation...")
    test_messages = [
        {"role": "user", "content": "Hello! Can you help me test the chatbot?"}
    ]
    
    try:
        print("   Attempting to generate response...")
        response, model_used, tokens, response_time = AIService.generate_response(
            messages=test_messages,
            language='en'
        )
        
        print(f"\n   ✓ SUCCESS!")
        print(f"   Model used: {model_used}")
        print(f"   Response time: {response_time:.2f}s")
        print(f"   Tokens used: {tokens}")
        print(f"   Response preview: {response[:150]}...")
        
        return True
        
    except Exception as e:
        print(f"\n   ✗ FAILED!")
        print(f"   Error: {str(e)}")
        return False
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    success = test_ai_service()
    sys.exit(0 if success else 1)
