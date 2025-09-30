# 🚀 Quick Reference Card

## Server Commands

```bash
# Start server
cd Back-end
source venv/bin/activate
python manage.py runserver

# Run tests
python manage.py test users

# Create superuser (admin access)
python manage.py createsuperuser
```

**Server URL**: `http://localhost:8000`
**Admin Panel**: `http://localhost:8000/admin/`

---

## API Endpoints

**Base URL**: `http://localhost:8000/api/auth/`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/signup/` | POST | No | Register |
| `/login/` | POST | No | Login |
| `/logout/` | POST | Yes | Logout |
| `/profile/` | GET/PATCH | Yes | View/Update profile |
| `/change-password/` | POST | Yes | Change password |
| `/token/refresh/` | POST | No | Refresh token |

---

## Quick Test Commands

### 1. Register
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "language_preference": "en"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "testuser",
    "password": "TestPass123!"
  }'
```

### 3. Get Profile (replace TOKEN)
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Change Language to Arabic
```bash
curl -X PATCH http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"language_preference": "ar"}'
```

---

## Security Features

✅ JWT Authentication (60 min access, 7 days refresh)
✅ PBKDF2-SHA256 Password Hashing
✅ Token Blacklisting on Logout
✅ CORS Protection
✅ User Enumeration Prevention
✅ Input Validation

---

## Language Preference

**Supported Languages:**
- `"en"` - English (default)
- `"ar"` - Arabic

**Set on registration or update via profile endpoint**

---

## Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Bad Request | Check request body format |
| 401 | Unauthorized | Check token or credentials |
| 403 | Forbidden | Endpoint requires authentication |

---

## Documentation Files

- `README.md` - Main documentation
- `SECURITY_DOCUMENTATION.md` - Security details
- `API_TESTING_GUIDE.md` - Testing instructions
- `IMPLEMENTATION_SUMMARY.md` - Complete overview
- `QUICK_REFERENCE.md` - This file

---

## Token Usage

**In Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Token Lifetime:**
- Access Token: 60 minutes
- Refresh Token: 7 days

**Refresh before expiration:**
```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```
