# 🤖 AI-Powered Chatbot Interface

A modern full-stack AI chatbot application with multi-language support (English & Arabic), multiple AI models, and secure authentication.

## ✨ Key Features

- **🔐 Authentication**: Email/password + Google OAuth
- **🤖 AI Chatbot**: Multiple AI models (Groq, Llama, etc.)
- **🌍 Multi-Language**: English & Arabic with RTL support
- **💬 Real-Time Chat**: Persistent conversations with message history
- **🔒 Security**: JWT tokens, password hashing, CORS protection

## 🚀 Quick Start

### Backend Setup
```bash
cd Back-end
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd front-end
npm install
npm run dev
```

**URLs**: Backend (http://localhost:8000) | Frontend (http://localhost:5173)

## 📁 Project Structure

```
AI-Powered-Chatbot-Interface/
├── Back-end/              # Django REST API
│   ├── chatbot/          # Chatbot functionality
│   ├── users/            # Authentication
│   └── chatbot_backend/  # Main settings
└── front-end/            # React + TypeScript
    ├── src/
    │   ├── components/   # UI components
    │   ├── pages/        # Page components
    │   └── contexts/     # State management
    └── package.json
```

## 🔌 API Endpoints

**Authentication** (`/api/auth/`):
- `POST /signup/` - Register user
- `POST /login/` - Login
- `POST /google/` - Google OAuth
- `GET /profile/` - Get user profile

**Chatbot** (`/api/`):
- `GET/POST /chats/` - List/create chats
- `POST /chats/{id}/send_message/` - Send message & get AI response
- `GET /ai-models/` - Available AI models

## 🛠️ Tech Stack

**Backend**: Django, Django REST Framework, JWT, Google Auth
**Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui

## 📝 Notes

Built with modern technologies for production-ready deployment. See `Back-end/README.md` and `front-end/README.md` for detailed documentation.

---

I used Windsurf AI-assisted development tools