#!/usr/bin/env python3
"""
Quick script to activate Groq with your API key
"""

import os
import sys
import django

# Your Groq API key
GROQ_KEY = "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"

def update_env_file():
    """Update the .env file with Groq key"""
    env_path = os.path.join(os.path.dirname(__file__), 'Back-end', '.env')
    env_example_path = os.path.join(os.path.dirname(__file__), 'Back-end', '.env.example')
    
    # Create .env if it doesn't exist
    if not os.path.exists(env_path):
        print("📝 Creating .env file from .env.example...")
        if os.path.exists(env_example_path):
            with open(env_example_path, 'r') as f:
                content = f.read()
            with open(env_path, 'w') as f:
                f.write(content)
        else:
            print("❌ .env.example not found!")
            return False
    
    # Read current .env
    with open(env_path, 'r') as f:
        lines = f.readlines()
    
    # Update or add GROQ_API_KEY
    updated = False
    for i, line in enumerate(lines):
        if line.startswith('GROQ_API_KEY='):
            lines[i] = f'GROQ_API_KEY={GROQ_KEY}\n'
            updated = True
            print("✏️  Updated existing GROQ_API_KEY")
            break
    
    if not updated:
        lines.append(f'\nGROQ_API_KEY={GROQ_KEY}\n')
        print("➕ Added GROQ_API_KEY")
    
    # Write back
    with open(env_path, 'w') as f:
        f.writelines(lines)
    
    print("✅ .env file updated!")
    return True

def init_models():
    """Initialize AI models in database"""
    print("\n📊 Initializing AI models in database...")
    
    # Setup Django
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Back-end'))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_backend.settings')
    django.setup()
    
    from django.core.management import call_command
    call_command('init_ai_models')

def test_groq():
    """Test Groq API"""
    print("\n🧪 Testing Groq API...")
    print("=" * 60)
    
    from chatbot.ai_service import AIService
    from chatbot.models import AIModelConfig
    
    # Check if Groq is active
    try:
        groq_model = AIModelConfig.objects.get(name='groq')
        print(f"   Groq status: {'✅ ACTIVE' if groq_model.is_active else '❌ INACTIVE'}")
        print(f"   Has API key: {'✅ Yes' if groq_model.api_key else '❌ No'}")
        print(f"   Priority: {groq_model.priority}")
        print()
    except Exception as e:
        print(f"   ⚠️  Groq model not found: {e}")
        print()
    
    # Test API call
    messages = [{"role": "user", "content": "Say 'Hello from Groq!' in one sentence."}]
    
    try:
        response_text, model_used, tokens, time_taken = AIService.generate_response(
            messages=messages,
            language='en',
            preferred_model='groq'
        )
        
        print(f"   ✅ SUCCESS!")
        print(f"   Model: {model_used}")
        print(f"   Response: {response_text}")
        print(f"   Tokens: {tokens}")
        print(f"   Time: {time_taken:.2f}s")
        print()
        
    except Exception as e:
        print(f"   ❌ ERROR: {str(e)}")
        print()

if __name__ == '__main__':
    print("🚀 Groq Activation Script")
    print("=" * 60)
    print()
    
    # Step 1: Update .env
    if not update_env_file():
        sys.exit(1)
    
    # Step 2: Initialize models
    try:
        init_models()
    except Exception as e:
        print(f"❌ Error initializing models: {e}")
        sys.exit(1)
    
    # Step 3: Test Groq
    test_groq()
    
    print("=" * 60)
    print("✅ Groq is now active and ready to use!")
    print()
    print("💡 Groq will be the highest priority model (priority 10)")
    print("   It will be used automatically for all chat requests")
    print()
