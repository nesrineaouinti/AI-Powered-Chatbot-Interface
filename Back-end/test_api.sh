#!/bin/bash

# AI Chatbot API Test Script
# Tests all major endpoints to verify implementation

echo "🤖 AI Chatbot API Test Script"
echo "================================"
echo ""

BASE_URL="http://localhost:8000"
TOKEN=""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

echo "📋 Prerequisites Check"
echo "----------------------"

# Check if server is running
curl -s "$BASE_URL/admin/" > /dev/null 2>&1
test_result $? "Server is running at $BASE_URL"

echo ""
echo "🔐 Authentication Tests"
echo "----------------------"

# Test 1: Register new user
echo "Test 1: Register new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User",
    "language_preference": "en"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "access"; then
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"access":"[^"]*"' | cut -d'"' -f4)
    test_result 0 "User registration successful"
else
    # Try to login with existing user
    echo "Registration failed, trying to login with default user..."
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login/" \
      -H "Content-Type: application/json" \
      -d '{"username": "admin", "password": "admin"}')
    
    if echo "$LOGIN_RESPONSE" | grep -q "access"; then
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access":"[^"]*"' | cut -d'"' -f4)
        test_result 0 "Login with existing user successful"
    else
        test_result 1 "Authentication failed"
        echo "Please create a superuser: python3 manage.py createsuperuser"
        exit 1
    fi
fi

echo ""
echo "💬 Chat Tests"
echo "-------------"

# Test 2: List chats
echo "Test 2: List chats..."
LIST_CHATS=$(curl -s -X GET "$BASE_URL/api/chats/" \
  -H "Authorization: Bearer $TOKEN")

if echo "$LIST_CHATS" | grep -q "\["; then
    test_result 0 "List chats endpoint working"
else
    test_result 1 "List chats endpoint failed"
fi

# Test 3: Create chat (English)
echo "Test 3: Create English chat..."
CREATE_CHAT=$(curl -s -X POST "$BASE_URL/api/chats/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Chat",
    "language": "en"
  }')

if echo "$CREATE_CHAT" | grep -q '"id"'; then
    CHAT_ID=$(echo "$CREATE_CHAT" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    test_result 0 "Create English chat successful (ID: $CHAT_ID)"
else
    test_result 1 "Create chat failed"
    CHAT_ID=1
fi

# Test 4: Send message and get AI response
echo "Test 4: Send message and get AI response..."
SEND_MESSAGE=$(curl -s -X POST "$BASE_URL/api/chats/$CHAT_ID/send_message/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello! What is Python?",
    "language": "en"
  }')

if echo "$SEND_MESSAGE" | grep -q '"ai_message"'; then
    AI_RESPONSE=$(echo "$SEND_MESSAGE" | grep -o '"content":"[^"]*"' | tail -1 | cut -d'"' -f4)
    test_result 0 "AI response received"
    echo "   AI said: ${AI_RESPONSE:0:80}..."
else
    test_result 1 "AI response failed"
fi

# Test 5: Get chat details
echo "Test 5: Get chat details with messages..."
GET_CHAT=$(curl -s -X GET "$BASE_URL/api/chats/$CHAT_ID/" \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_CHAT" | grep -q '"messages"'; then
    MESSAGE_COUNT=$(echo "$GET_CHAT" | grep -o '"messages":\[' | wc -l)
    test_result 0 "Get chat details successful"
else
    test_result 1 "Get chat details failed"
fi

# Test 6: Create Arabic chat
echo "Test 6: Create Arabic chat..."
CREATE_ARABIC_CHAT=$(curl -s -X POST "$BASE_URL/api/chats/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "محادثة عربية",
    "language": "ar"
  }')

if echo "$CREATE_ARABIC_CHAT" | grep -q '"id"'; then
    ARABIC_CHAT_ID=$(echo "$CREATE_ARABIC_CHAT" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    test_result 0 "Create Arabic chat successful (ID: $ARABIC_CHAT_ID)"
else
    test_result 1 "Create Arabic chat failed"
    ARABIC_CHAT_ID=2
fi

# Test 7: Send Arabic message
echo "Test 7: Send Arabic message..."
SEND_ARABIC=$(curl -s -X POST "$BASE_URL/api/chats/$ARABIC_CHAT_ID/send_message/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "مرحبا! كيف حالك؟",
    "language": "ar"
  }')

if echo "$SEND_ARABIC" | grep -q '"ai_message"'; then
    test_result 0 "Arabic AI response received"
else
    test_result 1 "Arabic AI response failed"
fi

# Test 8: Get statistics
echo "Test 8: Get chat statistics..."
GET_STATS=$(curl -s -X GET "$BASE_URL/api/chats/statistics/" \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_STATS" | grep -q '"total_chats"'; then
    TOTAL_CHATS=$(echo "$GET_STATS" | grep -o '"total_chats":[0-9]*' | cut -d':' -f2)
    test_result 0 "Statistics retrieved (Total chats: $TOTAL_CHATS)"
else
    test_result 1 "Get statistics failed"
fi

# Test 9: Archive chat
echo "Test 9: Archive chat..."
ARCHIVE_CHAT=$(curl -s -X POST "$BASE_URL/api/chats/$CHAT_ID/archive/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_archived": true}')

if echo "$ARCHIVE_CHAT" | grep -q '"is_archived":true'; then
    test_result 0 "Chat archived successfully"
else
    test_result 1 "Archive chat failed"
fi

echo ""
echo "📊 Summary Tests"
echo "----------------"

# Test 10: Generate user summary
echo "Test 10: Generate user summary..."
GENERATE_SUMMARY=$(curl -s -X POST "$BASE_URL/api/summaries/generate/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"language": "en"}')

if echo "$GENERATE_SUMMARY" | grep -q '"summary"'; then
    test_result 0 "User summary generated"
else
    test_result 1 "Generate summary failed"
fi

# Test 11: List summaries
echo "Test 11: List user summaries..."
LIST_SUMMARIES=$(curl -s -X GET "$BASE_URL/api/summaries/" \
  -H "Authorization: Bearer $TOKEN")

if echo "$LIST_SUMMARIES" | grep -q "\["; then
    test_result 0 "List summaries endpoint working"
else
    test_result 1 "List summaries failed"
fi

echo ""
echo "🤖 AI Model Tests"
echo "-----------------"

# Test 12: List AI models
echo "Test 12: List available AI models..."
LIST_MODELS=$(curl -s -X GET "$BASE_URL/api/ai-models/" \
  -H "Authorization: Bearer $TOKEN")

if echo "$LIST_MODELS" | grep -q "\["; then
    MODEL_COUNT=$(echo "$LIST_MODELS" | grep -o '"name"' | wc -l)
    test_result 0 "AI models listed (Count: $MODEL_COUNT)"
else
    test_result 1 "List AI models failed"
fi

echo ""
echo "📝 Message Tests"
echo "----------------"

# Test 13: List messages
echo "Test 13: List all messages..."
LIST_MESSAGES=$(curl -s -X GET "$BASE_URL/api/messages/" \
  -H "Authorization: Bearer $TOKEN")

if echo "$LIST_MESSAGES" | grep -q "\["; then
    test_result 0 "List messages endpoint working"
else
    test_result 1 "List messages failed"
fi

echo ""
echo "================================"
echo "📊 Test Results Summary"
echo "================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! API is working correctly.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
    exit 1
fi
