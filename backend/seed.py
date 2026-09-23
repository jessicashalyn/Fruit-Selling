import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Category, Product

# Clear existing
Category.objects.all().delete()
Product.objects.all().delete()

# Create Categories
c1 = Category.objects.create(name='Fresh Fruits', description='Daily fresh fruits', order=1)
c2 = Category.objects.create(name='Exotic Fruits', description='Imported exotics', order=2)
c3 = Category.objects.create(name='Seasonal Fruits', description='Best of the season', order=3)
c4 = Category.objects.create(name='Combos', description='Fruit baskets and combos', order=4)

# Create Products
Product.objects.create(category=c1, name='Kashmir Apples', description='Sweet and crunchy', original_price=120, stock=50, unit='1kg', is_featured=True)
Product.objects.create(category=c1, name='Organic Bananas', description='Fresh yellow bananas', original_price=60, stock=100, unit='1dozen', is_featured=True)
Product.objects.create(category=c2, name='Dragon Fruit', description='Pink exotic dragon fruit', original_price=250, stock=20, unit='1pc', is_featured=True)
Product.objects.create(category=c3, name='Alphonso Mango', description='King of fruits', original_price=400, stock=30, unit='1kg')

print("Database seeded with Categories and Products.")
