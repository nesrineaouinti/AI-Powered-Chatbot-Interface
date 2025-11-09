"""
Unit tests for chatbot models
"""
import pytest
from django.contrib.auth import get_user_model
from chatbot.models import Chat, Message, UserSummary, AIModelConfig

User = get_user_model()


@pytest.mark.django_db
class TestChatModel:
    """Tests for Chat model"""
    
    def test_create_chat(self, user):
        """Test creating a chat instance"""
        chat = Chat.objects.create(
            user=user,
            title='Test Chat',
            language='en'
        )
        assert chat.user == user
        assert chat.title == 'Test Chat'
        assert chat.language == 'en'
        assert chat.is_archived is False
        assert str(chat) == f"{user.username} - Test Chat (en)"
    
    def test_chat_without_title(self, user):
        """Test creating a chat without title"""
        chat = Chat.objects.create(user=user, language='ar')
        assert chat.title == ''
        assert str(chat) == f"{user.username} - Untitled (ar)"
    
    def test_get_message_count(self, chat):
        """Test getting message count for a chat"""
        assert chat.get_message_count() == 0
        
        Message.objects.create(chat=chat, role='user', content='Message 1', language='en')
        Message.objects.create(chat=chat, role='assistant', content='Message 2', language='en')
        
        assert chat.get_message_count() == 2
    
    def test_get_last_message(self, chat):
        """Test getting the last message in a chat"""
        assert chat.get_last_message() is None
        
        msg1 = Message.objects.create(chat=chat, role='user', content='First', language='en')
        msg2 = Message.objects.create(chat=chat, role='assistant', content='Second', language='en')
        
        last_msg = chat.get_last_message()
        assert last_msg == msg2
        assert last_msg.content == 'Second'
    
    def test_chat_ordering(self, user):
        """Test that chats are ordered by updated_at descending"""
        chat1 = Chat.objects.create(user=user, title='Chat 1', language='en')
        chat2 = Chat.objects.create(user=user, title='Chat 2', language='en')
        
        chats = Chat.objects.all()
        assert chats[0] == chat2  # Most recent first
        assert chats[1] == chat1
    
    def test_archive_chat(self, chat):
        """Test archiving a chat"""
        assert chat.is_archived is False
        chat.is_archived = True
        chat.save()
        
        chat.refresh_from_db()
        assert chat.is_archived is True


@pytest.mark.django_db
class TestMessageModel:
    """Tests for Message model"""
    
    def test_create_user_message(self, chat):
        """Test creating a user message"""
        message = Message.objects.create(
            chat=chat,
            role='user',
            content='Hello, AI!',
            language='en'
        )
        assert message.chat == chat
        assert message.role == 'user'
        assert message.content == 'Hello, AI!'
        assert message.language == 'en'
        assert message.tokens_used == 0
        assert message.response_time == 0.0
    
    def test_create_assistant_message(self, chat):
        """Test creating an assistant message with AI metadata"""
        message = Message.objects.create(
            chat=chat,
            role='assistant',
            content='Hello, human!',
            ai_model='groq',
            language='en',
            tokens_used=50,
            response_time=1.2
        )
        assert message.role == 'assistant'
        assert message.ai_model == 'groq'
        assert message.tokens_used == 50
        assert message.response_time == 1.2
    
    def test_message_str_representation(self, message):
        """Test message string representation"""
        assert str(message) == 'user: Test message content'
    
    def test_message_str_truncation(self, chat):
        """Test that long messages are truncated in string representation"""
        long_content = 'A' * 100
        message = Message.objects.create(
            chat=chat,
            role='user',
            content=long_content,
            language='en'
        )
        assert str(message) == f'user: {long_content[:50]}...'
    
    def test_message_ordering(self, chat):
        """Test that messages are ordered by created_at ascending"""
        msg1 = Message.objects.create(chat=chat, role='user', content='First', language='en')
        msg2 = Message.objects.create(chat=chat, role='assistant', content='Second', language='en')
        
        messages = chat.messages.all()
        assert messages[0] == msg1
        assert messages[1] == msg2


@pytest.mark.django_db
class TestUserSummaryModel:
    """Tests for UserSummary model"""
    
    def test_create_user_summary(self, user):
        """Test creating a user summary"""
        summary = UserSummary.objects.create(
            user=user,
            language='en',
            summary_text='User is interested in AI and programming',
            topics=['AI', 'Programming', 'Python'],
            common_queries=['How to use AI?', 'Python tutorials'],
            chat_count=10,
            message_count=50,
            ai_model_used='groq'
        )
        assert summary.user == user
        assert summary.language == 'en'
        assert len(summary.topics) == 3
        assert len(summary.common_queries) == 2
        assert summary.chat_count == 10
        assert summary.message_count == 50
    
    def test_user_summary_str_representation(self, user_summary):
        """Test user summary string representation"""
        expected = f"Summary for {user_summary.user.username} (en) - {user_summary.chat_count} chats"
        assert str(user_summary) == expected
    
    def test_user_summary_default_values(self, user):
        """Test default values for topics and common_queries"""
        summary = UserSummary.objects.create(
            user=user,
            language='ar',
            summary_text='Test',
            ai_model_used='groq'
        )
        assert summary.topics == []
        assert summary.common_queries == []
        assert summary.chat_count == 0
        assert summary.message_count == 0


@pytest.mark.django_db
class TestAIModelConfigModel:
    """Tests for AIModelConfig model"""
    
    def test_create_ai_model_config(self):
        """Test creating an AI model configuration"""
        config = AIModelConfig.objects.create(
            name='groq',
            api_key='test_key_123',
            api_endpoint='https://api.groq.com',
            is_active=True,
            max_tokens=2000,
            temperature=0.7,
            supports_english=True,
            supports_arabic=False,
            priority=5
        )
        assert config.name == 'groq'
        assert config.is_active is True
        assert config.max_tokens == 2000
        assert config.temperature == 0.7
        assert config.supports_english is True
        assert config.supports_arabic is False
        assert config.priority == 5
    
    def test_ai_model_str_representation(self, ai_model_config):
        """Test AI model config string representation"""
        assert str(ai_model_config) == 'groq (Active)'
        
        ai_model_config.is_active = False
        ai_model_config.save()
        assert str(ai_model_config) == 'groq (Inactive)'
    
    def test_ai_model_ordering(self):
        """Test that AI models are ordered by priority descending"""
        model1 = AIModelConfig.objects.create(name='groq', priority=1)
        model2 = AIModelConfig.objects.create(name='llama', priority=5)
        model3 = AIModelConfig.objects.create(name='other', priority=3)
        
        models = AIModelConfig.objects.all()
        assert models[0] == model2  # Highest priority first
        assert models[1] == model3
        assert models[2] == model1
    
    def test_ai_model_unique_name(self):
        """Test that model names must be unique"""
        AIModelConfig.objects.create(name='groq')
        
        with pytest.raises(Exception):  # IntegrityError
            AIModelConfig.objects.create(name='groq')
