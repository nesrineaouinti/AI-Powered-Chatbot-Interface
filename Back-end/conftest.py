"""
Pytest configuration and fixtures for the entire test suite
"""
import pytest
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.test import APIClient
from chatbot.models import Chat, Message, UserSummary, AIModelConfig

User = get_user_model()


@pytest.fixture(scope='session', autouse=True)
def disable_rate_limiting():
    """Disable rate limiting for all tests"""
    settings.RATELIMIT_ENABLE = False
    yield
    settings.RATELIMIT_ENABLE = True


@pytest.fixture
def api_client():
    """Fixture for DRF API client"""
    return APIClient()


@pytest.fixture
def user(db):
    """Fixture for creating a test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """Fixture for authenticated API client"""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def chat(user):
    """Fixture for creating a test chat"""
    return Chat.objects.create(
        user=user,
        title='Test Chat',
        language='en'
    )


@pytest.fixture
def message(chat):
    """Fixture for creating a test message"""
    return Message.objects.create(
        chat=chat,
        role='user',
        content='Test message content',
        language='en'
    )


@pytest.fixture
def ai_message(chat):
    """Fixture for creating an AI assistant message"""
    return Message.objects.create(
        chat=chat,
        role='assistant',
        content='AI response content',
        ai_model='groq',
        language='en',
        tokens_used=100,
        response_time=1.5
    )


@pytest.fixture
def user_summary(user):
    """Fixture for creating a user summary"""
    return UserSummary.objects.create(
        user=user,
        language='en',
        summary_text='Test summary',
        topics=['topic1', 'topic2'],
        common_queries=['query1', 'query2'],
        chat_count=5,
        message_count=20,
        ai_model_used='groq'
    )


@pytest.fixture
def ai_model_config():
    """Fixture for creating AI model configuration"""
    return AIModelConfig.objects.create(
        name='groq',
        api_key='test_api_key',
        api_endpoint='https://api.groq.com',
        is_active=True,
        max_tokens=2000,
        temperature=0.7,
        supports_english=True,
        supports_arabic=True,
        priority=1
    )
