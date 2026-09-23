
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# pyrefly: ignore [missing-import]
from .models import User, CustomerProfile, Address, DeliveryPartner
# pyrefly: ignore [missing-import]
from .serializers import UserSerializer, CustomerProfileSerializer, AddressSerializer, DeliveryPartnerSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CustomerProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DeliveryPartnerViewSet(viewsets.ModelViewSet):
    queryset = DeliveryPartner.objects.all()
    serializer_class = DeliveryPartnerSerializer

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def add_partner(self, request):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            
        mobile_number = request.data.get('mobile_number')
        vehicle_number = request.data.get('vehicle_number')
        vehicle_type = request.data.get('vehicle_type')
        
        if not mobile_number or not vehicle_number or not vehicle_type:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
            
        user, created = User.objects.get_or_create(mobile_number=mobile_number)
        user.role = 'DELIVERY_PARTNER'
        user.save()
        
        partner, p_created = DeliveryPartner.objects.get_or_create(user=user, defaults={
            'vehicle_number': vehicle_number,
            'vehicle_type': vehicle_type,
            'is_approved': True
        })
        
        if not p_created:
            partner.vehicle_number = vehicle_number
            partner.vehicle_type = vehicle_type
            partner.is_approved = True
            partner.save()
            
        serializer = self.get_serializer(partner)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
