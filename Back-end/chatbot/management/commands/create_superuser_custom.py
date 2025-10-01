"""
Management command to create a superuser with specific credentials
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Create a superuser with predefined credentials'

    def handle(self, *args, **options):
        User = get_user_model()
        
        username = 'superuser'
        email = 'superuser@gmail.com'
        password = 'nesrine@123'
        
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'❌ User "{username}" already exists!')
            )
            user = User.objects.get(username=username)
            self.stdout.write(f'   Email: {user.email}')
            self.stdout.write(f'   Is superuser: {user.is_superuser}')
            self.stdout.write(f'   Is staff: {user.is_staff}')
        else:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f'✅ Superuser "{username}" created successfully!')
            )
            self.stdout.write(f'   Username: {username}')
            self.stdout.write(f'   Email: {email}')
            self.stdout.write(f'   Password: {password}')
            self.stdout.write(f'   Is superuser: {user.is_superuser}')
            self.stdout.write(f'   Is staff: {user.is_staff}')
            self.stdout.write('')
            self.stdout.write(
                self.style.SUCCESS('You can now login to Django Admin at:')
            )
            self.stdout.write('   http://localhost:8000/admin/')
