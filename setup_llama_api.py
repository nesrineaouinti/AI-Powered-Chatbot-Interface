#!/usr/bin/env python3
"""
Quick setup script for LLaMA via API
No local installation needed!
"""

import os
import sys

# Add Django project to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Back-end'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_backend.settings')

import django
django.setup()

from chatbot.models import AIModelConfig

def setup_together_ai():
    """Setup LLaMA via Together AI"""
    print("\n🦙 Setting up LLaMA via Together AI")
    print("=" * 50)
    
    api_key = input("\n📝 Enter your Together AI API key: ").strip()
    
    if not api_key:
        print("❌ API key is required!")
        return False
    
    # Delete existing LLaMA config
    AIModelConfig.objects.filter(name='llama').delete()
    
    # Create new config
    config = AIModelConfig.objects.create(
        name='llama',
        api_endpoint='https://api.together.xyz/v1/chat/completions',
        api_key=api_key,
        max_tokens=2000,
        temperature=0.7,
        supports_english=True,
        supports_arabic=True,
        is_active=True,
        priority=3
    )
    
    print(f"\n✅ LLaMA 2 70B (Together AI) configured successfully!")
    return True

def setup_groq():
    """Setup LLaMA via Groq (fastest)"""
    print("\n⚡ Setting up LLaMA via Groq (Ultra Fast)")
    print("=" * 50)
    
    api_key = input("\n📝 Enter your Groq API key: ").strip()
    
    if not api_key:
        print("❌ API key is required!")
        return False
    
    # Delete existing LLaMA config
    AIModelConfig.objects.filter(name='llama').delete()
    
    # Create new config
    config = AIModelConfig.objects.create(
        name='llama',
        api_endpoint='https://api.groq.com/openai/v1/chat/completions',
        api_key=api_key,
        max_tokens=2000,
        temperature=0.7,
        supports_english=True,
        supports_arabic=True,
        is_active=True,
        priority=3
    )
    
    print(f"\n✅ LLaMA 3 (Groq) configured successfully!")
    return True

def setup_huggingface():
    """Setup LLaMA via Hugging Face"""
    print("\n🤗 Setting up LLaMA via Hugging Face")
    print("=" * 50)
    
    api_key = input("\n📝 Enter your Hugging Face token: ").strip()
    
    if not api_key:
        print("❌ API token is required!")
        return False
    
    # Delete existing LLaMA config
    AIModelConfig.objects.filter(name='llama').delete()
    
    # Create new config
    config = AIModelConfig.objects.create(
        name='llama',
        api_endpoint='https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf',
        api_key=api_key,
        max_tokens=2000,
        temperature=0.7,
        supports_english=True,
        supports_arabic=True,
        is_active=True,
        priority=3
    )
    
    print(f"\n✅ LLaMA 2 (Hugging Face) configured successfully!")
    return True

def test_configuration():
    """Test the LLaMA configuration"""
    print("\n🧪 Testing LLaMA configuration...")
    print("=" * 50)
    
    from chatbot.ai_service import AIService
    
    try:
        messages = [{"role": "user", "content": "Say hello in one sentence"}]
        response, model, tokens, time_taken = AIService.generate_response(
            messages,
            language='en',
            preferred_model='llama'
        )
        
        print(f"\n✅ Test successful!")
        print(f"📝 Model: {model}")
        print(f"💬 Response: {response}")
        print(f"🎯 Tokens: {tokens}")
        print(f"⏱️  Time: {time_taken:.2f}s")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        return False

def list_models():
    """List all configured models"""
    print("\n📋 Configured AI Models:")
    print("=" * 50)
    
    models = AIModelConfig.objects.filter(is_active=True).order_by('-priority')
    
    if not models:
        print("No models configured yet.")
        return
    
    for model in models:
        langs = []
        if model.supports_english:
            langs.append('EN')
        if model.supports_arabic:
            langs.append('AR')
        
        print(f"\n✓ {model.name.upper()}")
        print(f"  Priority: {model.priority}")
        print(f"  Languages: {', '.join(langs)}")
        print(f"  Endpoint: {model.api_endpoint}")
        print(f"  Has API Key: {'Yes' if model.api_key else 'No'}")

def main():
    print("\n" + "=" * 50)
    print("🦙 LLaMA API Setup (No Local Installation)")
    print("=" * 50)
    
    print("\nChoose your provider:")
    print("1. Together AI (Recommended - Free tier available)")
    print("2. Groq (Fastest - Free tier available)")
    print("3. Hugging Face (Free tier - Rate limited)")
    print("4. List configured models")
    print("5. Test configuration")
    print("6. Exit")
    
    choice = input("\nEnter your choice (1-6): ").strip()
    
    if choice == '1':
        if setup_together_ai():
            test = input("\n🧪 Test configuration now? (y/n): ").strip().lower()
            if test == 'y':
                test_configuration()
    
    elif choice == '2':
        if setup_groq():
            test = input("\n🧪 Test configuration now? (y/n): ").strip().lower()
            if test == 'y':
                test_configuration()
    
    elif choice == '3':
        if setup_huggingface():
            test = input("\n🧪 Test configuration now? (y/n): ").strip().lower()
            if test == 'y':
                test_configuration()
    
    elif choice == '4':
        list_models()
    
    elif choice == '5':
        test_configuration()
    
    elif choice == '6':
        print("\n👋 Goodbye!")
        return
    
    else:
        print("\n❌ Invalid choice!")
    
    print("\n" + "=" * 50)
    print("✅ Setup complete! Start your backend and frontend to use LLaMA.")
    print("=" * 50)
    print("\nNext steps:")
    print("1. cd Back-end && python manage.py runserver")
    print("2. cd front-end && npm run dev")
    print("3. Open http://localhost:5173 and start chatting!")
    print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Setup cancelled.")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
