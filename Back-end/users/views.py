from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.db.models import Q
from django.conf import settings
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    GoogleAuthSerializer
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that includes user data in the response.
    
    Security: Adds user info to token claims for client-side use
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['language_preference'] = user.language_preference
        
        return token


@method_decorator(ratelimit(key='ip', rate='5/h', method='POST'), name='dispatch')
class UserRegistrationView(APIView):
    """
    API endpoint for user registration.
    
    POST /api/auth/signup/
    
    Security Features:
    - Public endpoint (no authentication required)
    - Password validation and hashing
    - Email uniqueness check
    - Returns JWT tokens on successful registration
    - Rate limited: 5 signups per hour per IP
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(ratelimit(key='ip', rate='10/h', method='POST'), name='dispatch')
class UserLoginView(APIView):
    """
    API endpoint for user login.
    
    POST /api/auth/login/
    
    Security Features:
    - Public endpoint (no authentication required)
    - Accepts username OR email for login
    - Password verification using Django's check_password
    - Returns JWT tokens on successful authentication
    - Generic error messages to prevent user enumeration
    - Rate limited: 10 login attempts per hour per IP
    """
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(ratelimit(key='ip', rate='10/h', method='POST', block=True))
    def post(self, request):
        try:
            serializer = UserLoginSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            username_or_email = serializer.validated_data['username_or_email']
            password = serializer.validated_data['password']
            
            # Try to find user by username or email
            try:
                user = User.objects.get(
                    Q(username=username_or_email) | Q(email=username_or_email)
                )
            except User.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=401)
            
            # Authenticate user
            user = authenticate(username=user.username, password=password)
            
            if user is None:
                return Response({'error': 'Invalid credentials'}, status=401)
            
            if not user.is_active:
                return Response({'error': 'Account is disabled'}, status=401)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=200)
        
        except Ratelimited:
            return Response(
                {'error': 'Too many login attempts. Please try again later.'},
                status=429
            )

class UserLogoutView(APIView):
    """
    API endpoint for user logout.
    
    POST /api/auth/logout/
    
    Security Features:
    - Requires authentication (valid JWT token)
    - Blacklists the refresh token to prevent reuse
    - Note: Access tokens remain valid until expiration (stateless JWT)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            
            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve and update user profile.
    
    GET /api/auth/profile/
    PUT/PATCH /api/auth/profile/
    
    Security Features:
    - Requires authentication (valid JWT token)
    - Users can only access/update their own profile
    - Password changes require separate endpoint
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    API endpoint for changing user password.
    
    POST /api/auth/change-password/
    
    Security Features:
    - Requires authentication (valid JWT token)
    - Requires old password verification
    - Validates new password strength
    - Hashes new password before storing
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(ratelimit(key='ip', rate='20/h', method='POST'), name='dispatch')
class GoogleAuthView(APIView):
    """
    API endpoint for Google OAuth authentication.
    
    POST /api/auth/google/
    
    Security Features:
    - Validates Google ID token server-side
    - Verifies token signature with Google's public keys
    - Checks token expiration and audience
    - Creates or retrieves user based on Google ID
    - Returns JWT tokens for subsequent API calls
    - Rate limited: 20 attempts per hour per IP
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        token = serializer.validated_data['token']
        language_pref = serializer.validated_data.get('language_preference', 'en')
        
        try:
            # Verify the Google ID token
            # This validates the token signature, expiration, and audience
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_OAUTH_CLIENT_ID
            )
            
            # Verify the token issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return Response({
                    'error': 'Invalid token issuer'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Extract user information from the token
            google_id = idinfo['sub']
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            profile_picture = idinfo.get('picture', '')
            email_verified = idinfo.get('email_verified', False)
            
            if not email_verified:
                return Response({
                    'error': 'Email not verified by Google'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists by Google ID
            user = User.objects.filter(google_id=google_id).first()
            
            if user:
                # Existing Google user - update profile picture if changed
                if user.profile_picture != profile_picture:
                    user.profile_picture = profile_picture
                    user.save()
                
                message = 'Login successful'
            else:
                # Check if user exists by email (regular registration)
                user = User.objects.filter(email=email).first()
                
                if user:
                    # Link existing account to Google
                    user.google_id = google_id
                    user.profile_picture = profile_picture
                    user.is_oauth_user = True
                    user.save()
                    message = 'Account linked to Google successfully'
                else:
                    # Create new user
                    # Generate unique username from email
                    username = email.split('@')[0]
                    base_username = username
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1
                    
                    user = User.objects.create(
                        username=username,
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        google_id=google_id,
                        profile_picture=profile_picture,
                        language_preference=language_pref,
                        is_oauth_user=True
                    )
                    # OAuth users don't need a password
                    user.set_unusable_password()
                    user.save()
                    message = 'User registered successfully via Google'
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': message,
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Invalid token
            return Response({
                'error': 'Invalid Google token',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Authentication failed',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
