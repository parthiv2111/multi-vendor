from rest_framework import serializers
from .models import Vendor
from accounts.serializers import UserSerializer

class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Vendor
        fields = '__all__'
        read_only_fields = ('user', 'rating', 'is_verified')
