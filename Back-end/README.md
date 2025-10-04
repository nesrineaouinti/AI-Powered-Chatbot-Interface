# AI Chatbot Backend - Django REST Framework

This is the backend API for the AI-Powered Chatbot Interface built with Django REST Framework. Provides comprehensive chat management, AI model integration, user authentication, and multi-language support.

## 🚀 Features

### 🤖 Chatbot & AI Integration
- **Chat Management** - Create, retrieve, and manage chat conversations
- **Message Handling** - Send messages and receive AI responses
- **AI Model Support** - Multiple AI models (Groq, Llama, etc.)
- **User Summaries** - Generate conversation summaries and insights
- **Token Tracking** - Monitor token usage and response times

### 🔐 Authentication & User Management
- **Django 5.2.6** - Modern Python web framework
- **Django REST Framework 3.16.1** - Powerful REST API toolkit
- **JWT Authentication** - Secure token-based authentication
- **User Management** - Complete authentication system (signup, login, logout)
- **Language Preferences** - Store user language choice (English/Arabic)
- **Profile Management** - User profile updates and preferences

### 🛡️ Security & Performance
- **CORS Enabled** - Frontend integration ready
- **Token Blacklisting** - Secure logout implementation
- **Password Security** - PBKDF2-SHA256 hashing with validation
- **SQLite Database** - Development database (production-ready for PostgreSQL)
- **Input Validation** - Comprehensive request validation

## 📋 Prerequisites

- Python 3.10+
- pip
- virtualenv

## 🛠️ Installation

1. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate  # On Linux/Mac
   # or
   venv\Scripts\activate  # On Windows
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

## 🏃 Running the Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

## 📁 Project Structure

```
Back-end/
├── chatbot_backend/           # Main project configuration
│   ├── __init__.py
│   ├── settings.py            # Project settings (JWT, CORS, etc.)
│   ├── urls.py                # Main URL routing
│   ├── wsgi.py
│   └── asgi.py
├── chatbot/                   # Chatbot functionality app
│   ├── migrations/            # Database migrations for chat models
│   ├── __init__.py
│   ├── admin.py               # Admin interface for chat models
│   ├── ai_service.py          # AI model integration service
│   ├── apps.py
│   ├── models.py              # Chat, Message, UserSummary models
│   ├── serializers.py         # API serializers for chat data
│   ├── utils.py               # Chatbot utility functions
│   ├── views.py               # Chat API views and viewsets
│   ├── urls.py                # Chatbot API endpoints
│   └── tests.py               # Chatbot unit tests
├── users/                     # User authentication app
│   ├── migrations/            # Database migrations
│   ├── __init__.py
│   ├── admin.py               # Admin interface configuration
│   ├── apps.py
│   ├── models.py              # User model with language preference
│   ├── serializers.py         # API serializers
│   ├── views.py               # Authentication views
│   ├── urls.py                # Authentication endpoints
│   └── tests.py               # Unit tests
├── logs/                      # Application logs directory
├── manage.py                  # Django management script
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
├── create_superuser.py       # Superuser creation script
├── venv/                     # Virtual environment
├── db.sqlite3                # SQLite database
├── backend.log               # Application log file
├── README.md                 # This file
├── SECURITY_DOCUMENTATION.md # Detailed security guide
└── API_TESTING_GUIDE.md      # API testing instructions
```

## 🔧 Configuration

### CORS Settings
The backend is configured to accept requests from:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`

### JWT Authentication
- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 7 days
- **Token Rotation**: Enabled (new refresh token on each use)
- **Token Blacklisting**: Enabled (secure logout)
- **Algorithm**: HS256 (HMAC with SHA-256)

### REST Framework
- **Authentication**: JWT + Session-based
- **Default Permission**: IsAuthenticatedOrReadOnly
- **Pagination**: 10 items per page

## 🔐 Authentication API Endpoints

### Base URL: `http://localhost:8000/api/auth/`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/signup/` | POST | No | Register new user |
| `/login/` | POST | No | Login (username or email) |
| `/logout/` | POST | Yes | Logout and blacklist token |
| `/profile/` | GET | Yes | Get user profile |
| `/profile/` | PUT/PATCH | Yes | Update profile/language |
| `/change-password/` | POST | Yes | Change password |
| `/token/refresh/` | POST | No | Refresh access token |

## 🤖 Chatbot API Endpoints

### Base URL: `http://localhost:8000/api/`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/chats/` | GET | Yes | List user's chats |
| `/chats/` | POST | Yes | Create new chat |
| `/chats/{id}/` | GET | Yes | Get specific chat with messages |
| `/chats/{id}/` | DELETE | Yes | Delete chat |
| `/chats/{id}/archive/` | POST | Yes | Archive/unarchive chat |
| `/messages/` | POST | Yes | Send message and get AI response |
| `/summaries/` | POST | Yes | Generate user conversation summary |
| `/ai-models/` | GET | Yes | Get available AI models |

### Chatbot API Examples

**Create a new chat:**
```bash
curl -X POST http://localhost:8000/api/chats/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat", "language": "en"}'
```

**Send a message:**
```bash
curl -X POST http://localhost:8000/api/messages/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": 1,
    "content": "Hello, how are you?",
    "language": "en",
    "ai_model": "groq"
  }'
```

**Get chat with messages:**
```bash
curl -X GET http://localhost:8000/api/chats/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Quick Test Example

**Register a user:**
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "language_preference": "en"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "testuser",
    "password": "SecurePass123!"
  }'
```

**Access protected endpoint:**
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

For detailed API testing instructions, see [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

## 🤖 Chatbot Models & Features

### Chat Model
- **ID**: Unique identifier for each chat
- **User**: Foreign key to authenticated user
- **Title**: Chat title (auto-generated from first message if empty)
- **Language**: Chat language (English 'en' or Arabic 'ar')
- **Timestamps**: Created and updated timestamps
- **Archive Status**: Boolean flag for archived chats
- **Message Count**: Total number of messages in chat

### Message Model
- **ID**: Unique identifier for each message
- **Chat**: Foreign key to parent chat
- **Role**: Message type ('user', 'assistant', 'system')
- **Content**: Message text content
- **AI Model**: AI model used for assistant messages
- **Language**: Message language
- **Token Usage**: Number of tokens consumed
- **Response Time**: AI response time in seconds
- **Timestamps**: Message creation timestamp

### User Summary Model
- **User**: Foreign key to user
- **Language**: Summary language preference
- **Summary Text**: AI-generated summary of user conversations
- **Topics**: Extracted conversation topics
- **Common Queries**: Frequently asked questions
- **Statistics**: Chat count, message count, AI model usage

### AI Model Integration
The backend integrates with multiple AI services:
- **Groq** - Fast LLM inference service
- **Llama** - Meta's open-source models
- **Other models** - Extensible for additional AI providers

## 📝 User Model Features

### Custom User Model
- **Username**: Unique identifier
- **Email**: Unique, used for login and recovery
- **Password**: PBKDF2-SHA256 hashed (260,000 iterations)
- **Language Preference**: English ('en') or Arabic ('ar')
- **Timestamps**: Created and updated timestamps

### Language Preference
Users can store their preferred language (English or Arabic) which persists across sessions:
```json
{
  "language_preference": "ar"  // or "en"
}
```

## 🔐 Security Features

### Implemented Security Measures

✅ **JWT Token Authentication**
- Stateless authentication with cryptographically signed tokens
- Short-lived access tokens (60 min) to limit exposure
- Long-lived refresh tokens (7 days) for convenience
- Token rotation prevents token reuse
- Token blacklisting for secure logout

✅ **Password Security**
- PBKDF2-SHA256 hashing with 260,000 iterations
- Salted hashes prevent rainbow table attacks
- Password strength validation (min length, complexity)
- Passwords never returned in API responses

✅ **User Enumeration Prevention**
- Generic error messages for login failures
- Same response time for existing/non-existing users

✅ **CORS Protection**
- Whitelist approach (only trusted origins)
- Prevents unauthorized cross-origin requests

✅ **Input Validation**
- Django ORM prevents SQL injection
- Serializer validation for all inputs
- Email uniqueness enforcement

For detailed security documentation, see [SECURITY_DOCUMENTATION.md](SECURITY_DOCUMENTATION.md)

### ⚠️ Production Security Checklist

- [ ] Change `SECRET_KEY` (use environment variable)
- [ ] Set `DEBUG = False`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Enable HTTPS/SSL
- [ ] Use production database (PostgreSQL)
- [ ] Set secure cookie flags
- [ ] Enable security headers
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging

## 📚 Useful Commands

```bash
# Run migrations
python manage.py migrate

# Create migrations
python manage.py makemigrations

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Django shell
python manage.py shell
```

## 🤝 Integration with Frontend

The backend provides two main API groups:
- **`/api/auth/`** - User authentication and profile management
- **`/api/`** - Chatbot functionality (chats, messages, summaries, AI models)

The backend is configured to work with the React frontend running on ports 5173/5174. Make sure both servers are running for full functionality:

1. **Backend server**: `python manage.py runserver` (port 8000)
2. **Frontend server**: `npm run dev` (port 5173)

The API supports full CRUD operations for chats and messages, with JWT authentication ensuring secure access to user-specific data.
