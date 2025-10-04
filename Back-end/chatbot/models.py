from django.db import models
from django.conf import settings
from django.utils import timezone


class Chat(models.Model):
    """
    Represents a chat session between a user and AI.
    Each chat can contain multiple messages and has language context.
    """
    
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('ar', 'Arabic'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chats',
        help_text="User who owns this chat"
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Chat title (auto-generated from first message)"
    )
    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='en',
        help_text="Language used in this chat session"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_archived = models.BooleanField(
        default=False,
        help_text="Whether this chat is archived"
    )
    
    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', '-updated_at']),
            models.Index(fields=['user', 'language']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title or 'Untitled'} ({self.language})"
    
    def get_message_count(self):
        """Returns the total number of messages in this chat"""
        return self.messages.count()
    
    def get_last_message(self):
        """Returns the most recent message in this chat"""
        return self.messages.order_by('-created_at').first()


class Message(models.Model):
    """
    Represents a single message in a chat (user query or AI response).
    """
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]
    
    AI_MODEL_CHOICES = [
        ('groq', 'Groq'),
        ('llama', 'LLaMA'),
        ('other', 'Other'),
    ]
    
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name='messages',
        help_text="Chat session this message belongs to"
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        help_text="Who sent this message (user/assistant/system)"
    )
    content = models.TextField(
        help_text="Message content"
    )
    ai_model = models.CharField(
        max_length=20,
        choices=AI_MODEL_CHOICES,
        blank=True,
        null=True,
        help_text="AI model used to generate this response (if assistant)"
    )
    language = models.CharField(
        max_length=2,
        choices=Chat.LANGUAGE_CHOICES,
        help_text="Language of this message"
    )
    tokens_used = models.IntegerField(
        default=0,
        help_text="Number of tokens used for this message (if AI response)"
    )
    response_time = models.FloatField(
        default=0.0,
        help_text="Time taken to generate response in seconds"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['chat', 'created_at']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        content_preview = self.content[:50] + '...' if len(self.content) > 50 else self.content
        return f"{self.role}: {content_preview}"


class UserSummary(models.Model):
    """
    AI-generated summary of user's chat history.
    Helps provide context and personalization in future conversations.
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='summaries',
        help_text="User this summary belongs to"
    )
    language = models.CharField(
        max_length=2,
        choices=Chat.LANGUAGE_CHOICES,
        help_text="Language of the summary"
    )
    summary_text = models.TextField(
        help_text="AI-generated summary of user's interests and conversation patterns"
    )
    topics = models.JSONField(
        default=list,
        help_text="List of main topics discussed by the user"
    )
    common_queries = models.JSONField(
        default=list,
        help_text="User queries extracted from conversations"
    )
    chat_count = models.IntegerField(
        default=0,
        help_text="Number of chats analyzed for this summary"
    )
    message_count = models.IntegerField(
        default=0,
        help_text="Number of messages analyzed for this summary"
    )
    ai_model_used = models.CharField(
        max_length=20,
        choices=Message.AI_MODEL_CHOICES,
        help_text="AI model used to generate this summary"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', 'language']),
            models.Index(fields=['user', '-updated_at']),
        ]
        verbose_name_plural = "User summaries"
    
    def __str__(self):
        return f"Summary for {self.user.username} ({self.language}) - {self.chat_count} chats"


class AIModelConfig(models.Model):
    """
    Configuration for different AI models.
    Stores API keys, endpoints, and model-specific settings.
    """
    
    name = models.CharField(
        max_length=50,
        unique=True,
        choices=Message.AI_MODEL_CHOICES,
        help_text="AI model name"
    )
    api_key = models.CharField(
        max_length=500,
        blank=True,
        help_text="API key for this model (encrypted in production)"
    )
    api_endpoint = models.URLField(
        blank=True,
        help_text="API endpoint URL"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this model is currently active"
    )
    max_tokens = models.IntegerField(
        default=2000,
        help_text="Maximum tokens per request"
    )
    temperature = models.FloatField(
        default=0.7,
        help_text="Temperature setting for response generation"
    )
    supports_english = models.BooleanField(
        default=True,
        help_text="Whether this model supports English"
    )
    supports_arabic = models.BooleanField(
        default=True,
        help_text="Whether this model supports Arabic"
    )
    priority = models.IntegerField(
        default=0,
        help_text="Priority order (higher = preferred)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', 'name']
    
    def __str__(self):
        status = "Active" if self.is_active else "Inactive"
        return f"{self.name} ({status})"
