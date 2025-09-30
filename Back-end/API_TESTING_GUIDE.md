# 🧪 API Testing Guide

## Quick Start Testing

### 1. Start the Server

```bash
# Activate virtual environment
source venv/bin/activate

# Run the development server
python manage.py runserver
```

Server will be available at: `http://localhost:8000`

---

## 📋 API Endpoints

### Base URL
```
http://localhost:8000/api/auth/
```

### Available Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/signup/` | POST | No | Register new user |
| `/login/` | POST | No | Login user |
| `/logout/` | POST | Yes | Logout user |
| `/profile/` | GET | Yes | Get user profile |
| `/profile/` | PUT/PATCH | Yes | Update user profile |
| `/change-password/` | POST | Yes | Change password |
| `/token/refresh/` | POST | No | Refresh access token |

---

## 🔧 Testing with cURL

### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "first_name": "Test",
    "last_name": "User",
    "language_preference": "en"
  }'
```

**Expected Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "language_preference": "en",
    "created_at": "2025-09-30T20:30:00Z",
    "updated_at": "2025-09-30T20:30:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 2. Login with Username

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "testuser",
    "password": "TestPass123!"
  }'
```

### 3. Login with Email

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### 4. Get User Profile (Protected)

```bash
# Replace YOUR_ACCESS_TOKEN with the actual token from login/signup
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Update Language Preference

```bash
curl -X PATCH http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "language_preference": "ar"
  }'
```

### 6. Update Full Profile

```bash
curl -X PUT http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Updated",
    "last_name": "Name",
    "language_preference": "ar"
  }'
```

### 7. Change Password

```bash
curl -X POST http://localhost:8000/api/auth/change-password/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "TestPass123!",
    "new_password": "NewPass456!",
    "new_password_confirm": "NewPass456!"
  }'
```

### 8. Refresh Access Token

```bash
# Replace YOUR_REFRESH_TOKEN with the actual refresh token
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 9. Logout

```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 🧪 Testing with Postman

### Setup

1. **Import Collection**: Create a new collection named "Chatbot API"
2. **Set Base URL**: Create environment variable `base_url` = `http://localhost:8000`
3. **Set Token Variables**: Create variables for `access_token` and `refresh_token`

### Test Sequence

#### 1. Register User
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/signup/`
- **Body** (JSON):
```json
{
  "username": "postmanuser",
  "email": "postman@example.com",
  "password": "PostmanTest123!",
  "password_confirm": "PostmanTest123!",
  "language_preference": "en"
}
```
- **Tests** (JavaScript):
```javascript
pm.test("Status is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has tokens", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.tokens).to.have.property('access');
    pm.expect(jsonData.tokens).to.have.property('refresh');
    
    // Save tokens to environment
    pm.environment.set("access_token", jsonData.tokens.access);
    pm.environment.set("refresh_token", jsonData.tokens.refresh);
});
```

#### 2. Login
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/login/`
- **Body** (JSON):
```json
{
  "username_or_email": "postmanuser",
  "password": "PostmanTest123!"
}
```

#### 3. Get Profile (Protected)
- **Method**: GET
- **URL**: `{{base_url}}/api/auth/profile/`
- **Headers**:
  - `Authorization`: `Bearer {{access_token}}`

#### 4. Update Language
- **Method**: PATCH
- **URL**: `{{base_url}}/api/auth/profile/`
- **Headers**:
  - `Authorization`: `Bearer {{access_token}}`
- **Body** (JSON):
```json
{
  "language_preference": "ar"
}
```

---

## 🐍 Testing with Python Requests

### Install requests library
```bash
pip install requests
```

### Test Script

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

# 1. Register
def test_register():
    url = f"{BASE_URL}/signup/"
    data = {
        "username": "pythonuser",
        "email": "python@example.com",
        "password": "PythonTest123!",
        "password_confirm": "PythonTest123!",
        "language_preference": "en"
    }
    response = requests.post(url, json=data)
    print(f"Register Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json()

# 2. Login
def test_login(username, password):
    url = f"{BASE_URL}/login/"
    data = {
        "username_or_email": username,
        "password": password
    }
    response = requests.post(url, json=data)
    print(f"Login Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result

# 3. Get Profile
def test_get_profile(access_token):
    url = f"{BASE_URL}/profile/"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    print(f"Get Profile Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json()

# 4. Update Language
def test_update_language(access_token, language):
    url = f"{BASE_URL}/profile/"
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"language_preference": language}
    response = requests.patch(url, json=data, headers=headers)
    print(f"Update Language Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json()

# 5. Logout
def test_logout(access_token, refresh_token):
    url = f"{BASE_URL}/logout/"
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"refresh_token": refresh_token}
    response = requests.post(url, json=data, headers=headers)
    print(f"Logout Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# Run tests
if __name__ == "__main__":
    # Register
    register_result = test_register()
    tokens = register_result.get('tokens', {})
    
    # Login
    login_result = test_login("pythonuser", "PythonTest123!")
    access_token = login_result['tokens']['access']
    refresh_token = login_result['tokens']['refresh']
    
    # Get Profile
    test_get_profile(access_token)
    
    # Update Language to Arabic
    test_update_language(access_token, "ar")
    
    # Logout
    test_logout(access_token, refresh_token)
```

---

## ✅ Test Cases

### Registration Tests

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid registration | All fields correct | 201 Created, tokens returned |
| Duplicate username | Existing username | 400 Bad Request |
| Duplicate email | Existing email | 400 Bad Request |
| Weak password | "12345" | 400 Bad Request |
| Password mismatch | Different passwords | 400 Bad Request |
| Missing fields | No email | 400 Bad Request |
| Invalid language | "fr" | 400 Bad Request |

### Login Tests

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid username login | Correct credentials | 200 OK, tokens returned |
| Valid email login | Correct credentials | 200 OK, tokens returned |
| Wrong password | Invalid password | 401 Unauthorized |
| Non-existent user | Unknown username | 401 Unauthorized |
| Empty fields | No password | 400 Bad Request |

### Profile Tests

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Get profile with token | Valid token | 200 OK, user data |
| Get profile without token | No token | 401 Unauthorized |
| Update language to Arabic | "ar" | 200 OK, updated data |
| Update language to English | "en" | 200 OK, updated data |
| Invalid language code | "xyz" | 400 Bad Request |

### Token Tests

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Refresh with valid token | Valid refresh token | 200 OK, new tokens |
| Refresh with expired token | Expired token | 401 Unauthorized |
| Refresh with blacklisted token | Logged out token | 401 Unauthorized |
| Access with expired token | Expired access token | 401 Unauthorized |

---

## 🔍 Common Error Responses

### 400 Bad Request
```json
{
  "password": ["This password is too short."],
  "email": ["A user with this email already exists."]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## 📊 Testing Checklist

### Basic Functionality
- [ ] User can register with valid data
- [ ] User can login with username
- [ ] User can login with email
- [ ] User can view their profile
- [ ] User can update language preference
- [ ] User can change password
- [ ] User can logout
- [ ] User can refresh access token

### Security
- [ ] Duplicate emails are rejected
- [ ] Weak passwords are rejected
- [ ] Wrong passwords return generic error
- [ ] Protected endpoints require authentication
- [ ] Expired tokens are rejected
- [ ] Blacklisted tokens cannot be used
- [ ] Passwords are not returned in responses

### Language Preference
- [ ] Default language is English
- [ ] Can change to Arabic
- [ ] Can change back to English
- [ ] Invalid language codes are rejected
- [ ] Language persists after logout/login

---

## 🚀 Next Steps

1. **Test all endpoints** using your preferred method (cURL, Postman, Python)
2. **Verify security features** by testing with invalid tokens, wrong passwords, etc.
3. **Test language preference** by updating and verifying it persists
4. **Integrate with frontend** using the provided tokens

---

## 💡 Tips

- Save your access and refresh tokens for testing protected endpoints
- Access tokens expire in 60 minutes - use refresh endpoint to get new ones
- After logout, tokens are blacklisted and cannot be reused
- Use the Django admin panel (`/admin/`) to view users and tokens in the database
