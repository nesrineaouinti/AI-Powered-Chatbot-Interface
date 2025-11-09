"""
URL configuration for chatbot app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, MessageViewSet, UserSummaryViewSet, AIModelViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'summaries', UserSummaryViewSet, basename='usersummary')
router.register(r'ai-models', AIModelViewSet, basename='aimodelconfig')

urlpatterns = [
    path('', include(router.urls)),
]
