"""
Unit tests for chatbot serializers
"""
import pytest
from chatbot.serializers import (
    MessageSerializer, MessageCreateSerializer,
    ChatSerializer, ChatDetailSerializer, ChatCreateSerializer,
    UserSummarySerializer, AIModelConfigSerializer, AIModelPublicSerializer,
    ChatStatisticsSerializer
)
from chatbot.models import Chat, Message


@pytest.mark.django_db
class TestMessageSerializer:
    """Tests for MessageSerializer"""
    
    def test_serialize_message(self, message):
        """Test serializing a message"""
        serializer = MessageSerializer(message)
        data = serializer.data
        
        assert data['id'] == message.id
        assert data['role'] == 'user'
        assert data['content'] == 'Test message content'
        assert data['language'] == 'en'
        assert 'created_at' in data
    
    def test_validate_valid_role(self):
        """Test validating a valid role"""
        serializer = MessageSerializer()
        assert serializer.validate_role('user') == 'user'
        assert serializer.validate_role('assistant') == 'assistant'
        assert serializer.validate_role('system') == 'system'
    
    def test_validate_invalid_role(self):
        """Test validating an invalid role"""
        from rest_framework.exceptions import ValidationError
        serializer = MessageSerializer()
        
        with pytest.raises(ValidationError) as exc_info:
            serializer.validate_role('invalid')
        
        assert "Invalid role" in str(exc_info.value)


@pytest.mark.django_db
class TestMessageCreateSerializer:
    """Tests for MessageCreateSerializer"""
    
    def test_valid_message_create_data(self):
        """Test validating valid message creation data"""
        data = {
            'content': 'Hello, AI!',
            'language': 'en',
            'ai_model': 'groq'
        }
        serializer = MessageCreateSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data['content'] == 'Hello, AI!'
        assert serializer.validated_data['language'] == 'en'
        assert serializer.validated_data['ai_model'] == 'groq'
    
    def test_message_create_with_defaults(self):
        """Test message creation with default values"""
        data = {'content': 'Test message'}
        serializer = MessageCreateSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data['language'] == 'en'
    
    def test_message_create_max_length(self):
        """Test message content max length validation"""
        data = {'content': 'A' * 10001}  # Exceeds max_length
        serializer = MessageCreateSerializer(data=data)
        assert not serializer.is_valid()
        assert 'content' in serializer.errors


@pytest.mark.django_db
class TestChatSerializer:
    """Tests for ChatSerializer"""
    
    def test_serialize_chat(self, chat, user):
        """Test serializing a chat"""
        serializer = ChatSerializer(chat)
        data = serializer.data
        
        assert data['id'] == chat.id
        assert data['title'] == 'Test Chat'
        assert data['language'] == 'en'
        assert data['user_username'] == user.username
        assert data['is_archived'] is False
        assert data['message_count'] == 0
    
    def test_chat_with_messages(self, chat):
        """Test serializing a chat with messages"""
        Message.objects.create(chat=chat, role='user', content='Message 1', language='en')
        Message.objects.create(chat=chat, role='assistant', content='Message 2', language='en')
        
        serializer = ChatSerializer(chat)
        data = serializer.data
        
        assert data['message_count'] == 2
        assert data['last_message'] is not None
        assert data['last_message']['content'] == 'Message 2'
        assert data['last_message']['role'] == 'assistant'
    
    def test_chat_last_message_truncation(self, chat):
        """Test that last message content is truncated to 100 chars"""
        long_content = 'A' * 150
        Message.objects.create(chat=chat, role='user', content=long_content, language='en')
        
        serializer = ChatSerializer(chat)
        data = serializer.data
        
        assert len(data['last_message']['content']) == 100


@pytest.mark.django_db
class TestChatDetailSerializer:
    """Tests for ChatDetailSerializer"""
    
    def test_serialize_chat_with_messages(self, chat):
        """Test serializing chat with all messages"""
        msg1 = Message.objects.create(chat=chat, role='user', content='User msg', language='en')
        msg2 = Message.objects.create(chat=chat, role='assistant', content='AI msg', language='en')
        
        serializer = ChatDetailSerializer(chat)
        data = serializer.data
        
        assert len(data['messages']) == 2
        assert data['messages'][0]['content'] == 'User msg'
        assert data['messages'][1]['content'] == 'AI msg'
        assert data['message_count'] == 2


@pytest.mark.django_db
class TestChatCreateSerializer:
    """Tests for ChatCreateSerializer"""
    
    def test_valid_chat_creation(self):
        """Test validating valid chat creation data"""
        data = {
            'title': 'New Chat',
            'language': 'en'
        }
        serializer = ChatCreateSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data['title'] == 'New Chat'
        assert serializer.validated_data['language'] == 'en'
    
    def test_validate_valid_language(self):
        """Test validating valid language"""
        serializer = ChatCreateSerializer()
        assert serializer.validate_language('en') == 'en'
        assert serializer.validate_language('ar') == 'ar'
    
    def test_validate_invalid_language(self):
        """Test validating invalid language"""
        from rest_framework.exceptions import ValidationError
        serializer = ChatCreateSerializer()
        
        with pytest.raises(ValidationError) as exc_info:
            serializer.validate_language('fr')
        
        assert "Invalid language" in str(exc_info.value)


@pytest.mark.django_db
class TestUserSummarySerializer:
    """Tests for UserSummarySerializer"""
    
    def test_serialize_user_summary(self, user_summary):
        """Test serializing a user summary"""
        serializer = UserSummarySerializer(user_summary)
        data = serializer.data
        
        assert data['id'] == user_summary.id
        assert data['user_username'] == user_summary.user.username
        assert data['language'] == 'en'
        assert data['summary_text'] == 'Test summary'
        assert data['topics'] == ['topic1', 'topic2']
        assert data['common_queries'] == ['query1', 'query2']
        assert data['chat_count'] == 5
        assert data['message_count'] == 20


@pytest.mark.django_db
class TestAIModelConfigSerializer:
    """Tests for AIModelConfigSerializer"""
    
    def test_serialize_ai_model_config(self, ai_model_config):
        """Test serializing AI model config"""
        serializer = AIModelConfigSerializer(ai_model_config)
        data = serializer.data
        
        assert data['name'] == 'groq'
        assert data['is_active'] is True
        assert data['max_tokens'] == 2000
        assert data['temperature'] == 0.7
        assert data['supports_english'] is True
        assert data['supports_arabic'] is True
        assert data['priority'] == 1


@pytest.mark.django_db
class TestAIModelPublicSerializer:
    """Tests for AIModelPublicSerializer (no sensitive data)"""
    
    def test_serialize_public_model_info(self, ai_model_config):
        """Test that only public fields are serialized"""
        serializer = AIModelPublicSerializer(ai_model_config)
        data = serializer.data
        
        assert 'name' in data
        assert 'is_active' in data
        assert 'supports_english' in data
        assert 'supports_arabic' in data
        
        # Sensitive fields should not be exposed
        assert 'api_key' not in data
        assert 'api_endpoint' not in data


class TestChatStatisticsSerializer:
    """Tests for ChatStatisticsSerializer"""
    
    def test_serialize_statistics(self):
        """Test serializing chat statistics"""
        data = {
            'total_chats': 10,
            'total_messages': 50,
            'chats_by_language': {'en': 7, 'ar': 3},
            'messages_by_model': {'groq': 30, 'llama': 20},
            'average_messages_per_chat': 5.0
        }
        serializer = ChatStatisticsSerializer(data)
        
        assert serializer.data['total_chats'] == 10
        assert serializer.data['total_messages'] == 50
        assert serializer.data['chats_by_language'] == {'en': 7, 'ar': 3}
        assert serializer.data['average_messages_per_chat'] == 5.0
