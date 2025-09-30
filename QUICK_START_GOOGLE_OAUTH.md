# 🚀 Quick Start: Google OAuth in 5 Minutes

## Step 1: Get Google Credentials (2 min)

1. Go to https://console.cloud.google.com/
2. Create new project → "AI-Chatbot-OAuth"
3. APIs & Services → OAuth consent screen → External → Create
4. Fill: App name, email, save
5. Credentials → Create Credentials → OAuth client ID
6. Web application:
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5174
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5174
     http://localhost:5173
     ```
7. Copy your **Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)

## Step 2: Configure Backend (1 min)

Edit `/Back-end/chatbot_backend/settings.py`:

```python
GOOGLE_OAUTH_CLIENT_ID = 'PASTE_YOUR_CLIENT_ID_HERE'
```

## Step 3: Configure Frontend (1 min)

Edit `/front-end/src/App.tsx`:

```typescript
const GOOGLE_CLIENT_ID = 'PASTE_YOUR_CLIENT_ID_HERE';
```

**⚠️ Use the SAME Client ID in both files!**

## Step 4: Start Servers (1 min)

**Terminal 1 - Backend:**
```bash
cd Back-end
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd front-end
npm run dev
```

## Step 5: Test It! (30 sec)

1. Open: http://localhost:5174/signin
2. Click "Sign in with Google"
3. Select your Google account
4. Done! You're logged in! 🎉

---

## What You Get

✅ One-click Google sign-in
✅ Automatic user creation
✅ Profile picture imported
✅ No password needed
✅ Secure JWT authentication

---

## Troubleshooting

**Button not showing?**
- Check browser console for errors
- Verify Client ID is set in both files

**"redirect_uri_mismatch" error?**
- Add exact URLs to Google Cloud Console
- Include both 5173 and 5174 ports

**"Invalid token" error?**
- Verify Client IDs match in backend and frontend
- Check they match Google Cloud Console

---

## Full Documentation

- **Setup Guide**: `GOOGLE_OAUTH_SETUP.md`
- **Implementation Details**: `GOOGLE_OAUTH_IMPLEMENTATION.md`
- **Backend Reference**: `Back-end/GOOGLE_OAUTH_BACKEND.md`

---

## Need Help?

1. Check the full setup guide
2. Verify all URLs match exactly
3. Check browser console for errors
4. Check Django logs for backend errors

That's it! You now have Google OAuth working! 🎉
