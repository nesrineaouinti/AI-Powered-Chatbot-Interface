from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import User


class UserRegistrationTests(APITestCase):
    """Test cases for user registration"""
    
    def setUp(self):
        self.client = APIClient()
        self.signup_url = reverse('signup')
        self.valid_payload = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'language_preference': 'en'
        }
    
    def test_valid_registration(self):
        """Test registration with valid data"""
        response = self.client.post(self.signup_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
    
    def test_duplicate_email(self):
        """Test registration with duplicate email"""
        User.objects.create_user(
            username='existing',
            email='test@example.com',
            password='Pass123!'
        )
        response = self.client.post(self.signup_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_password_mismatch(self):
        """Test registration with mismatched passwords"""
        payload = self.valid_payload.copy()
        payload['password_confirm'] = 'DifferentPass123!'
        response = self.client.post(self.signup_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_weak_password(self):
        """Test registration with weak password"""
        payload = self.valid_payload.copy()
        payload['password'] = '123'
        payload['password_confirm'] = '123'
        response = self.client.post(self.signup_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTests(APITestCase):
    """Test cases for user login"""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            language_preference='en'
        )
    
    def test_login_with_username(self):
        """Test login with username"""
        payload = {
            'username_or_email': 'testuser',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
    
    def test_login_with_email(self):
        """Test login with email"""
        payload = {
            'username_or_email': 'test@example.com',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
    
    def test_login_wrong_password(self):
        """Test login with wrong password"""
        payload = {
            'username_or_email': 'testuser',
            'password': 'WrongPass123!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        payload = {
            'username_or_email': 'nonexistent',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserProfileTests(APITestCase):
    """Test cases for user profile"""
    
    def setUp(self):
        self.client = APIClient()
        self.profile_url = reverse('profile')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            language_preference='en'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_get_profile(self):
        """Test getting user profile"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['language_preference'], 'en')
    
    def test_update_language_preference(self):
        """Test updating language preference"""
        payload = {'language_preference': 'ar'}
        response = self.client.patch(self.profile_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['language_preference'], 'ar')
        
        # Verify in database
        self.user.refresh_from_db()
        self.assertEqual(self.user.language_preference, 'ar')
    
    def test_profile_without_authentication(self):
        """Test accessing profile without authentication"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LanguagePreferenceTests(APITestCase):
    """Test cases for language preference feature"""
    
    def setUp(self):
        self.client = APIClient()
        self.signup_url = reverse('signup')
    
    def test_default_language_is_english(self):
        """Test that default language is English"""
        payload = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!'
        }
        response = self.client.post(self.signup_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['language_preference'], 'en')
    
    def test_register_with_arabic(self):
        """Test registration with Arabic language preference"""
        payload = {
            'username': 'arabicuser',
            'email': 'arabic@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'language_preference': 'ar'
        }
        response = self.client.post(self.signup_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['language_preference'], 'ar')
    
    def test_language_persists_after_login(self):
        """Test that language preference persists after login"""
        # Create user with Arabic preference
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            language_preference='ar'
        )
        
        # Login
        login_url = reverse('login')
        payload = {
            'username_or_email': 'testuser',
            'password': 'TestPass123!'
        }
        response = self.client.post(login_url, payload, format='json')
        self.assertEqual(response.data['user']['language_preference'], 'ar')
