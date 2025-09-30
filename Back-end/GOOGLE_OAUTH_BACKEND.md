# 🔐 Google OAuth Backend Implementation

## Quick Reference

### Endpoint
```
POST /api/auth/google/
```

### Request
```json
{
  "token": "GOOGLE_ID_TOKEN",
  "language_preference": "en"  // optional: "en" or "ar"
}
```

### Response
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@gmail.com",
    "profile_picture": "https://...",
    "is_oauth_user": true,
    "language_preference": "en"
  },
  "tokens": {
    "access": "JWT_ACCESS_TOKEN",
    "refresh": "JWT_REFRESH_TOKEN"
  }
}
```

---

## Configuration

### 1. Set Google Client ID

Edit `/Back-end/chatbot_backend/settings.py`:

```python
GOOGLE_OAUTH_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'
```

Get your Client ID from: https://console.cloud.google.com/apis/credentials

### 2. Database Fields

The `User` model now includes:

```python
google_id = models.CharField(max_length=255, unique=True, null=True)
profile_picture = models.URLField(null=True)
is_oauth_user = models.BooleanField(default=False)
```

---

## How It Works

### 1. Token Verification

```python
idinfo = id_token.verify_oauth2_token(
    token,
    google_requests.Request(),
    settings.GOOGLE_OAUTH_CLIENT_ID
)
```

**Verifies:**
- Token signature (cryptographic verification)
- Token expiration
- Token audience (Client ID)
- Token issuer (Google)

### 2. User Creation/Retrieval

**Scenario A: New Google User**
```python
user = User.objects.create(
    username=generated_username,
    email=email_from_google,
    google_id=google_id,
    profile_picture=picture_url,
    is_oauth_user=True
)
user.set_unusable_password()  # No password needed
```

**Scenario B: Existing Google User**
```python
user = User.objects.filter(google_id=google_id).first()
# Update profile picture if changed
```

**Scenario C: Existing Email User**
```python
user = User.objects.filter(email=email).first()
# Link Google account
user.google_id = google_id
user.is_oauth_user = True
user.save()
```

### 3. JWT Token Generation

```python
refresh = RefreshToken.for_user(user)
tokens = {
    'refresh': str(refresh),
    'access': str(refresh.access_token)
}
```

---

## Security Features

✅ **Server-Side Token Verification**
- Validates token with Google's servers
- Prevents forged tokens

✅ **Email Verification Check**
```python
if not idinfo.get('email_verified', False):
    return error_response
```

✅ **Issuer Validation**
```python
if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
    return error_response
```

✅ **Unique Google ID**
- Database constraint prevents duplicate Google accounts

✅ **No Password Storage**
- OAuth users don't have passwords
- `set_unusable_password()` prevents password login

---

## Testing

### Test with cURL (requires real Google token)

```bash
curl -X POST http://localhost:8000/api/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{
    "token": "GOOGLE_ID_TOKEN_HERE",
    "language_preference": "en"
  }'
```

### Test from Frontend

```typescript
const response = await fetch('http://localhost:8000/api/auth/google/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: googleIdToken,
    language_preference: 'ar'
  })
});
```

---

## Error Handling

### Invalid Token
```json
{
  "error": "Invalid Google token",
  "details": "Token expired"
}
```

### Email Not Verified
```json
{
  "error": "Email not verified by Google"
}
```

### Invalid Issuer
```json
{
  "error": "Invalid token issuer"
}
```

---

## Database Schema

### User Model Fields

| Field | Type | Description |
|-------|------|-------------|
| `google_id` | CharField(255) | Google account ID (unique) |
| `profile_picture` | URLField | Google profile picture URL |
| `is_oauth_user` | BooleanField | True if registered via OAuth |
| `email` | EmailField | User email (unique) |
| `username` | CharField | Generated from email |

### Indexes

```python
indexes = [
    models.Index(fields=['email']),
    models.Index(fields=['username']),
]
```

---

## Dependencies

```
google-auth==2.41.0
google-auth-oauthlib==1.2.2
google-auth-httplib2==0.2.0
```

Install with:
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

---

## Admin Interface

View OAuth users in Django admin:

```python
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'is_oauth_user', 'google_id']
    list_filter = ['is_oauth_user']
```

Access at: `http://localhost:8000/admin/`

---

## Production Considerations

### Environment Variables

```python
# settings.py
import os
GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
```

### HTTPS Required

Google OAuth requires HTTPS in production:
```python
# Production settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
```

### Rate Limiting

Consider adding rate limiting:
```python
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='10/m')
def google_auth_view(request):
    ...
```

---

## Troubleshooting

### "Invalid token" Error

**Check:**
1. `GOOGLE_OAUTH_CLIENT_ID` matches Google Cloud Console
2. Token hasn't expired (Google tokens expire quickly)
3. Backend can reach Google's servers

### "Email not verified" Error

**Solution:**
- User must verify their email in Google account settings
- Or use a different Google account

### Username Conflicts

**Handled automatically:**
```python
username = email.split('@')[0]
counter = 1
while User.objects.filter(username=username).exists():
    username = f"{base_username}{counter}"
    counter += 1
```

---

## Code Reference

### View: `GoogleAuthView`

Location: `/Back-end/users/views.py`

```python
class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # 1. Validate request
        # 2. Verify Google token
        # 3. Extract user info
        # 4. Create/retrieve user
        # 5. Generate JWT tokens
        # 6. Return response
```

### Serializer: `GoogleAuthSerializer`

Location: `/Back-end/users/serializers.py`

```python
class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    language_preference = serializers.ChoiceField(
        choices=[('en', 'English'), ('ar', 'Arabic')],
        default='en'
    )
```

### URL: `/api/auth/google/`

Location: `/Back-end/users/urls.py`

```python
path('google/', GoogleAuthView.as_view(), name='google_auth'),
```

---

## Summary

✅ **Secure server-side token verification**
✅ **Automatic user creation/linking**
✅ **JWT token generation**
✅ **Profile picture import**
✅ **Language preference support**
✅ **No password required for OAuth users**
✅ **Production-ready implementation**
