"""
Django management command to set up AI models
Usage: python manage.py setup_ai_models
"""

from django.core.management.base import BaseCommand
from chatbot.models import AIModelConfig


class Command(BaseCommand):
    help = 'Set up AI model configurations for LLaMA, Grok, and DeepSeek'

    def add_arguments(self, parser):
        parser.add_argument(
            '--model',
            type=str,
            choices=['llama', 'grok', 'deepseek', 'all'],
            default='all',
            help='Which model to set up (default: all)'
        )
        parser.add_argument(
            '--grok-key',
            type=str,
            help='Grok API key'
        )
        parser.add_argument(
            '--deepseek-key',
            type=str,
            help='DeepSeek API key'
        )

    def handle(self, *args, **options):
        model_choice = options['model']
        
        self.stdout.write(self.style.SUCCESS('\n🤖 Setting up AI Models...\n'))

        if model_choice in ['llama', 'all']:
            self.setup_llama()
        
        if model_choice in ['grok', 'all']:
            self.setup_grok(options.get('grok_key'))
        
        if model_choice in ['deepseek', 'all']:
            self.setup_deepseek(options.get('deepseek_key'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ AI Models setup complete!\n'))
        self.list_models()

    def setup_llama(self):
        """Set up LLaMA model (via Ollama)"""
        self.stdout.write('Setting up LLaMA...')
        
        llama_config, created = AIModelConfig.objects.update_or_create(
            name='llama',
            defaults={
                'display_name': 'LLaMA 2 (Local)',
                'description': 'Open-source LLaMA model running locally via Ollama',
                'api_endpoint': 'http://localhost:11434/api/chat',
                'api_key': '',  # No API key needed for local Ollama
                'max_tokens': 2000,
                'temperature': 0.7,
                'supports_english': True,
                'supports_arabic': True,
                'is_active': True,
                'priority': 3
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('  ✓ Created LLaMA configuration'))
        else:
            self.stdout.write(self.style.WARNING('  ↻ Updated existing LLaMA configuration'))
        
        self.stdout.write(self.style.NOTICE('  ℹ Make sure Ollama is running: ollama serve'))
        self.stdout.write(self.style.NOTICE('  ℹ Pull model: ollama pull llama2\n'))

    def setup_grok(self, api_key=None):
        """Set up Grok model (X.AI)"""
        self.stdout.write('Setting up Grok...')
        
        if not api_key:
            self.stdout.write(self.style.WARNING('  ⚠ No API key provided for Grok'))
            self.stdout.write(self.style.NOTICE('  ℹ Get API key from: https://x.ai'))
            self.stdout.write(self.style.NOTICE('  ℹ Run: python manage.py setup_ai_models --model grok --grok-key YOUR_KEY\n'))
            return
        
        grok_config, created = AIModelConfig.objects.update_or_create(
            name='grok',
            defaults={
                'display_name': 'Grok',
                'description': 'X.AI Grok model - Advanced AI by xAI',
                'api_endpoint': 'https://api.x.ai/v1/chat/completions',
                'api_key': api_key,
                'max_tokens': 2000,
                'temperature': 0.7,
                'supports_english': True,
                'supports_arabic': True,
                'is_active': True,
                'priority': 2
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('  ✓ Created Grok configuration'))
        else:
            self.stdout.write(self.style.WARNING('  ↻ Updated existing Grok configuration'))
        
        self.stdout.write(self.style.SUCCESS('  ✓ Grok is ready to use\n'))

    def setup_deepseek(self, api_key=None):
        """Set up DeepSeek model"""
        self.stdout.write('Setting up DeepSeek...')
        
        if not api_key:
            self.stdout.write(self.style.WARNING('  ⚠ No API key provided for DeepSeek'))
            self.stdout.write(self.style.NOTICE('  ℹ Get API key from: https://platform.deepseek.com'))
            self.stdout.write(self.style.NOTICE('  ℹ Run: python manage.py setup_ai_models --model deepseek --deepseek-key YOUR_KEY\n'))
            return
        
        deepseek_config, created = AIModelConfig.objects.update_or_create(
            name='deepseek',
            defaults={
                'display_name': 'DeepSeek',
                'description': 'DeepSeek AI model - Powerful and efficient',
                'api_endpoint': 'https://api.deepseek.com/v1/chat/completions',
                'api_key': api_key,
                'max_tokens': 2000,
                'temperature': 0.7,
                'supports_english': True,
                'supports_arabic': True,
                'is_active': True,
                'priority': 1
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('  ✓ Created DeepSeek configuration'))
        else:
            self.stdout.write(self.style.WARNING('  ↻ Updated existing DeepSeek configuration'))
        
        self.stdout.write(self.style.SUCCESS('  ✓ DeepSeek is ready to use\n'))

    def list_models(self):
        """List all configured models"""
        self.stdout.write(self.style.SUCCESS('📋 Configured AI Models:\n'))
        
        models = AIModelConfig.objects.all().order_by('-priority')
        
        if not models:
            self.stdout.write(self.style.WARNING('  No models configured yet.'))
            return
        
        for model in models:
            status = '✓ Active' if model.is_active else '✗ Inactive'
            langs = []
            if model.supports_english:
                langs.append('EN')
            if model.supports_arabic:
                langs.append('AR')
            
            self.stdout.write(
                f"  {status} | Priority {model.priority} | "
                f"{model.display_name} ({', '.join(langs)})"
            )
        
        self.stdout.write('')
