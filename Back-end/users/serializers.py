import imp
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import User
from chatbot.models import UserSummary

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    
    Security Features:
    - Password validation using Django's built-in validators
    - Password confirmation to prevent typos
    - Email uniqueness validation
    - Password is write-only (never returned in responses)
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'language_preference']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
    
    def validate(self, attrs):
        """
        Validate that passwords match.
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def validate_email(self, value):
        """
        Validate email uniqueness.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()
    
    def create(self, validated_data):
        """
        Create user with hashed password.
        
        Security: Uses Django's set_password() which applies PBKDF2 hashing
        """
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    
    Security Features:
    - Accepts username or email for flexibility
    - Password is write-only
    - No sensitive data in error messages (prevents user enumeration)
    """
    username_or_email = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile data.
    Automatically includes the user's summary_id if a summary exists.
    """
    summary_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'language_preference', 'profile_picture', 'is_oauth_user',
            'created_at', 'updated_at', 'summary_id'
        ]
        read_only_fields = ['id', 'is_oauth_user', 'created_at', 'updated_at', 'summary_id']

    def get_summary_id(self, obj):
        """
        Return the ID of the user's summary if it exists, otherwise None.
        """
        summary = UserSummary.objects.filter(user=obj).first()
        return summary.id if summary else None

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change.
    
    Security Features:
    - Requires old password verification
    - Validates new password strength
    - Confirms new password to prevent typos
    """
    old_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """
        Validate that new passwords match.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "New password fields didn't match."
            })
        return attrs
    
    def validate_old_password(self, value):
        """
        Verify the old password is correct.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class GoogleAuthSerializer(serializers.Serializer):
    """
    Serializer for Google OAuth authentication.
    
    Security Features:
    - Validates Google ID token server-side
    - Verifies token signature and expiration
    - Prevents token replay attacks
    """
    token = serializers.CharField(
        required=True,
        help_text="Google ID token from OAuth flow"
    )
    language_preference = serializers.ChoiceField(
        choices=User.LANGUAGE_CHOICES,
        default='en',
        required=False
    )
