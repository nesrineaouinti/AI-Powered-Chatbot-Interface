# 🔧 Fix: Google Button Not Working

## ⚠️ Problem Identified

The Google button is not working because the **Google Client ID is not configured**.

Both frontend and backend are using placeholder values:
- Frontend: `'YOUR_GOOGLE_CLIENT_ID_HERE'`
- Backend: `'YOUR_GOOGLE_CLIENT_ID_HERE'`

## ✅ Solution (5 Minutes)

### Step 1: Get Your Google Client ID

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/apis/credentials

2. **If you don't have a project yet:**
   - Click "Create Project"
   - Name it: "AI-Chatbot-OAuth"
   - Click "Create"

3. **Configure OAuth Consent Screen:**
   - Go to "OAuth consent screen"
   - Select "External"
   - Fill in:
     - App name: "AI Chatbot"
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Add test users: your Gmail address
   - Click "Save and Continue"

4. **Create OAuth Credentials:**
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Name: "AI Chatbot Web Client"
   
   - **Authorized JavaScript origins** (add all 4):
     ```
     http://localhost:5174
     http://localhost:5173
     http://127.0.0.1:5174
     http://127.0.0.1:5173
     ```
   
   - **Authorized redirect URIs** (add all 4):
     ```
     http://localhost:5174
     http://localhost:5173
     http://127.0.0.1:5174
     http://127.0.0.1:5173
     ```
   
   - Click "Create"

5. **Copy Your Client ID:**
   - It looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - Keep this window open!

### Step 2: Update Frontend

**Edit:** `/front-end/src/App.tsx`

**Find this line (around line 13):**
```typescript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
```

**Replace with your actual Client ID:**
```typescript
const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
```

### Step 3: Update Backend

**Edit:** `/Back-end/chatbot_backend/settings.py`

**Find this line (near the end of file):**
```python
GOOGLE_OAUTH_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'
```

**Replace with your actual Client ID:**
```python
GOOGLE_OAUTH_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com'
```

**⚠️ IMPORTANT:** Use the **SAME** Client ID in both files!

### Step 4: Restart Servers

**Terminal 1 - Backend:**
```bash
cd Back-end
# Press Ctrl+C to stop if running
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd front-end
# Press Ctrl+C to stop if running
npm run dev
```

### Step 5: Test It!

1. Open: http://localhost:5174/signin
2. You should see a Google sign-in button
3. Click it
4. Google popup should appear
5. Select your account
6. Grant permissions
7. You should be redirected to /chatbot
8. Done! 🎉

---

## 🔍 Verify Configuration

Run the diagnostic script:
```bash
./check-google-oauth.sh
```

**Expected output:**
```
✅ All checks passed!
🎉 Your Google OAuth is configured correctly!
```

---

## 🐛 Still Not Working?

### Check Browser Console

1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for errors

**Common errors:**

**"Invalid Client ID"**
- Client ID is wrong or still placeholder
- Double-check you copied it correctly

**"redirect_uri_mismatch"**
- URLs in Google Cloud Console don't match
- Make sure you added all 4 URLs (see Step 1)

**"idpiframe_initialization_failed"**
- Enable third-party cookies in browser
- Try in incognito/private mode

### Clear Browser Cache

```
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)
```
- Select "Cached images and files"
- Clear data
- Refresh page

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to "Network" tab
3. Click Google button
4. Look for requests to `accounts.google.com`
5. Check if any fail

---

## 📝 Quick Reference

### Files to Edit

**Frontend:**
```
/front-end/src/App.tsx
Line ~13: const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID';
```

**Backend:**
```
/Back-end/chatbot_backend/settings.py
Line ~195: GOOGLE_OAUTH_CLIENT_ID = 'YOUR_CLIENT_ID'
```

### Google Cloud Console URLs

**Credentials:**
https://console.cloud.google.com/apis/credentials

**OAuth Consent Screen:**
https://console.cloud.google.com/apis/credentials/consent

---

## 🎯 Summary

**Problem:** Google Client ID not configured (using placeholder)

**Solution:**
1. Get Client ID from Google Cloud Console
2. Update `front-end/src/App.tsx`
3. Update `Back-end/chatbot_backend/settings.py`
4. Restart both servers
5. Test at http://localhost:5174/signin

**Time needed:** 5-10 minutes

**Difficulty:** Easy ⭐

---

## 📚 Additional Resources

- **Full Setup Guide:** `GOOGLE_OAUTH_SETUP.md`
- **Troubleshooting:** `GOOGLE_BUTTON_TROUBLESHOOTING.md`
- **Quick Start:** `QUICK_START_GOOGLE_OAUTH.md`

---

## ✅ Success Indicators

When it's working correctly:

1. ✅ Google button appears on sign-in page
2. ✅ Clicking button opens Google popup
3. ✅ Can select Google account
4. ✅ Permissions screen appears
5. ✅ After granting, redirects to /chatbot
6. ✅ User is logged in
7. ✅ Can see user info in navigation

---

**Need more help?** Check `GOOGLE_BUTTON_TROUBLESHOOTING.md` for detailed debugging steps!
