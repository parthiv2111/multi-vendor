from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Count, Q
from datetime import timedelta
from django.utils import timezone
from .models import Vendor
from .serializers import VendorSerializer
from .permissions import IsOwnerOrReadOnly, IsVendor
from orders.models import Order, OrderItem
from products.models import Product


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    lookup_field = 'store_name'

    def perform_create(self, serializer):
        # Check if user already has a vendor profile
        if hasattr(self.request.user, 'vendor_profile'):
            raise serializers.ValidationError(
                "User already has a vendor profile.")
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            vendor = request.user.vendor_profile
            serializer = self.get_serializer(vendor)
            return Response(serializer.data)
        except Vendor.DoesNotExist:
            return Response({"detail": "No vendor profile found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def analytics(self, request):
        """Get analytics data for the vendor's products"""
        try:
            vendor = request.user.vendor_profile
        except Vendor.DoesNotExist:
            return Response({"detail": "No vendor profile found."}, status=status.HTTP_404_NOT_FOUND)

        # Get vendor's products
        products = vendor.products.all()

        # Get all orders containing vendor's products
        order_items = OrderItem.objects.filter(product__in=products)
        orders = Order.objects.filter(items__product__in=products).distinct()

        # Calculate metrics
        total_revenue = order_items.aggregate(total=Sum('price'))['total'] or 0
        total_orders = orders.count()
        total_items_sold = order_items.aggregate(
            total=Sum('quantity'))['total'] or 0

        # Get top products
        top_products = order_items.values('product__id', 'product__title').annotate(
            quantity_sold=Sum('quantity'),
            revenue=Sum('price')
        ).order_by('-quantity_sold')[:5]

        # Get revenue by day (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_revenue = []
        for i in range(30):
            date = (timezone.now() - timedelta(days=30-i)).date()
            revenue = OrderItem.objects.filter(
                product__in=products,
                order__created_at__date=date
            ).aggregate(total=Sum('price'))['total'] or 0
            daily_revenue.append(
                {'date': date.isoformat(), 'revenue': float(revenue)})

        return Response({
            'total_revenue': float(total_revenue),
            'total_orders': total_orders,
            'total_items_sold': total_items_sold,
            'top_products': list(top_products),
            'daily_revenue': daily_revenue,
        })
