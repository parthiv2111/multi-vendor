from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from products.models import Product
from products.serializers import ProductSerializer

class ComparisonView(APIView):
    def post(self, request):
        product_ids = request.data.get('product_ids', [])
        if not product_ids:
            return Response({"error": "No product_ids provided"}, status=status.HTTP_400_BAD_REQUEST)

        products = Product.objects.filter(id__in=product_ids)
        if not products.exists():
             return Response({"error": "Products not found"}, status=status.HTTP_404_NOT_FOUND)

        # Mock Comparison Logic - Dynamic Attribute Extraction
        comparison_data = {
            "attributes": ["Price", "Stock", "Vendor", "Category"],
            "products": []
        }

        for p in products:
            comparison_data["products"].append({
                "id": p.id,
                "title": p.title,
                "image": p.image.url if p.image else None,
                "values": [
                    str(p.price),
                    str(p.stock),
                    p.vendor.store_name,
                    p.category.title
                ]
            })

        return Response(comparison_data)

class RecommendationView(APIView):
    def post(self, request):
        # Mock Semantic Search
        query = request.data.get('query', '')
        # Simple keyword match for now
        products = Product.objects.filter(title__icontains=query) if query else Product.objects.all()[:5]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
