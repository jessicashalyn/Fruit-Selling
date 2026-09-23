from rest_framework import serializers
from .models import User, CustomerProfile, Address, DeliveryPartner

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'mobile_number', 'email', 'role']
        read_only_fields = ['role']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['user']

class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    addresses = AddressSerializer(many=True, read_only=True, source='user.addresses')

    class Meta:
        model = CustomerProfile
        fields = '__all__'

class DeliveryPartnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DeliveryPartner
        fields = '__all__'
