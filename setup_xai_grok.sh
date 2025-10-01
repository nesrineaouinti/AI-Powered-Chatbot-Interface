#!/bin/bash
# Quick setup script for X.AI Grok API

echo "🔧 Setting up X.AI Grok API Key..."
echo ""

# The X.AI API key you provided
XAI_KEY="xai-MTziM2qMKqn3Tsjoo5ej46dpgVLsAqxpWrm3rFCmtuunJZrR3G5BVf8tm0ckaHPU4YQeJezVOcVj8Yl4"

# Update the .env file
cd Back-end

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Update or add GROK_API_KEY
if grep -q "^GROK_API_KEY=" .env; then
    echo "✏️  Updating existing GROK_API_KEY..."
    sed -i "s|^GROK_API_KEY=.*|GROK_API_KEY=$XAI_KEY|" .env
else
    echo "➕ Adding GROK_API_KEY..."
    echo "GROK_API_KEY=$XAI_KEY" >> .env
fi

echo "✅ X.AI Grok API key configured!"
echo ""
echo "📊 Reinitializing AI models..."
python manage.py init_ai_models

echo ""
echo "✅ Setup complete! Grok should now be active."
echo ""
echo "🧪 Test with:"
echo "   python ../test_ai_config.py"
