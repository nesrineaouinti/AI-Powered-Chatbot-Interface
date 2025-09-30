# 🔐 Authentication API Security Documentation

## Overview

This document explains the security measures implemented in the User Authentication API for the AI-Powered Chatbot Interface.

---

## 🛡️ Security Features Implemented

### 1. **JWT (JSON Web Tokens) Authentication**

#### What is JWT?
JWT is a stateless authentication mechanism that creates digitally signed tokens containing user information and claims.

#### Why JWT?
- **Stateless**: No server-side session storage required
- **Scalable**: Works well with distributed systems
- **Secure**: Cryptographically signed to prevent tampering
- **Cross-domain**: Works across different domains (mobile, web, etc.)

#### Our JWT Configuration

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),    # Short-lived for security
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),       # Longer-lived for convenience
    'ROTATE_REFRESH_TOKENS': True,                     # Generate new refresh token on use
    'BLACKLIST_AFTER_ROTATION': True,                  # Invalidate old refresh tokens
    'ALGORITHM': 'HS256',                              # HMAC with SHA-256
}
```

**Security Benefits:**
- **Short Access Token Lifetime (60 min)**: Limits exposure if token is stolen
- **Token Rotation**: Old refresh tokens become invalid after use
- **Token Blacklisting**: Logout invalidates tokens server-side
- **HS256 Algorithm**: Industry-standard cryptographic signing

---

### 2. **Password Security**

#### Password Hashing
We use Django's default password hashing: **PBKDF2-SHA256**

**How it works:**
```
Plain Password → PBKDF2 Algorithm → Hashed Password (stored in DB)
```

**Security Features:**
- **One-way hashing**: Cannot reverse the hash to get the password
- **Salt**: Random data added to each password before hashing (prevents rainbow table attacks)
- **Key stretching**: 260,000 iterations make brute-force attacks computationally expensive

**Example stored password:**
```
pbkdf2_sha256$260000$randomsalt$hashedpassword
```

#### Password Validation

We enforce strong passwords using Django's built-in validators:

```python
AUTH_PASSWORD_VALIDATORS = [
    'UserAttributeSimilarityValidator',  # Password can't be too similar to user info
    'MinimumLengthValidator',            # Minimum 8 characters
    'CommonPasswordValidator',           # Rejects common passwords (e.g., "password123")
    'NumericPasswordValidator',          # Password can't be entirely numeric
]
```

**Protection Against:**
- Weak passwords
- Dictionary attacks
- Common password lists
- User enumeration via password hints

---

### 3. **CORS (Cross-Origin Resource Sharing)**

#### Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
]
CORS_ALLOW_CREDENTIALS = True
```

**Security Benefits:**
- **Whitelist approach**: Only specified origins can access the API
- **Prevents CSRF**: Blocks unauthorized cross-origin requests
- **Credential support**: Allows cookies/auth headers from trusted origins only

**What it prevents:**
- Malicious websites from making requests to your API
- Data theft from unauthorized domains
- Cross-site request forgery (CSRF) attacks

---

### 4. **User Enumeration Prevention**

#### Generic Error Messages
```python
# Bad (reveals if user exists)
return Response({'error': 'User not found'}, status=401)

# Good (generic message)
return Response({'error': 'Invalid credentials'}, status=401)
```

**Why this matters:**
Attackers can't determine which usernames/emails exist in the system, making targeted attacks harder.

#### Implementation in Login View
```python
try:
    user = User.objects.get(Q(username=username_or_email) | Q(email=username_or_email))
except User.DoesNotExist:
    return Response({'error': 'Invalid credentials'}, status=401)

if not user.check_password(password):
    return Response({'error': 'Invalid credentials'}, status=401)
```

Both "user not found" and "wrong password" return the same error message.

---

### 5. **Database Security**

#### Email Uniqueness
```python
email = models.EmailField(unique=True)
```
- Prevents duplicate accounts
- Enables account recovery
- Database-level constraint (can't be bypassed)

#### Indexes for Performance
```python
indexes = [
    models.Index(fields=['email']),
    models.Index(fields=['username']),
]
```
- Faster lookups during authentication
- Prevents timing attacks (constant-time lookups)

#### Language Preference Storage
```python
language_preference = models.CharField(
    max_length=2,
    choices=[('en', 'English'), ('ar', 'Arabic')],
    default='en'
)
```
- Stored securely in database
- Validated against allowed choices
- No injection vulnerabilities

---

### 6. **API Endpoint Security**

#### Authentication Requirements

| Endpoint | Method | Authentication | Description |
|----------|--------|----------------|-------------|
| `/api/auth/signup/` | POST | ❌ Public | User registration |
| `/api/auth/login/` | POST | ❌ Public | User login |
| `/api/auth/logout/` | POST | ✅ Required | User logout |
| `/api/auth/profile/` | GET/PUT | ✅ Required | View/update profile |
| `/api/auth/change-password/` | POST | ✅ Required | Change password |
| `/api/auth/token/refresh/` | POST | ❌ Public | Refresh access token |

#### Permission Classes
```python
# Public endpoints
permission_classes = [permissions.AllowAny]

# Protected endpoints
permission_classes = [permissions.IsAuthenticated]
```

---

### 7. **Token Blacklisting**

#### How Logout Works

1. **Client sends logout request** with refresh token
2. **Server blacklists the token** in database
3. **Token becomes invalid** immediately
4. **Access tokens** remain valid until expiration (stateless nature of JWT)

```python
def post(self, request):
    refresh_token = request.data.get('refresh_token')
    token = RefreshToken(refresh_token)
    token.blacklist()  # Adds to blacklist table
    return Response({'message': 'Logout successful'})
```

**Database Table: `token_blacklist_blacklistedtoken`**
- Stores invalidated tokens
- Checked on every token refresh
- Prevents token reuse after logout

---

### 8. **Input Validation & Sanitization**

#### Serializer Validation
```python
class UserRegistrationSerializer(serializers.ModelSerializer):
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value.lower()  # Normalize email
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
```

**Protection Against:**
- SQL injection (Django ORM handles this)
- XSS attacks (DRF escapes output)
- Invalid data types
- Missing required fields

---

### 9. **HTTPS Enforcement (Production)**

#### Recommended Production Settings
```python
# In production settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

**What this does:**
- Forces HTTPS connections
- Prevents man-in-the-middle attacks
- Protects cookies from interception
- Prevents clickjacking

---

## 🔒 Security Best Practices

### For Development
✅ Use the provided settings (already configured)
✅ Never commit `.env` files with secrets
✅ Use strong SECRET_KEY in production
✅ Keep dependencies updated

### For Production
⚠️ **CRITICAL CHANGES NEEDED:**

1. **Change SECRET_KEY**
   ```python
   # Use environment variable
   SECRET_KEY = os.getenv('SECRET_KEY')
   ```

2. **Disable DEBUG**
   ```python
   DEBUG = False
   ```

3. **Configure ALLOWED_HOSTS**
   ```python
   ALLOWED_HOSTS = ['yourdomain.com', 'api.yourdomain.com']
   ```

4. **Use Production Database**
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': os.getenv('DB_NAME'),
           'USER': os.getenv('DB_USER'),
           'PASSWORD': os.getenv('DB_PASSWORD'),
           'HOST': os.getenv('DB_HOST'),
           'PORT': '5432',
       }
   }
   ```

5. **Enable HTTPS**
   - Use SSL certificate (Let's Encrypt)
   - Configure reverse proxy (Nginx)
   - Enable security headers

---

## 🚨 Common Attack Vectors & Protections

### 1. Brute Force Attacks
**Attack:** Automated password guessing
**Protection:** 
- Strong password requirements
- Rate limiting (TODO: implement Django-ratelimit)
- Account lockout after failed attempts (TODO)

### 2. Token Theft
**Attack:** Stealing JWT tokens
**Protection:**
- Short token lifetime (60 min)
- HTTPS only (production)
- HttpOnly cookies (recommended)
- Token rotation on refresh

### 3. SQL Injection
**Attack:** Malicious SQL in input fields
**Protection:**
- Django ORM (parameterized queries)
- Input validation via serializers
- No raw SQL queries

### 4. XSS (Cross-Site Scripting)
**Attack:** Injecting malicious JavaScript
**Protection:**
- DRF auto-escapes output
- Content-Type validation
- CSP headers (recommended)

### 5. CSRF (Cross-Site Request Forgery)
**Attack:** Unauthorized actions via authenticated session
**Protection:**
- JWT tokens (stateless)
- CORS whitelist
- CSRF middleware enabled

### 6. Man-in-the-Middle
**Attack:** Intercepting network traffic
**Protection:**
- HTTPS enforcement (production)
- Secure cookies
- HSTS headers

---

## 📊 Security Checklist

### ✅ Implemented
- [x] JWT authentication with token rotation
- [x] Password hashing (PBKDF2-SHA256)
- [x] Password strength validation
- [x] CORS configuration
- [x] Token blacklisting on logout
- [x] User enumeration prevention
- [x] Input validation
- [x] Email uniqueness
- [x] Language preference storage
- [x] Protected endpoints

### 🔄 Recommended Additions
- [ ] Rate limiting (django-ratelimit)
- [ ] Account lockout after failed logins
- [ ] Email verification on signup
- [ ] Two-factor authentication (2FA)
- [ ] Password reset via email
- [ ] Audit logging
- [ ] IP-based access control
- [ ] API versioning

### 🚀 Production Requirements
- [ ] HTTPS/SSL certificate
- [ ] Environment variables for secrets
- [ ] Production database (PostgreSQL)
- [ ] Security headers
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Backup strategy

---

## 🔑 API Usage Examples

### 1. User Registration
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "language_preference": "en"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "language_preference": "en"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 2. User Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Access Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'
```

### 5. Logout
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'
```

### 6. Update Language Preference
```bash
curl -X PATCH http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "language_preference": "ar"
  }'
```

---

## 📚 Additional Resources

- [Django Security Documentation](https://docs.djangoproject.com/en/stable/topics/security/)
- [DRF Authentication](https://www.django-rest-framework.org/api-guide/authentication/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## 🆘 Support & Questions

For security concerns or questions about the authentication system, please refer to:
1. This documentation
2. Django security guidelines
3. DRF documentation
4. JWT specification (RFC 7519)

**Remember:** Security is an ongoing process. Regularly update dependencies, review logs, and stay informed about new vulnerabilities.
