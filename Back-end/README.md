# AI Chatbot Backend - Django REST Framework

This is the backend API for the AI-Powered Chatbot Interface built with Django REST Framework.

## 🚀 Features

- **Django 5.2.6** - Modern Python web framework
- **Django REST Framework 3.16.1** - Powerful REST API toolkit
- **JWT Authentication** - Secure token-based authentication
- **User Management** - Complete authentication system (signup, login, logout)
- **Language Preferences** - Store user language choice (English/Arabic)
- **CORS Enabled** - Frontend integration ready
- **Token Blacklisting** - Secure logout implementation
- **Password Security** - PBKDF2-SHA256 hashing with validation
- **SQLite Database** - Development database (production-ready for PostgreSQL)

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
├── manage.py                  # Django management script
├── requirements.txt           # Python dependencies
├── venv/                      # Virtual environment
├── db.sqlite3                 # SQLite database
├── README.md                  # This file
├── SECURITY_DOCUMENTATION.md  # Detailed security guide
└── API_TESTING_GUIDE.md       # API testing instructions
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

The backend is configured to work with the React frontend running on ports 5173/5174. Make sure both servers are running for full functionality.
