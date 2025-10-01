#!/usr/bin/env python
"""
Script to create a superuser programmatically
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Superuser credentials
username = 'superuser'
email = 'superuser@gmail.com'
password = 'nesrine@123'

# Check if superuser already exists
if User.objects.filter(username=username).exists():
    print(f"Superuser '{username}' already exists!")
else:
    # Create superuser
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"Superuser '{username}' created successfully!")
    print(f"Email: {email}")
    print(f"You can now login to the admin panel at http://localhost:8000/admin")
