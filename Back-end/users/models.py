from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with language preference support.
    
    Security Features:
    - Inherits Django's AbstractUser with built-in password hashing (PBKDF2)
    - Email field for account recovery
    - Language preference stored for personalization
    """
    
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('ar', 'Arabic'),
    ]
    
    email = models.EmailField(
        unique=True,
        help_text="User's email address - used for authentication and recovery"
    )
    language_preference = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='en',
        help_text="User's preferred language (English or Arabic)"
    )
    
    # Google OAuth fields
    google_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        help_text="Google account ID for OAuth authentication"
    )
    profile_picture = models.URLField(
        blank=True,
        null=True,
        help_text="URL to user's profile picture from Google"
    )
    is_oauth_user = models.BooleanField(
        default=False,
        help_text="True if user registered via OAuth (Google)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
        ]
    
    def __str__(self):
        return f"{self.username} ({self.email})"
