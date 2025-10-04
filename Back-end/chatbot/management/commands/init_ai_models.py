"""
Management command to initialize AI model configurations
"""

from django.core.management.base import BaseCommand
from django.conf import settings
from chatbot.models import AIModelConfig


class Command(BaseCommand):
    help = 'Initialize AI model configurations in the database'

    def handle(self, *args, **options):
        self.stdout.write('Initializing AI model configurations...')
        
        models_config = [
            {
                'name': 'groq',
                'api_key': settings.GROQ_API_KEY,
                'api_endpoint': settings.GROQ_API_ENDPOINT,
                'is_active': bool(settings.GROQ_API_KEY),
                'max_tokens': 2000,
                'temperature': 0.7,
                'supports_english': True,
                'supports_arabic': True,
                'priority': 10,
            },
            {
                'name': 'llama',
                'api_key': '',
                'api_endpoint': settings.LLAMA_API_ENDPOINT,
                'is_active': False,  # Requires local setup
                'max_tokens': 2000,
                'temperature': 0.7,
                'supports_english': True,
                'supports_arabic': True,
                'priority': 4,
            },
            {
                'name': 'other',
                'api_key': '',
                'api_endpoint': '',
                'is_active': True,  # Mock provider always available
                'max_tokens': 2000,
                'temperature': 0.7,
                'supports_english': True,
                'supports_arabic': True,
                'priority': 0,
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for config in models_config:
            model, created = AIModelConfig.objects.update_or_create(
                name=config['name'],
                defaults=config
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created AI model: {model.name}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'↻ Updated AI model: {model.name}')
                )
        
        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully initialized {created_count} new models and updated {updated_count} existing models'
            )
        )
        
        # Show active models
        active_models = AIModelConfig.objects.filter(is_active=True).order_by('-priority')
        if active_models.exists():
            self.stdout.write('')
            self.stdout.write(self.style.SUCCESS('Active AI models:'))
            for model in active_models:
                status = '✓' if model.api_key else '⚠ (no API key)'
                self.stdout.write(f'  - {model.name} (priority: {model.priority}) {status}')
        else:
            self.stdout.write('')
            self.stdout.write(
                self.style.WARNING(
                    'No active AI models configured. Add API keys to .env file.'
                )
            )
