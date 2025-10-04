"""
Serializers for chatbot models
"""

from rest_framework import serializers
from .models import Chat, Message, UserSummary, AIModelConfig
from django.contrib.auth import get_user_model

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model"""
    
    class Meta:
        model = Message
        fields = [
            'id', 'chat', 'role', 'content', 'ai_model',
            'language', 'tokens_used', 'response_time', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'tokens_used', 'response_time']
    
    def validate_role(self, value):
        """Ensure role is valid"""
        if value not in ['user', 'assistant', 'system']:
            raise serializers.ValidationError("Invalid role. Must be 'user', 'assistant', or 'system'.")
        return value


class MessageCreateSerializer(serializers.Serializer):
    """Serializer for creating a message and getting AI response"""
    
    content = serializers.CharField(required=True, max_length=10000)
    language = serializers.ChoiceField(choices=['en', 'ar'], default='en')
    ai_model = serializers.ChoiceField(
        choices=['groq','llama', 'other'],
        required=False,
        allow_null=True
    )


class ChatSerializer(serializers.ModelSerializer):
    """Serializer for Chat model"""
    
    message_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Chat
        fields = [
            'id', 'user', 'user_username', 'title', 'language',
            'created_at', 'updated_at', 'is_archived',
            'message_count', 'last_message'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        """Get total message count"""
        return obj.get_message_count()
    
    def get_last_message(self, obj):
        """Get last message preview"""
        last_msg = obj.get_last_message()
        if last_msg:
            return {
                'content': last_msg.content[:100],
                'role': last_msg.role,
                'created_at': last_msg.created_at
            }
        return None


class ChatDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Chat with all messages"""
    
    messages = MessageSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Chat
        fields = [
            'id', 'user', 'user_username', 'title', 'language',
            'created_at', 'updated_at', 'is_archived',
            'message_count', 'messages'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        """Get total message count"""
        return obj.get_message_count()


class ChatCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new chat"""
    
    class Meta:
        model = Chat
        fields = ['title', 'language']
    
    def validate_language(self, value):
        """Ensure language is valid"""
        if value not in ['en', 'ar']:
            raise serializers.ValidationError("Invalid language. Must be 'en' or 'ar'.")
        return value


class UserSummarySerializer(serializers.ModelSerializer):
    """Serializer for UserSummary model"""
    
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserSummary
        fields = [
            'id', 'user', 'user_username', 'language', 'summary_text',
            'topics', 'common_queries', 'chat_count', 'message_count',
            'ai_model_used', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class AIModelConfigSerializer(serializers.ModelSerializer):
    """Serializer for AIModelConfig (admin use)"""
    
    class Meta:
        model = AIModelConfig
        fields = [
            'id', 'name', 'is_active', 'max_tokens', 'temperature',
            'supports_english', 'supports_arabic', 'priority'
        ]
        # Don't expose API keys
        read_only_fields = ['id']


class AIModelPublicSerializer(serializers.ModelSerializer):
    """Public serializer for AI models (no sensitive data)"""
    
    class Meta:
        model = AIModelConfig
        fields = [
            'name', 'is_active', 'supports_english', 'supports_arabic'
        ]


class ChatStatisticsSerializer(serializers.Serializer):
    """Serializer for chat statistics"""
    
    total_chats = serializers.IntegerField()
    total_messages = serializers.IntegerField()
    chats_by_language = serializers.DictField()
    messages_by_model = serializers.DictField()
    average_messages_per_chat = serializers.FloatField()
