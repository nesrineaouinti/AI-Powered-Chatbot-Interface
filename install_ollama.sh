#!/bin/bash

# 🦙 Ollama & LLaMA Installation Script
# This script installs Ollama and sets up LLaMA for your chatbot

set -e

echo "🦙 Installing Ollama and LLaMA..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Ollama is already installed
if command -v ollama &> /dev/null; then
    echo -e "${YELLOW}✓ Ollama is already installed${NC}"
    ollama --version
else
    echo "📥 Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo -e "${GREEN}✓ Ollama installed successfully${NC}"
fi

echo ""
echo "🚀 Starting Ollama service..."

# Start Ollama in the background
if pgrep -x "ollama" > /dev/null; then
    echo -e "${YELLOW}✓ Ollama is already running${NC}"
else
    ollama serve &
    sleep 3
    echo -e "${GREEN}✓ Ollama service started${NC}"
fi

echo ""
echo "📦 Pulling LLaMA 2 model..."
echo "   (This may take a few minutes - model size: ~3.8GB)"

# Pull LLaMA 2 model
ollama pull llama2

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "🧪 Testing LLaMA..."
echo ""

# Test LLaMA
ollama run llama2 "Say hello in one sentence"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ LLaMA is ready to use!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "   1. Configure Django backend:"
echo "      cd Back-end"
echo "      source venv/bin/activate"
echo "      python manage.py setup_ai_models --model llama"
echo ""
echo "   2. Test the API:"
echo "      curl http://localhost:11434/api/tags"
echo ""
echo "   3. Start your chatbot backend and frontend"
echo ""
echo "📚 Documentation: See LLAMA_SETUP_GUIDE.md"
echo ""
