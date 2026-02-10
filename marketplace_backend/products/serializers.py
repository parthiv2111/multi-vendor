from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "title",
            "slug",
        )

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "vendor",
            "title",
            "slug",
            "description",
            "price",
            "stock",
            "image",
            "active",
        )
        read_only_fields = ("vendor", "active")
