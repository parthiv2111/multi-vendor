from rest_framework import serializers
from .models import Category, SubCategory, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "title",
            "slug",
        )


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = (
            "id",
            "category",
            "title",
            "slug",
        )


class ProductSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source="category", read_only=True)
    sub_category_detail = SubCategorySerializer(
        source="sub_category", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "category",
            "category_detail",
            "sub_category",
            "sub_category_detail",
            "vendor",
            "title",
            "slug",
            "description",
            "price",
            "rating",
            "discount",
            "stock",
            "image",
            "active",
        )
        read_only_fields = ("vendor", "active")
