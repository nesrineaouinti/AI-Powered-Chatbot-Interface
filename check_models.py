#!/usr/bin/env python3
"""
Quick script to check and configure AI models
"""

import os
import sys

# Add Django project to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Back-end'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_backend.settings')

import django
django.setup()

from chatbot.models import AIModelConfig

print("\n" + "=" * 60)
print("🤖 Current AI Model Configuration")
print("=" * 60)

models = AIModelConfig.objects.all()

if not models:
    print("\n❌ No AI models configured!")
    print("\nTo configure models, run:")
    print("  python3 setup_llama_api.py")
else:
    print(f"\n✅ Found {models.count()} model(s):\n")
    
    for model in models:
        print(f"📋 Model: {model.name.upper()}")
        print(f"   Active: {'✓ Yes' if model.is_active else '✗ No'}")
        print(f"   Priority: {model.priority}")
        print(f"   Endpoint: {model.api_endpoint}")
        print(f"   Has API Key: {'✓ Yes' if model.api_key else '✗ No'}")
        print(f"   English: {'✓' if model.supports_english else '✗'}")
        print(f"   Arabic: {'✓' if model.supports_arabic else '✗'}")
        print()

print("=" * 60)

# Quick setup for Grok
print("\n🚀 Quick Setup Options:")
print("\n1. Setup Grok")
print("2. Setup LLaMA (via Groq)")
print("3. Setup DeepSeek")
print("4. Exit")

choice = input("\nEnter choice (1-4): ").strip()

if choice == '1':
    print("\n🤖 Setting up Grok...")
    api_key = input("Enter Grok API key: ").strip()
    
    if api_key:
        AIModelConfig.objects.filter(name='grok').delete()
        AIModelConfig.objects.create(
            name='grok',
            api_endpoint='https://api.x.ai/v1/chat/completions',
            api_key=api_key,
            max_tokens=2000,
            temperature=0.7,
            supports_english=True,
            supports_arabic=True,
            is_active=True,
            priority=2
        )
        print("✅ Grok configured successfully!")
    else:
        print("❌ API key required!")

elif choice == '2':
    print("\n🦙 Setting up LLaMA via Groq...")
    api_key = input("Enter Groq API key: ").strip()
    
    if api_key:
        AIModelConfig.objects.filter(name='llama').delete()
        AIModelConfig.objects.create(
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
        print("✅ LLaMA (Groq) configured successfully!")
    else:
        print("❌ API key required!")

elif choice == '3':
    print("\n🧠 Setting up DeepSeek...")
    api_key = input("Enter DeepSeek API key: ").strip()
    
    if api_key:
        AIModelConfig.objects.filter(name='deepseek').delete()
        AIModelConfig.objects.create(
            name='deepseek',
            api_endpoint='https://api.deepseek.com/v1/chat/completions',
            api_key=api_key,
            max_tokens=2000,
            temperature=0.7,
            supports_english=True,
            supports_arabic=True,
            is_active=True,
            priority=1
        )
        print("✅ DeepSeek configured successfully!")
    else:
        print("❌ API key required!")

print("\n✅ Done! Restart your backend server to use the new configuration.")
print()
