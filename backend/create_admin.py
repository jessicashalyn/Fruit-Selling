import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

mobile = '1234567890'
password = 'admin'

if not User.objects.filter(mobile_number=mobile).exists():
    user = User.objects.create_superuser(mobile_number=mobile, password=password)
    user.role = 'ADMIN'
    user.save()
    print("Admin user created successfully!")
else:
    print("Admin user already exists!")
