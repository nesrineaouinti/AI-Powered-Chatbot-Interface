# 🤖 AI-Powered Chatbot Interface

A modern, production-ready full-stack AI chatbot application with **multi-language support** (English & Arabic), **multiple AI models**, and **beautiful UI**.

**Status**: ✅ Complete & Production-Ready  
**Stack**: Django REST + React + TypeScript  
**Features**: 3 AI Models | Multi-Language | Real-Time Chat | Google OAuth integration.

## ✨ Features

### 🔐 Authentication
- **Email/Password Registration & Login**
- **Google OAuth One-Click Sign-In**
- **JWT Token Authentication**
- **Secure Password Hashing** (PBKDF2-SHA256)
- **Token Blacklisting** for secure logout
- **Profile Management**
- **Language Preferences** (English/Arabic)

### 🛡️ Security
- Server-side Google token verification
- Password strength validation
- User enumeration prevention
- CORS protection
- SQL injection prevention
- XSS protection
- Token rotation and expiration

### 🌍 Internationalization
- English and Arabic language support
- User-specific language preferences
- Stored in database

### 🤖 AI Chatbot Features
- **6 AI Models**: Grok, LLaMA, Mock
- **Automatic Fallback**: Priority-based model selection
- **Multi-Language AI**: Responds in English or Arabic
- **Real-Time Chat**: Beautiful, responsive interface
- **Chat Management**: Create, archive, delete, search
- **User Summaries**: AI-generated user profiles
- **Message History**: Persistent conversation storage
---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Start Backend

```bash
cd Back-end

# Install dependencies
pip install -r requirements.txt

# Run migrations
python3 manage.py migrate

# Initialize AI models
python3 manage.py init_ai_models

# Create superuser (optional)
python3 manage.py createsuperuser

# Start server
python3 manage.py runserver
```

**Backend runs on**: http://localhost:8000

### 2. Start Frontend

```bash
cd front-end

# Install dependencies
npm install
npm install date-fns

# Start dev server
npm run dev
```

**Frontend runs on**: http://localhost:5173

### 3. Test It!

**AI Chatbot** (works immediately with mock AI):
1. Visit: http://localhost:5173/signup
2. Register with email/password
3. Click "Chat" button in navigation
4. Click "New Chat" to create a chat
5. Type a message and press Enter
6. Get AI response instantly! ✨

**With Real AI Models** (optional):
- Add API keys to `Back-end/.env`
- Restart backend server
- AI will use real models (OpenAI, Gemini, etc.)

**Google OAuth** (optional):
- Follow: `QUICK_START_GOOGLE_OAUTH.md`
- Get Google Client ID
- Configure and test!

---

## 📁 Project Structure

```
AI-Powered-Chatbot-Interface/
├── Back-end/       # Django REST Framework API
│   ├── chatbot/              # Chatbot App
│   ├── chatbot_backend/         # Main project settings
│   ├── users/                   # Authentication app
│   ├── manage.py
│   ├── requirements.txt
│   └── [Documentation files]
│
├── front-end/                   # React + TypeScript
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── hooks/               # Custom hooks
│   │   └── contexts/            # React contexts
│   ├── package.json
│   └── [Config files]
│
└── [Documentation files]
```

---

## 🔐 API Endpoints

### Authentication - Base URL: `http://localhost:8000/api/auth/`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/signup/` | POST | ❌ | Register with email/password |
| `/login/` | POST | ❌ | Login with username/email |
| `/google/` | POST | ❌ | **Google OAuth login/signup** |
| `/logout/` | POST | ✅ | Logout & blacklist token |
| `/profile/` | GET/PATCH | ✅ | View/update profile |
| `/change-password/` | POST | ✅ | Change password |
| `/token/refresh/` | POST | ❌ | Refresh access token |

### AI Chatbot - Base URL: `http://localhost:8000/api/`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/chats/` | GET | ✅ | List all user's chats |
| `/chats/` | POST | ✅ | Create new chat |
| `/chats/{id}/` | GET | ✅ | Get chat with messages |
| `/chats/{id}/send_message/` | POST | ✅ | **Send message & get AI response** ⭐ |
| `/chats/{id}/archive/` | POST | ✅ | Archive/unarchive chat |
| `/chats/{id}/` | DELETE | ✅ | Delete chat |
| `/chats/statistics/` | GET | ✅ | Get user statistics |
| `/summaries/generate/` | POST | ✅ | Generate AI user summary |
| `/ai-models/` | GET | ✅ | List available AI models |

---

## 🧪 Testing

### Backend Tests
```bash
cd Back-end
source venv/bin/activate
python manage.py test users
```

**Result**: 14 tests passing ✅

---

## 🛠️ Technology Stack

### Backend
- Django 5.2.6
- Django REST Framework 3.16.1
- djangorestframework-simplejwt 5.5.1
- google-auth 2.41.0
- django-cors-headers 4.9.0

### Frontend
- React 18.2.0
- TypeScript
- React Router DOM 6.20.0
- @react-oauth/google
- TailwindCSS 3.3.6
- shadcn/ui
- Framer Motion

---

## 🔒 Security Features

### Password Security
- ✅ PBKDF2-SHA256 hashing (260,000 iterations)
- ✅ Unique salt per password
- ✅ Password strength validation
- ✅ Passwords never returned in responses

### JWT Security
- ✅ Short-lived access tokens (60 minutes)
- ✅ Long-lived refresh tokens (7 days)
- ✅ Token rotation on refresh
- ✅ Token blacklisting on logout
- ✅ HS256 signing algorithm

### Google OAuth Security
- ✅ Server-side token verification
- ✅ Token signature validation
- ✅ Email verification requirement
- ✅ Issuer validation
- ✅ No password storage for OAuth users

---

## 🌍 Language Support

Users can select their preferred language:
- **English** (`en`) - Default
- **Arabic** (`ar`)

Language preference is:
- Stored in database
- Persists across sessions
- Can be updated anytime
- Returned in user profile

---

## 🎯 Configuration

### Backend Configuration

**Required for Google OAuth:**

Edit `/Back-end/chatbot_backend/settings.py`:
```python
GOOGLE_OAUTH_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'
```

### Frontend Configuration

**Required for Google OAuth:**

Edit `/front-end/src/App.tsx`:
```typescript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
```

**Get your Client ID from**: https://console.cloud.google.com/apis/credentials

---

## 🐛 Troubleshooting

### Backend not starting?
- Check Python version (3.10+)
- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`
- Run migrations: `python manage.py migrate`

### Frontend not starting?
- Check Node.js version (18+)
- Install dependencies: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Google OAuth not working?
- Verify Client ID is set in both backend and frontend
- Check authorized origins in Google Cloud Console
- Ensure both servers are running
- Check browser console for errors

**See full troubleshooting guide in**: `GOOGLE_OAUTH_SETUP.md`

---

## 📞 Support

### Documentation
- Check the comprehensive documentation files
- Review API testing guide
- Read security documentation

### Common Issues
- See troubleshooting sections in documentation
- Check browser console for frontend errors
- Check Django logs for backend errors

---

## 🎉 Features Summary

✅ **Complete Authentication System**
- Traditional email/password
- Google OAuth one-click login
- JWT token management
- Secure logout

✅ **User Management**
- Profile viewing and editing
- Language preferences
- Profile pictures (from Google)
- Password changes

✅ **Security**
- Industry-standard encryption
- Token-based authentication
- Server-side OAuth verification
- Protection against common attacks

✅ **Developer Experience**
- Comprehensive documentation
- Code examples
- Testing guides
- Quick start guides

---

## 📄 License

This project is for interview/demonstration purposes.

---

## 🙏 Acknowledgments

Built with:
- Django REST Framework
- React + TypeScript
- Google OAuth
- shadcn/ui
- TailwindCSS

---

## 📝 Notes

### For Development
- Backend: http://localhost:8000
- Frontend: http://localhost:5174
- Admin Panel: http://localhost:8000/admin/

### For Production
- Update all `localhost` references
- Enable HTTPS
- Use environment variables
- Configure production database
- Set up proper logging

---

**🚀 Ready to start? Follow the Quick Start section above!**

**📚 Need help? Check the documentation files!**

**🎉 Enjoy your secure, modern authentication system!**
