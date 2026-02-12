from django.contrib import admin

from .models import Category, SubCategory, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "ordering")
    search_fields = ("title", "slug")
    ordering = ("ordering", "title")


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "category", "ordering")
    list_filter = ("category",)
    search_fields = ("title", "slug")
    ordering = ("category", "ordering", "title")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "sub_category",
                    "vendor", "price", "rating", "discount", "active")
    list_filter = ("category", "sub_category", "vendor", "active")
    search_fields = ("title", "slug")
    ordering = ("-created_at",)
