# 🤖 AI-Powered Chatbot Interface

A modern, secure chatbot application with complete authentication system including traditional email/password and Google OAuth integration.

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

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Start Backend

```bash
cd Back-end
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

**Backend runs on**: http://localhost:8000

### 2. Start Frontend

```bash
cd front-end
npm install  # First time only
npm run dev
```

**Frontend runs on**: http://localhost:5174

### 3. Test It!

**Traditional Auth** (works immediately):
- Visit: http://localhost:5174/signup
- Register with email/password
- Login and start chatting!

**Google OAuth** (requires 5-min setup):
- Follow: `QUICK_START_GOOGLE_OAUTH.md`
- Get Google Client ID
- Configure and test!

---

## 📁 Project Structure

```
AI-Powered-Chatbot-Interface/
├── Back-end/                    # Django REST Framework API
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

## 📚 Documentation

### Getting Started
- **`QUICK_START_GOOGLE_OAUTH.md`** - 5-minute Google OAuth setup
- **`COMPLETE_IMPLEMENTATION_SUMMARY.md`** - Full feature overview

### Google OAuth
- **`GOOGLE_OAUTH_SETUP.md`** - Complete setup guide
- **`GOOGLE_OAUTH_IMPLEMENTATION.md`** - Implementation details

### Backend
- **`Back-end/README.md`** - Backend documentation
- **`Back-end/SECURITY_DOCUMENTATION.md`** - Security guide (20+ pages)
- **`Back-end/API_TESTING_GUIDE.md`** - API testing instructions
- **`Back-end/QUICK_REFERENCE.md`** - Quick command reference

---

## 🔐 API Endpoints

### Base URL: `http://localhost:8000/api/auth/`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/signup/` | POST | ❌ | Register with email/password |
| `/login/` | POST | ❌ | Login with username/email |
| `/google/` | POST | ❌ | **Google OAuth login/signup** |
| `/logout/` | POST | ✅ | Logout & blacklist token |
| `/profile/` | GET/PATCH | ✅ | View/update profile |
| `/change-password/` | POST | ✅ | Change password |
| `/token/refresh/` | POST | ❌ | Refresh access token |

---

## 🧪 Testing

### Backend Tests
```bash
cd Back-end
source venv/bin/activate
python manage.py test users
```

**Result**: 14 tests passing ✅

### Manual API Testing

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

## 📊 Database Schema

### User Model
```python
- username (unique)
- email (unique)
- password (hashed)
- first_name
- last_name
- language_preference ('en' or 'ar')
- google_id (unique, nullable)
- profile_picture (URL, nullable)
- is_oauth_user (boolean)
- created_at
- updated_at
```

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

## 📈 What's Next?

### Immediate
- [x] JWT Authentication ✅
- [x] Google OAuth ✅
- [x] Language Preferences ✅
- [x] Profile Management ✅

### Optional Enhancements
- [ ] Add GitHub OAuth
- [ ] Add Facebook OAuth
- [ ] Implement 2FA
- [ ] Add email verification
- [ ] Add password reset via email
- [ ] Add rate limiting
- [ ] Add audit logging

### Production Deployment
- [ ] Move to PostgreSQL
- [ ] Enable HTTPS
- [ ] Set up environment variables
- [ ] Configure production domain
- [ ] Set up monitoring
- [ ] Deploy to cloud provider

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
