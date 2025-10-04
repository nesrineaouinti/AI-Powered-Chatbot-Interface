"""
API Views for chatbot functionality
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
import logging
import json
from .models import Chat, Message, UserSummary, AIModelConfig
from .serializers import (
    ChatSerializer, ChatDetailSerializer, ChatCreateSerializer,
    MessageSerializer, MessageCreateSerializer,
    UserSummarySerializer, AIModelPublicSerializer,
    ChatStatisticsSerializer
)
from .ai_service import AIService, AIServiceException
from .utils import translate_text  
import re
from django.db import transaction

logger = logging.getLogger(__name__)


class ChatViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing chat sessions
    
    Endpoints:
    - GET /api/chats/ - List all user's chats
    - POST /api/chats/ - Create new chat
    - GET /api/chats/{id}/ - Get chat details with messages
    - PUT/PATCH /api/chats/{id}/ - Update chat
    - DELETE /api/chats/{id}/ - Delete chat
    - POST /api/chats/{id}/send_message/ - Send message and get AI response
    - POST /api/chats/{id}/archive/ - Archive chat
    - GET /api/chats/statistics/ - Get user's chat statistics
    """
    
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Disable pagination for chat list
    
    def get_queryset(self):
        """Return chats for the current user"""
        return Chat.objects.filter(user=self.request.user).prefetch_related('messages')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return ChatDetailSerializer
        elif self.action == 'create':
            return ChatCreateSerializer
        return ChatSerializer
    
    def perform_create(self, serializer):
        """Create chat for current user"""
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Override create to return full chat details"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Get the created chat and return it with full details
        chat = serializer.instance
        output_serializer = ChatSerializer(chat)
        
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Send a message and get AI response
        
        POST /api/chats/{id}/send_message/
        Body: {
            "content": "User message",
            "language": "en" or "ar",
            "ai_model": "grok" (optional)
        }
        """
        chat = self.get_object()
        serializer = MessageCreateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        content = serializer.validated_data['content']
        language = serializer.validated_data.get('language', chat.language)
        preferred_model = serializer.validated_data.get('ai_model')
        
        try:
            # Save user message
            user_message = Message.objects.create(
                chat=chat,
                role='user',
                content=content,
                language=language
            )
            
            # Get conversation history (last 10 messages for context)
            history = Message.objects.filter(chat=chat).order_by('-created_at')[:10]
            messages_for_ai = [
                {"role": msg.role, "content": msg.content}
                for msg in reversed(history)
            ]
            
            # Generate AI response
            response_text, model_used, tokens_used, response_time = AIService.generate_response(
                messages=messages_for_ai,
                language=language,
                preferred_model=preferred_model
            )
            
            # Save AI response
            ai_message = Message.objects.create(
                chat=chat,
                role='assistant',
                content=response_text,
                ai_model=preferred_model,
                language=language,
                tokens_used=tokens_used,
                response_time=response_time
            )
            
            # Update chat title if it's the first message
            if not chat.title:
                chat.title = content[:50] + ('...' if len(content) > 50 else '')
                chat.save()
            
            # Return both messages
            return Response({
                'user_message': MessageSerializer(user_message).data,
                'ai_message': MessageSerializer(ai_message).data,
                'model_used': model_used
            }, status=status.HTTP_201_CREATED)
            
        except AIServiceException as e:
            logger.error(f"AI service error: {str(e)}")
            return Response(
                {'error': f'AI service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """
        Archive or unarchive a chat
        
        POST /api/chats/{id}/archive/
        Body: {"is_archived": true/false}
        """
        chat = self.get_object()
        is_archived = request.data.get('is_archived', True)
        chat.is_archived = is_archived
        chat.save()
        
        return Response({
            'message': 'Chat archived' if is_archived else 'Chat unarchived',
            'chat': ChatSerializer(chat).data
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get user's chat statistics
        
        GET /api/chats/statistics/
        """
        user = request.user
        chats = Chat.objects.filter(user=user)
        messages = Message.objects.filter(chat__user=user)
        
        # Calculate statistics
        total_chats = chats.count()
        total_messages = messages.count()
        
        chats_by_language = dict(
            chats.values('language').annotate(count=Count('id')).values_list('language', 'count')
        )
        
        messages_by_model = dict(
            messages.filter(role='assistant').values('ai_model')
            .annotate(count=Count('id')).values_list('ai_model', 'count')
        )
        
        average_messages = total_messages / total_chats if total_chats > 0 else 0
        
        data = {
            'total_chats': total_chats,
            'total_messages': total_messages,
            'chats_by_language': chats_by_language,
            'messages_by_model': messages_by_model,
            'average_messages_per_chat': round(average_messages, 2)
        }
        
        serializer = ChatStatisticsSerializer(data)
        return Response(serializer.data)


class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing messages
    
    Endpoints:
    - GET /api/messages/ - List all user's messages
    - GET /api/messages/{id}/ - Get message details
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        """Return messages for the current user's chats"""
        return Message.objects.filter(chat__user=self.request.user).select_related('chat')


class UserSummaryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for user summaries
    
    Endpoints:
    - GET /api/summaries/ - List user's summaries
    - GET /api/summaries/{id}/ - Get summary details
    - POST /api/summaries/generate/ - Generate new summary
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserSummarySerializer
    
    def get_queryset(self):
        """Return summaries for the current user"""
        return UserSummary.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve one summary and auto-translate if user preference differs"""
        instance = self.get_object()
        user = request.user
        user_lang = getattr(user, "language_preference", "en")

        # If languages match, just return
        if instance.language == user_lang:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        # Otherwise translate the summary and topics
        translated_summary = translate_text(instance.summary_text, target_lang=user_lang)
        translated_topics = [translate_text(topic, target_lang=user_lang) for topic in instance.topics]
        translated_common_queries = [translate_text(common_querie, target_lang=user_lang) for common_querie in instance.common_queries]
        # Update in database
        instance.summary_text = translated_summary
        instance.topics = translated_topics
        instance.common_queries = translated_common_queries
        instance.language = user_lang
        instance.save(update_fields=["summary_text", "topics","common_queries", "language", "updated_at"])

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        Generate AI-powered user summary.

        POST /api/summaries/generate/
        Body: {"language": "en" or "ar"}  # optional, defaults to user's preference
        """
        user = request.user
        language = request.data.get("language", getattr(user, "language_preference", "en"))

        if language not in ["en", "ar"]:
            return Response(
                {"error": 'Invalid language. Must be "en" or "ar".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 1: Fetch user messages
        messages = Message.objects.filter(
            chat__user=user,
            role="user",
            language=language
        ).order_by("-created_at")[:100]

        if not messages.exists():
            return Response(
                {"error": "No messages found to generate summary."},
                status=status.HTTP_400_BAD_REQUEST
            )

        message_texts = [msg.content for msg in messages]

        try:
            # Step 2: Generate AI summary
            summary_text = AIService.generate_user_summary(
                user_messages=message_texts,
                language=language
            )

            # Clean up AI response and parse JSON
            json_string = re.sub(r"```(json)?", "", summary_text).strip()
            summary_data = json.loads(json_string)

            # Step 3: Count chats and messages
            chat_count = Chat.objects.filter(user=user).count()
            message_count = messages.count()

            # Step 4: Create or update UserSummary atomically
            with transaction.atomic():
                summary, created = UserSummary.objects.update_or_create(
                    user=user,
                    language=language,
                    defaults={
                        "summary_text": summary_data.get("summary", ""),
                        "topics": summary_data.get("topics", []),
                        "common_queries": summary_data.get("Common queries", []),
                        "chat_count": chat_count,
                        "message_count": message_count,
                        "ai_model_used": "openai",  # could be dynamic
                    }
                )

            # Step 5: Return response
            return Response(
                {
                    "message": "Summary generated successfully",
                    "summary": UserSummarySerializer(summary).data,
                },
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )

        except AIServiceException as e:
            logger.error(f"AI service error: {str(e)}")
            return Response(
                {"error": f"Failed to generate summary: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response: {str(e)}")
            return Response(
                {"error": "AI response could not be parsed."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Unexpected error generating summary: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AIModelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing available AI models
    
    Endpoints:
    - GET /api/ai-models/ - List available AI models
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = AIModelPublicSerializer
    
    def get_queryset(self):
        """Return active AI models"""
        return AIModelConfig.objects.filter(is_active=True)
