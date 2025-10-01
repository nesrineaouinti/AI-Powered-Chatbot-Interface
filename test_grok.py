#!/usr/bin/env python3
"""
Test Grok API directly
"""

import requests
import json

print("\n🤖 Testing Grok API")
print("=" * 50)

api_key = input("Enter your Grok API key: ").strip()

if not api_key:
    print("❌ API key required!")
    exit(1)

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "grok-beta",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Say hello in one sentence"}
    ],
    "max_tokens": 100,
    "temperature": 0.7
}

print("\n📡 Sending request to Grok API...")

try:
    response = requests.post(
        "https://api.x.ai/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        message = data['choices'][0]['message']['content']
        tokens = data.get('usage', {}).get('total_tokens', 0)
        
        print("\n✅ Success!")
        print(f"💬 Response: {message}")
        print(f"🎯 Tokens: {tokens}")
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"\n❌ Error: {str(e)}")

print()
