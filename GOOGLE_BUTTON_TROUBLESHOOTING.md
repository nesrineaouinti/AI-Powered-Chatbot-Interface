# 🔧 Google Button Troubleshooting Guide

## Issue: Google Button Not Working / Nothing Happens When Clicked

### Quick Fix Checklist

#### 1. ✅ Verify Google Client ID is Set

**Check Frontend (`/front-end/src/App.tsx`):**
```typescript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
```

**❌ WRONG** (placeholder):
```typescript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
```

**✅ CORRECT** (actual Client ID):
```typescript
const GOOGLE_CLIENT_ID = '123456789-abcdefg.apps.googleusercontent.com';
```

#### 2. ✅ Check Browser Console for Errors

**Open Developer Tools:**
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (Mac)

**Look for errors like:**
- `Invalid Client ID`
- `redirect_uri_mismatch`
- `idpiframe_initialization_failed`

#### 3. ✅ Verify Google Cloud Console Setup

**Go to**: https://console.cloud.google.com/apis/credentials

**Check Authorized JavaScript origins:**
```
http://localhost:5174
http://localhost:5173
http://127.0.0.1:5174
http://127.0.0.1:5173
```

**Check Authorized redirect URIs:**
```
http://localhost:5174
http://localhost:5173
```

#### 4. ✅ Restart Frontend Server

```bash
cd front-end
# Stop the server (Ctrl+C)
npm run dev
```

---

## Common Issues & Solutions

### Issue 1: "Invalid Client ID" Error

**Symptoms:**
- Button doesn't appear
- Console shows "Invalid Client ID"

**Solution:**
1. Get your Client ID from Google Cloud Console
2. Update `/front-end/src/App.tsx`:
   ```typescript
   const GOOGLE_CLIENT_ID = 'PASTE_YOUR_ACTUAL_CLIENT_ID_HERE';
   ```
3. Restart frontend server

### Issue 2: "redirect_uri_mismatch" Error

**Symptoms:**
- Button appears but shows error when clicked
- Error popup from Google

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click on your OAuth 2.0 Client ID
3. Add these to **Authorized JavaScript origins**:
   ```
   http://localhost:5174
   http://localhost:5173
   ```
4. Add these to **Authorized redirect URIs**:
   ```
   http://localhost:5174
   http://localhost:5173
   ```
5. Click **Save**
6. Wait 5 minutes for changes to propagate
7. Try again

### Issue 3: Button Doesn't Appear At All

**Symptoms:**
- No Google button visible on page
- No errors in console

**Solution:**

**Check 1:** Verify package is installed
```bash
cd front-end
npm list @react-oauth/google
```

If not installed:
```bash
npm install @react-oauth/google
```

**Check 2:** Verify `GoogleOAuthProvider` wraps app

Open `/front-end/src/App.tsx` and verify:
```typescript
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Your app content */}
    </GoogleOAuthProvider>
  );
}
```

**Check 3:** Verify SignIn page uses GoogleLoginButton

Open `/front-end/src/pages/SignIn.tsx` and verify:
```typescript
import GoogleLoginButton from '@/components/GoogleLoginButton';

// In the component:
<GoogleLoginButton
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  text="signin_with"
/>
```

### Issue 4: Button Appears But Nothing Happens When Clicked

**Symptoms:**
- Button is visible
- No popup appears when clicked
- No errors in console

**Solution:**

**Check 1:** Verify Client ID is not placeholder
```typescript
// BAD - won't work
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

// GOOD - actual Client ID
const GOOGLE_CLIENT_ID = '123456789-abc...apps.googleusercontent.com';
```

**Check 2:** Check browser popup blocker
- Disable popup blocker for localhost
- Try in incognito/private mode

**Check 3:** Clear browser cache
```
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)
```
- Select "Cached images and files"
- Clear data
- Refresh page

### Issue 5: "idpiframe_initialization_failed" Error

**Symptoms:**
- Console shows initialization error
- Button may or may not appear

**Solution:**

**Option 1:** Check third-party cookies
- Enable third-party cookies in browser settings
- Or add exception for `accounts.google.com`

**Option 2:** Try different browser
- Test in Chrome, Firefox, or Edge
- Some browsers block third-party cookies by default

**Option 3:** Clear site data
- Open Developer Tools (F12)
- Application tab → Clear storage
- Click "Clear site data"
- Refresh page

---

## Step-by-Step Debugging

### Step 1: Check Client ID

```bash
# Open App.tsx
cat front-end/src/App.tsx | grep GOOGLE_CLIENT_ID
```

**Expected output:**
```typescript
const GOOGLE_CLIENT_ID = '123456789-abc...apps.googleusercontent.com';
```

**If you see:**
```typescript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
```

**Then:** You need to replace it with your actual Client ID!

### Step 2: Get Your Client ID

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Click on it
4. Copy the **Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)

### Step 3: Update Frontend

Edit `/front-end/src/App.tsx`:
```typescript
const GOOGLE_CLIENT_ID = 'PASTE_YOUR_CLIENT_ID_HERE';
```

### Step 4: Update Backend

Edit `/Back-end/chatbot_backend/settings.py`:
```python
GOOGLE_OAUTH_CLIENT_ID = 'PASTE_YOUR_CLIENT_ID_HERE'
```

**⚠️ IMPORTANT:** Use the **SAME** Client ID in both files!

### Step 5: Restart Servers

**Backend:**
```bash
cd Back-end
# Stop server (Ctrl+C)
source venv/bin/activate
python manage.py runserver
```

**Frontend:**
```bash
cd front-end
# Stop server (Ctrl+C)
npm run dev
```

### Step 6: Test

1. Open: http://localhost:5174/signin
2. Look for Google button
3. Click it
4. Google popup should appear
5. Select account
6. Should redirect to chatbot

---

## Verification Steps

### ✅ Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID copied
- [ ] Authorized JavaScript origins added
- [ ] Authorized redirect URIs added
- [ ] Frontend App.tsx updated with Client ID
- [ ] Backend settings.py updated with Client ID
- [ ] Both servers restarted
- [ ] Browser cache cleared
- [ ] Popup blocker disabled
- [ ] Third-party cookies enabled

### Test in Browser Console

Open browser console (F12) and run:
```javascript
// Check if Google OAuth is loaded
console.log(window.google);

// Should show an object, not undefined
```

---

## Still Not Working?

### Check These Files

**1. Frontend App.tsx**
```bash
cat front-end/src/App.tsx | grep -A 2 "GOOGLE_CLIENT_ID"
```

**2. Frontend SignIn.tsx**
```bash
cat front-end/src/pages/SignIn.tsx | grep "GoogleLoginButton"
```

**3. Backend settings.py**
```bash
cat Back-end/chatbot_backend/settings.py | grep "GOOGLE_OAUTH_CLIENT_ID"
```

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Click Google button
4. Look for requests to `accounts.google.com`
5. Check for errors

### Enable Verbose Logging

Add to `/front-end/src/components/GoogleLoginButton.tsx`:
```typescript
const handleSuccess = (credentialResponse: CredentialResponse) => {
  console.log('Google login success:', credentialResponse);
  if (credentialResponse.credential) {
    onSuccess(credentialResponse.credential);
  } else {
    console.error('No credential in response');
    onError();
  }
};

const handleError = () => {
  console.error('Google Login Failed - detailed error');
  onError();
};
```

---

## Quick Test Script

Create `/front-end/test-google-oauth.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Google OAuth</title>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
  <h1>Google OAuth Test</h1>
  <div id="g_id_onload"
       data-client_id="YOUR_CLIENT_ID_HERE"
       data-callback="handleCredentialResponse">
  </div>
  <div class="g_id_signin" data-type="standard"></div>
  
  <script>
    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      alert("Success! Check console for token.");
    }
  </script>
</body>
</html>
```

Replace `YOUR_CLIENT_ID_HERE` and open in browser. If this works, the issue is in your React app.

---

## Contact Support

If none of these solutions work:

1. **Check browser console** - Copy all errors
2. **Check network tab** - Look for failed requests
3. **Verify all URLs** match exactly
4. **Try different browser**
5. **Check Google Cloud Console** for any warnings

---

## Summary

**Most common issue:** Client ID not set or set to placeholder text.

**Quick fix:**
1. Get Client ID from Google Cloud Console
2. Update `App.tsx` and `settings.py`
3. Restart both servers
4. Clear browser cache
5. Try again

**Still stuck?** Follow the step-by-step debugging guide above!
