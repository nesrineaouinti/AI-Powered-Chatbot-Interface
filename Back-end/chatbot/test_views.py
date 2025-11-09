"""
Unit tests for chatbot views
"""
import pytest
from django.urls import reverse
from rest_framework import status
from chatbot.models import Chat, Message, UserSummary
from unittest.mock import patch, MagicMock


@pytest.mark.django_db
class TestChatViewSet:
    """Tests for ChatViewSet"""
    
    def test_list_chats_unauthenticated(self, api_client):
        """Test that unauthenticated users cannot list chats"""
        url = reverse('chat-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_list_chats_authenticated(self, authenticated_client, user):
        """Test listing chats for authenticated user"""
        Chat.objects.create(user=user, title='Chat 1', language='en')
        Chat.objects.create(user=user, title='Chat 2', language='ar')
        
        url = reverse('chat-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
    
    def test_list_chats_only_own_chats(self, authenticated_client, user, db):
        """Test that users only see their own chats"""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        other_user = User.objects.create_user(
            email='other@example.com',
            username='other',
            password='pass'
        )
        Chat.objects.create(user=user, title='My Chat', language='en')
        Chat.objects.create(user=other_user, title='Other Chat', language='en')
        
        url = reverse('chat-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == 'My Chat'
    
    def test_create_chat(self, authenticated_client):
        """Test creating a new chat"""
        url = reverse('chat-list')
        data = {
            'title': 'New Chat',
            'language': 'en'
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Chat'
        assert response.data['language'] == 'en'
        assert Chat.objects.count() == 1
    
    def test_create_chat_invalid_language(self, authenticated_client):
        """Test creating chat with invalid language"""
        url = reverse('chat-list')
        data = {
            'title': 'New Chat',
            'language': 'fr'  # Invalid
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_retrieve_chat(self, authenticated_client, chat):
        """Test retrieving a specific chat with messages"""
        Message.objects.create(chat=chat, role='user', content='Test', language='en')
        
        url = reverse('chat-detail', kwargs={'pk': chat.id})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == chat.id
        assert len(response.data['messages']) == 1
    
    def test_update_chat(self, authenticated_client, chat):
        """Test updating a chat"""
        url = reverse('chat-detail', kwargs={'pk': chat.id})
        data = {'title': 'Updated Title'}
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Title'
        
        chat.refresh_from_db()
        assert chat.title == 'Updated Title'
    
    def test_delete_chat(self, authenticated_client, chat):
        """Test deleting a chat"""
        url = reverse('chat-detail', kwargs={'pk': chat.id})
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Chat.objects.count() == 0
    
    def test_archive_chat(self, authenticated_client, chat):
        """Test archiving a chat"""
        url = reverse('chat-archive', kwargs={'pk': chat.id})
        data = {'is_archived': True}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        chat.refresh_from_db()
        assert chat.is_archived is True
    
    def test_unarchive_chat(self, authenticated_client, chat):
        """Test unarchiving a chat"""
        chat.is_archived = True
        chat.save()
        
        url = reverse('chat-archive', kwargs={'pk': chat.id})
        data = {'is_archived': False}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        chat.refresh_from_db()
        assert chat.is_archived is False
    
    def test_get_statistics(self, authenticated_client, user):
        """Test getting chat statistics"""
        chat1 = Chat.objects.create(user=user, language='en')
        chat2 = Chat.objects.create(user=user, language='ar')
        
        Message.objects.create(chat=chat1, role='user', content='Test', language='en')
        Message.objects.create(chat=chat1, role='assistant', content='Response', 
                             ai_model='groq', language='en')
        Message.objects.create(chat=chat2, role='user', content='Test', language='ar')
        
        url = reverse('chat-statistics')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['total_chats'] == 2
        assert response.data['total_messages'] == 3
        assert response.data['chats_by_language'] == {'en': 1, 'ar': 1}
    
    @patch('chatbot.views.AIService.generate_response')
    @patch('chatbot.views.AIService.add_document')
    def test_send_message(self, mock_add_doc, mock_generate, authenticated_client, chat):
        """Test sending a message and getting AI response"""
        # Mock AI service response
        mock_generate.return_value = ('AI response', 'groq', 100, 1.5)
        mock_add_doc.return_value = None
        
        url = reverse('chat-send-message', kwargs={'pk': chat.id})
        data = {
            'content': 'Hello, AI!',
            'language': 'en'
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'user_message' in response.data
        assert 'ai_message' in response.data
        assert response.data['user_message']['content'] == 'Hello, AI!'
        assert response.data['ai_message']['content'] == 'AI response'
        
        # Verify messages were created
        assert Message.objects.count() == 2
        
        # Verify AI service was called
        mock_generate.assert_called_once()
        mock_add_doc.assert_called_once_with('Hello, AI!')
    
    @patch('chatbot.views.AIService.generate_response')
    @patch('chatbot.views.AIService.add_document')
    def test_send_message_updates_chat_title(self, mock_add_doc, mock_generate, 
                                             authenticated_client, user):
        """Test that first message sets chat title"""
        mock_generate.return_value = ('AI response', 'groq', 100, 1.5)
        mock_add_doc.return_value = None
        
        chat = Chat.objects.create(user=user, language='en')  # No title
        
        url = reverse('chat-send-message', kwargs={'pk': chat.id})
        data = {
            'content': 'This is my first message to the AI',
            'language': 'en'
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        chat.refresh_from_db()
        assert chat.title == 'This is my first message to the AI'
    
    @patch('chatbot.views.AIService.generate_response')
    def test_send_message_ai_service_error(self, mock_generate, authenticated_client, chat):
        """Test handling AI service errors"""
        from chatbot.ai_service import AIServiceException
        mock_generate.side_effect = AIServiceException('API Error')
        
        url = reverse('chat-send-message', kwargs={'pk': chat.id})
        data = {'content': 'Test', 'language': 'en'}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        assert 'error' in response.data


@pytest.mark.django_db
class TestMessageViewSet:
    """Tests for MessageViewSet"""
    
    def test_list_messages_unauthenticated(self, api_client):
        """Test that unauthenticated users cannot list messages"""
        url = reverse('message-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_list_messages_authenticated(self, authenticated_client, chat, message):
        """Test listing messages for authenticated user"""
        # Note: message fixture already creates one message
        Message.objects.create(chat=chat, role='assistant', content='Msg 2', language='en')
        
        url = reverse('message-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Response is paginated, check results
        assert response.data['count'] == 2
        assert len(response.data['results']) == 2
    
    def test_retrieve_message(self, authenticated_client, message):
        """Test retrieving a specific message"""
        url = reverse('message-detail', kwargs={'pk': message.id})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == message.id
        assert response.data['content'] == 'Test message content'


@pytest.mark.django_db
class TestUserSummaryViewSet:
    """Tests for UserSummaryViewSet"""
    
    def test_list_summaries(self, authenticated_client, user_summary):
        """Test listing user summaries"""
        url = reverse('usersummary-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Response is paginated, check results
        assert response.data['count'] == 1
        assert len(response.data['results']) == 1
    
    def test_retrieve_summary(self, authenticated_client, user_summary):
        """Test retrieving a specific summary"""
        url = reverse('usersummary-detail', kwargs={'pk': user_summary.id})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user_summary.id
    
    @patch('chatbot.views.AIService.generate_user_summary')
    def test_generate_summary(self, mock_user_summary, authenticated_client, user, chat):
        """Test generating a new user summary"""
        # Create some messages
        Message.objects.create(chat=chat, role='user', content='Test message 1', language='en')
        Message.objects.create(chat=chat, role='user', content='Test message 2', language='en')
        
        # Mock AI response
        mock_summary = {
            'summary': 'User is interested in testing',
            'topics': ['Testing', 'AI'],
            'Common queries': ['How to test?']
        }
        import json
        mock_user_summary.return_value = json.dumps(mock_summary)
        
        url = reverse('usersummary-generate')
        data = {'language': 'en'}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'summary' in response.data
        assert UserSummary.objects.count() == 1
        
        summary = UserSummary.objects.first()
        assert summary.summary_text == 'User is interested in testing'
        assert summary.topics == ['Testing', 'AI']
    
    def test_generate_summary_no_messages(self, authenticated_client):
        """Test generating summary with no messages"""
        url = reverse('usersummary-generate')
        data = {'language': 'en'}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data


@pytest.mark.django_db
class TestAIModelViewSet:
    """Tests for AIModelViewSet"""
    
    def test_list_active_models(self, authenticated_client, ai_model_config):
        """Test listing active AI models"""
        url = reverse('aimodelconfig-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Response is paginated, check results
        assert response.data['count'] == 1
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['name'] == 'groq'
        
        # Ensure sensitive data is not exposed
        assert 'api_key' not in response.data['results'][0]
        assert 'api_endpoint' not in response.data['results'][0]
