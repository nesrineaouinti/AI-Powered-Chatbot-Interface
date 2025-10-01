#!/usr/bin/env python3
"""
Test which Groq models are currently available
"""

import requests

api_key = "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"

print("\n🔍 Testing Groq Models...")
print("=" * 60)

# Common Groq model names to test
models_to_test = [
    "llama-3.3-70b-versatile",
    "llama-3.2-90b-text-preview",
    "llama-3.1-8b-instant",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    "gemma-7b-it",
    "gemma2-9b-it",
]

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

working_models = []

for model in models_to_test:
    print(f"\nTesting: {model}...", end=" ")
    
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Hi"}],
        "max_tokens": 10
    }
    
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ WORKS!")
            working_models.append(model)
        else:
            error = response.json().get('error', {})
            if 'decommissioned' in str(error):
                print("❌ Decommissioned")
            else:
                print(f"❌ Error: {error.get('message', 'Unknown')[:50]}")
    except Exception as e:
        print(f"❌ Error: {str(e)[:50]}")

print("\n" + "=" * 60)
print(f"\n✅ Working Models ({len(working_models)}):")
for model in working_models:
    print(f"  - {model}")

if working_models:
    print(f"\n💡 Use this model: {working_models[0]}")
else:
    print("\n❌ No working models found! Check your API key.")

print()
