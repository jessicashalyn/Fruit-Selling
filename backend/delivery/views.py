from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import DeliveryZone
from .serializers import DeliveryZoneSerializer

class DeliveryZoneViewSet(viewsets.ModelViewSet):
    queryset = DeliveryZone.objects.filter(is_active=True)
    serializer_class = DeliveryZoneSerializer
    permission_classes = [AllowAny]
