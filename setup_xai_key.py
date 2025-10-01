#!/usr/bin/env python3
"""
Quick setup script to configure X.AI Grok API key
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Back-end'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_backend.settings')

# Your X.AI API key
XAI_KEY = "xai-MTziM2qMKqn3Tsjoo5ej46dpgVLsAqxpWrm3rFCmtuunJZrR3G5BVf8tm0ckaHPU4YQeJezVOcVj8Yl4"

def update_env_file():
    """Update the .env file with X.AI key"""
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
    
    # Update or add GROK_API_KEY
    updated = False
    for i, line in enumerate(lines):
        if line.startswith('GROK_API_KEY='):
            lines[i] = f'GROK_API_KEY={XAI_KEY}\n'
            updated = True
            print("✏️  Updated existing GROK_API_KEY")
            break
    
    if not updated:
        lines.append(f'\nGROK_API_KEY={XAI_KEY}\n')
        print("➕ Added GROK_API_KEY")
    
    # Write back
    with open(env_path, 'w') as f:
        f.writelines(lines)
    
    print("✅ .env file updated!")
    return True

def init_models():
    """Initialize AI models in database"""
    print("\n📊 Initializing AI models in database...")
    django.setup()
    
    from django.core.management import call_command
    call_command('init_ai_models')

def test_grok():
    """Test Grok API"""
    print("\n🧪 Testing Grok API...")
    print("=" * 60)
    
    from chatbot.ai_service import AIService
    from chatbot.models import AIModelConfig
    
    # Check if Grok is active
    try:
        grok_model = AIModelConfig.objects.get(name='grok')
        print(f"   Grok status: {'✅ ACTIVE' if grok_model.is_active else '❌ INACTIVE'}")
        print(f"   Has API key: {'✅ Yes' if grok_model.api_key else '❌ No'}")
        print()
    except:
        print("   ⚠️  Grok model not found in database")
        print()
    
    # Test API call
    messages = [{"role": "user", "content": "Say 'Hello from Grok!' in one sentence."}]
    
    try:
        response_text, model_used, tokens, time_taken = AIService.generate_response(
            messages=messages,
            language='en',
            preferred_model='grok'
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
    print("🔧 X.AI Grok Setup Script")
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
    
    # Step 3: Test Grok
    test_grok()
    
    print("=" * 60)
    print("✅ Setup complete!")
    print()
    print("💡 You can now use Grok in your chatbot")
    print()
