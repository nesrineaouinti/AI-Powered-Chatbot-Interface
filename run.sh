#!/bin/bash

# ===============================================
# 🤖 AI-Powered Chatbot - Run Script
# Starts Backend (Django) and Frontend (React)
# ===============================================

echo "Starting AI-Powered Chatbot Application..."

# =======================
# 1️⃣ Start Backend
# =======================
echo "➡️ Starting Backend (Django REST Framework)..."
cd Back-end || exit 1

# Activate virtual environment if exists
if [ -d "venv" ]; then
  echo "Activating virtual environment..."
  source venv/bin/activate
fi

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Optional: create superuser if needed (comment out after first use)
# echo "Creating superuser..."
# python manage.py createsuperuser

# Start Django backend server
echo "Starting Django server on http://localhost:8000..."
# Run in background
nohup python manage.py runserver 0.0.0.0:8000 > backend.log 2>&1 &

# =======================
# 2️⃣ Start Frontend
# =======================
echo "➡️ Starting Frontend (React + Vite)..."
cd ../front-end || exit 1

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Start frontend dev server
echo "Starting React frontend on http://localhost:5173..."
nohup npm run dev > frontend.log 2>&1 &

# =======================
# 3️⃣ Completion Message
# =======================
echo "✅ Both Backend and Frontend are starting..."
echo "Logs:"
echo "  Backend: Back-end/backend.log"
echo "  Frontend: front-end/frontend.log"
echo ""
echo "Open your browser:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000/api/"

# Optional: keep terminal alive
wait
