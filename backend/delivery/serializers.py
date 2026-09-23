from rest_framework import serializers
from .models import DeliveryZone, DeliverySlot

class DeliverySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliverySlot
        fields = '__all__'

class DeliveryZoneSerializer(serializers.ModelSerializer):
    slots = DeliverySlotSerializer(many=True, read_only=True)
    
    class Meta:
        model = DeliveryZone
        fields = '__all__'
