from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
# pyrefly: ignore [missing-import]
from .models import Category, Product
# pyrefly: ignore [missing-import]
from .serializers import CategorySerializer, ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('order')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'category__name']
    filterset_fields = ['is_featured', 'is_bestseller', 'is_seasonal', 'is_recommended', 'category']

    def get_queryset(self):
        # Admin can see all, customers only see active
        if self.request.user.is_authenticated and self.request.user.role == 'ADMIN':
            return Product.objects.all().order_by('-created_at')
        return Product.objects.filter(is_active=True).order_by('-created_at')
