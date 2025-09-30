#!/bin/bash

echo "🔍 Google OAuth Configuration Checker"
echo "======================================"
echo ""

# Check Frontend Client ID
echo "1️⃣ Checking Frontend Configuration..."
FRONTEND_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID" front-end/src/App.tsx | grep -o "'[^']*'" | head -1)
echo "   Frontend Client ID: $FRONTEND_CLIENT_ID"

if [[ $FRONTEND_CLIENT_ID == *"YOUR_GOOGLE_CLIENT_ID_HERE"* ]]; then
    echo "   ❌ ERROR: Frontend Client ID is still placeholder!"
    echo "   → Update front-end/src/App.tsx with your actual Client ID"
    FRONTEND_OK=false
else
    echo "   ✅ Frontend Client ID is set"
    FRONTEND_OK=true
fi
echo ""

# Check Backend Client ID
echo "2️⃣ Checking Backend Configuration..."
BACKEND_CLIENT_ID=$(grep "GOOGLE_OAUTH_CLIENT_ID" Back-end/chatbot_backend/settings.py | grep -o "'[^']*'" | head -1)
echo "   Backend Client ID: $BACKEND_CLIENT_ID"

if [[ $BACKEND_CLIENT_ID == *"YOUR_GOOGLE_CLIENT_ID_HERE"* ]]; then
    echo "   ❌ ERROR: Backend Client ID is still placeholder!"
    echo "   → Update Back-end/chatbot_backend/settings.py with your actual Client ID"
    BACKEND_OK=false
else
    echo "   ✅ Backend Client ID is set"
    BACKEND_OK=true
fi
echo ""

# Check if they match
echo "3️⃣ Checking if Client IDs match..."
if [ "$FRONTEND_CLIENT_ID" == "$BACKEND_CLIENT_ID" ]; then
    echo "   ✅ Client IDs match!"
    MATCH_OK=true
else
    echo "   ❌ ERROR: Client IDs don't match!"
    echo "   Frontend: $FRONTEND_CLIENT_ID"
    echo "   Backend:  $BACKEND_CLIENT_ID"
    echo "   → They must be the same!"
    MATCH_OK=false
fi
echo ""

# Check if Google OAuth package is installed
echo "4️⃣ Checking if @react-oauth/google is installed..."
if [ -d "front-end/node_modules/@react-oauth/google" ]; then
    echo "   ✅ Package is installed"
    PACKAGE_OK=true
else
    echo "   ❌ ERROR: Package not found!"
    echo "   → Run: cd front-end && npm install @react-oauth/google"
    PACKAGE_OK=false
fi
echo ""

# Check if GoogleLoginButton component exists
echo "5️⃣ Checking if GoogleLoginButton component exists..."
if [ -f "front-end/src/components/GoogleLoginButton.tsx" ]; then
    echo "   ✅ Component exists"
    COMPONENT_OK=true
else
    echo "   ❌ ERROR: Component not found!"
    echo "   → File missing: front-end/src/components/GoogleLoginButton.tsx"
    COMPONENT_OK=false
fi
echo ""

# Check if useAuth hook exists
echo "6️⃣ Checking if useAuth hook exists..."
if [ -f "front-end/src/hooks/useAuth.ts" ]; then
    echo "   ✅ Hook exists"
    HOOK_OK=true
else
    echo "   ❌ ERROR: Hook not found!"
    echo "   → File missing: front-end/src/hooks/useAuth.ts"
    HOOK_OK=false
fi
echo ""

# Check if authService exists
echo "7️⃣ Checking if authService exists..."
if [ -f "front-end/src/services/authService.ts" ]; then
    echo "   ✅ Service exists"
    SERVICE_OK=true
else
    echo "   ❌ ERROR: Service not found!"
    echo "   → File missing: front-end/src/services/authService.ts"
    SERVICE_OK=false
fi
echo ""

# Summary
echo "======================================"
echo "📊 Summary"
echo "======================================"

if [ "$FRONTEND_OK" = true ] && [ "$BACKEND_OK" = true ] && [ "$MATCH_OK" = true ] && [ "$PACKAGE_OK" = true ] && [ "$COMPONENT_OK" = true ] && [ "$HOOK_OK" = true ] && [ "$SERVICE_OK" = true ]; then
    echo "✅ All checks passed!"
    echo ""
    echo "🎉 Your Google OAuth is configured correctly!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure both servers are running:"
    echo "   Backend:  cd Back-end && source venv/bin/activate && python manage.py runserver"
    echo "   Frontend: cd front-end && npm run dev"
    echo ""
    echo "2. Visit: http://localhost:5174/signin"
    echo "3. Click the Google sign-in button"
    echo ""
else
    echo "❌ Some checks failed!"
    echo ""
    echo "Please fix the errors above and run this script again."
    echo ""
    echo "Quick fix guide:"
    echo "1. Get your Client ID from: https://console.cloud.google.com/apis/credentials"
    echo "2. Update front-end/src/App.tsx"
    echo "3. Update Back-end/chatbot_backend/settings.py"
    echo "4. Use the SAME Client ID in both files"
    echo "5. Run: cd front-end && npm install"
    echo ""
fi

echo "For detailed troubleshooting, see: GOOGLE_BUTTON_TROUBLESHOOTING.md"
