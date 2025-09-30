# 🔐 Google OAuth Authentication Setup Guide

## Overview

This guide will help you set up Google OAuth authentication for both the backend (Django) and frontend (React) of your AI-Powered Chatbot Interface.

---

## 📋 Prerequisites

- Google Account
- Google Cloud Console access
- Backend server running (Django)
- Frontend server running (React)

---

## 🚀 Part 1: Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `AI-Chatbot-OAuth`
5. Click **"Create"**

### Step 2: Enable Google+ API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace)
3. Click **"Create"**

4. **Fill in the required information:**
   - **App name**: `AI Chatbot`
   - **User support email**: Your email
   - **App logo**: (Optional) Upload your logo
   - **Application home page**: `http://localhost:5174` (for development)
   - **Authorized domains**: Leave empty for development
   - **Developer contact information**: Your email

5. Click **"Save and Continue"**

6. **Scopes**: Click **"Add or Remove Scopes"**
   - Select:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **"Update"** → **"Save and Continue"**

7. **Test users** (for development):
   - Click **"Add Users"**
   - Add your Gmail addresses
   - Click **"Save and Continue"**

8. Click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**

4. **Configure the OAuth client:**
   - **Name**: `AI Chatbot Web Client`
   
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5174
     http://localhost:5173
     http://127.0.0.1:5174
     http://127.0.0.1:5173
     ```
   
   - **Authorized redirect URIs**:
     ```
     http://localhost:5174
     http://localhost:5173
     http://localhost:5174/signin
     http://localhost:5173/signin
     ```

5. Click **"Create"**

6. **Copy your credentials:**
   - **Client ID**: `123456789-abc...apps.googleusercontent.com`
   - **Client Secret**: (You won't need this for frontend-only OAuth)

7. Click **"OK"**

---

## 🔧 Part 2: Backend Configuration (Django)

### Step 1: Update Settings

Open `/Back-end/chatbot_backend/settings.py` and update:

```python
# Google OAuth Settings
GOOGLE_OAUTH_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE'
```

Replace `YOUR_ACTUAL_CLIENT_ID_HERE` with the Client ID you copied from Google Cloud Console.

**Example:**
```python
GOOGLE_OAUTH_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com'
```

### Step 2: Verify Backend is Running

```bash
cd Back-end
source venv/bin/activate
python manage.py runserver
```

Server should be running on: `http://localhost:8000`

### Step 3: Test the Google Auth Endpoint

The endpoint is available at:
```
POST http://localhost:8000/api/auth/google/
```

---

## ⚛️ Part 3: Frontend Configuration (React)

### Step 1: Update App.tsx

Open `/front-end/src/App.tsx` and update:

```typescript
// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE';
```

Replace `YOUR_ACTUAL_CLIENT_ID_HERE` with the same Client ID from Google Cloud Console.

**Example:**
```typescript
const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
```

### Step 2: Verify Frontend is Running

```bash
cd front-end
npm run dev
```

Server should be running on: `http://localhost:5174`

---

## 🧪 Part 4: Testing Google OAuth

### Test Flow

1. **Open your browser** and go to `http://localhost:5174/signin`

2. **Click the "Sign in with Google" button**

3. **Google OAuth Popup will appear:**
   - Select your Google account
   - Review permissions
   - Click "Continue"

4. **What happens behind the scenes:**
   - Frontend receives Google ID token
   - Frontend sends token to backend (`POST /api/auth/google/`)
   - Backend verifies token with Google
   - Backend creates/retrieves user
   - Backend returns JWT tokens
   - Frontend stores tokens and redirects to chatbot

5. **You should be redirected to** `/chatbot` and logged in!

### Manual API Test

You can also test the backend directly:

```bash
# This won't work directly - you need a real Google token
curl -X POST http://localhost:8000/api/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{
    "token": "GOOGLE_ID_TOKEN_HERE",
    "language_preference": "en"
  }'
```

---

## 📊 How It Works

### Authentication Flow

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌────────┐
│ User    │         │ Frontend │         │ Backend │         │ Google │
└────┬────┘         └─────┬────┘         └────┬────┘         └───┬────┘
     │                    │                   │                   │
     │ 1. Click Google    │                   │                   │
     │    Sign In         │                   │                   │
     ├───────────────────>│                   │                   │
     │                    │                   │                   │
     │                    │ 2. Open OAuth     │                   │
     │                    │    Popup          │                   │
     │                    ├──────────────────────────────────────>│
     │                    │                   │                   │
     │                    │ 3. User Consents  │                   │
     │                    │<──────────────────────────────────────┤
     │                    │                   │                   │
     │                    │ 4. Google ID Token│                   │
     │                    │<──────────────────────────────────────┤
     │                    │                   │                   │
     │                    │ 5. Send Token     │                   │
     │                    │   to Backend      │                   │
     │                    ├──────────────────>│                   │
     │                    │                   │                   │
     │                    │                   │ 6. Verify Token   │
     │                    │                   ├──────────────────>│
     │                    │                   │                   │
     │                    │                   │ 7. Token Valid    │
     │                    │                   │<──────────────────┤
     │                    │                   │                   │
     │                    │                   │ 8. Create/Get User│
     │                    │                   │    in Database    │
     │                    │                   │                   │
     │                    │ 9. Return JWT     │                   │
     │                    │    Tokens + User  │                   │
     │                    │<──────────────────┤                   │
     │                    │                   │                   │
     │ 10. Store Tokens   │                   │                   │
     │     & Redirect     │                   │                   │
     │<───────────────────┤                   │                   │
     │                    │                   │                   │
```

### Security Features

✅ **Token Verification**
- Backend verifies Google ID token with Google's servers
- Checks token signature, expiration, and audience
- Prevents token forgery and replay attacks

✅ **Email Verification**
- Only accepts tokens from verified Google emails
- Prevents unauthorized access

✅ **Account Linking**
- If user exists with same email, links Google account
- Prevents duplicate accounts

✅ **JWT Tokens**
- Backend returns JWT tokens for subsequent API calls
- Same security as regular login

---

## 🔒 Security Best Practices

### Development vs Production

#### Development (Current Setup)
```
Authorized JavaScript origins:
- http://localhost:5174
- http://localhost:5173

Authorized redirect URIs:
- http://localhost:5174
- http://localhost:5173
```

#### Production (When Deploying)
```
Authorized JavaScript origins:
- https://yourdomain.com
- https://www.yourdomain.com

Authorized redirect URIs:
- https://yourdomain.com
- https://www.yourdomain.com/signin
- https://www.yourdomain.com/signup
```

### Important Notes

⚠️ **Never commit your Client ID to public repositories** (though it's less sensitive than Client Secret)

⚠️ **Always use HTTPS in production**

⚠️ **Keep your Client Secret secure** (not needed for frontend-only OAuth)

⚠️ **Regularly review authorized domains** in Google Cloud Console

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem**: The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Check your authorized redirect URIs in Google Cloud Console
2. Make sure they exactly match your frontend URL
3. Include both `http://localhost:5173` and `http://localhost:5174`

### Error: "Invalid token"

**Problem**: Backend can't verify the Google token.

**Solution**:
1. Check that `GOOGLE_OAUTH_CLIENT_ID` in backend settings matches your Google Cloud Console Client ID
2. Make sure the token hasn't expired (Google tokens expire quickly)
3. Verify your backend can reach Google's servers

### Error: "Email not verified by Google"

**Problem**: The Google account's email isn't verified.

**Solution**:
1. Verify your email in your Google account settings
2. Use a different Google account with a verified email

### Google Sign-In Button Not Appearing

**Problem**: The Google button doesn't render.

**Solution**:
1. Check browser console for errors
2. Verify `GOOGLE_CLIENT_ID` is set in `App.tsx`
3. Make sure `@react-oauth/google` package is installed
4. Check that `GoogleOAuthProvider` wraps your app

### CORS Errors

**Problem**: Frontend can't communicate with backend.

**Solution**:
1. Check backend CORS settings in `settings.py`
2. Verify frontend URL is in `CORS_ALLOWED_ORIGINS`
3. Make sure backend server is running

---

## 📝 User Experience

### First-Time Google User

1. Clicks "Sign in with Google"
2. Selects Google account
3. Grants permissions
4. **New account created automatically**:
   - Username generated from email
   - Profile picture imported
   - Language preference set to default (English)
   - No password needed
5. Redirected to chatbot

### Returning Google User

1. Clicks "Sign in with Google"
2. Selects Google account
3. **Logged in immediately** (no permission prompt)
4. Profile picture updated if changed
5. Redirected to chatbot

### Existing Email User

1. User previously registered with email/password
2. Clicks "Sign in with Google" using same email
3. **Account automatically linked**:
   - Google ID added to existing account
   - Can now login with either method
   - Profile picture imported
4. Redirected to chatbot

---

## 🎨 Frontend Components

### Available Components

1. **`GoogleLoginButton`** - Pre-styled Google sign-in button
   ```tsx
   import GoogleLoginButton from '@/components/GoogleLoginButton';
   
   <GoogleLoginButton
     onSuccess={handleGoogleSuccess}
     onError={handleGoogleError}
     text="signin_with"  // or "signup_with", "continue_with"
   />
   ```

2. **`useAuth` Hook** - Authentication management
   ```tsx
   import { useAuth } from '@/hooks/useAuth';
   
   const { googleLogin, user, loading, error } = useAuth();
   
   const handleGoogleSuccess = async (token: string) => {
     await googleLogin(token, 'en');  // language preference
   };
   ```

3. **`authService`** - API communication
   ```tsx
   import { authService } from '@/services/authService';
   
   const response = await authService.googleAuth({
     token: googleToken,
     language_preference: 'ar'
   });
   ```

---

## 📚 API Reference

### Backend Endpoint

**POST** `/api/auth/google/`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "language_preference": "en"  // optional, defaults to "en"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john.doe",
    "email": "john.doe@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "language_preference": "en",
    "profile_picture": "https://lh3.googleusercontent.com/...",
    "is_oauth_user": true,
    "created_at": "2025-09-30T20:00:00Z",
    "updated_at": "2025-09-30T20:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Error Responses:**

- **400 Bad Request**: Invalid token or email not verified
- **500 Internal Server Error**: Server error during authentication

---

## ✅ Checklist

### Setup Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Copied Client ID
- [ ] Updated backend `settings.py` with Client ID
- [ ] Updated frontend `App.tsx` with Client ID
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5174
- [ ] Tested Google sign-in flow
- [ ] Verified user creation in database
- [ ] Tested account linking
- [ ] Tested language preference

### Production Checklist

- [ ] Updated authorized origins to production domain
- [ ] Enabled HTTPS
- [ ] Moved Client ID to environment variables
- [ ] Updated OAuth consent screen with production URLs
- [ ] Tested on production environment
- [ ] Set up monitoring for OAuth failures

---

## 🎯 Next Steps

1. **Test the implementation** with your Google account
2. **Customize the UI** to match your design
3. **Add error handling** for edge cases
4. **Implement logout** functionality
5. **Add profile page** to display Google profile picture
6. **Consider adding** GitHub OAuth or other providers

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Check backend Django logs
4. Check browser console for frontend errors
5. Verify all URLs and Client IDs match

---

## 🎉 Congratulations!

You now have a fully functional Google OAuth authentication system integrated with your AI Chatbot!

Users can sign in with one click and start chatting immediately.
