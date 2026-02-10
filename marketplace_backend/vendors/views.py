from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Vendor
from .serializers import VendorSerializer
from .permissions import IsOwnerOrReadOnly, IsVendor

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    lookup_field = 'store_name'

    def perform_create(self, serializer):
        # Check if user already has a vendor profile
        if hasattr(self.request.user, 'vendor_profile'):
             raise serializers.ValidationError("User already has a vendor profile.")
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            vendor = request.user.vendor_profile
            serializer = self.get_serializer(vendor)
            return Response(serializer.data)
        except Vendor.DoesNotExist:
            return Response({"detail": "No vendor profile found."}, status=status.HTTP_404_NOT_FOUND)
