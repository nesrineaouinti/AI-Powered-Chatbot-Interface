from django.contrib import admin
from .models import Chat, Message, UserSummary, AIModelConfig


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'language', 'message_count', 'created_at', 'is_archived')
    list_filter = ('language', 'is_archived', 'created_at')
    search_fields = ('user__username', 'user__email', 'title')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
    def message_count(self, obj):
        return obj.get_message_count()
    message_count.short_description = 'Messages'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chat', 'role', 'content_preview', 'ai_model', 'language', 'created_at')
    list_filter = ('role', 'ai_model', 'language', 'created_at')
    search_fields = ('content', 'chat__user__username')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content'


@admin.register(UserSummary)
class UserSummaryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'language', 'chat_count', 'message_count', 'ai_model_used', 'updated_at')
    list_filter = ('language', 'ai_model_used', 'created_at')
    search_fields = ('user__username', 'user__email', 'summary_text')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'updated_at'


@admin.register(AIModelConfig)
class AIModelConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'priority', 'supports_english', 'supports_arabic', 'max_tokens')
    list_filter = ('is_active', 'supports_english', 'supports_arabic')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'is_active', 'priority')
        }),
        ('API Configuration', {
            'fields': ('api_key', 'api_endpoint')
        }),
        ('Model Settings', {
            'fields': ('max_tokens', 'temperature', 'supports_english', 'supports_arabic')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
