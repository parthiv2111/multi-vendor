from decimal import Decimal
import random

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from accounts.models import User
from vendors.models import Vendor
from products.models import Category, SubCategory, Product


class Command(BaseCommand):
    help = "Seed the database with dummy categories, subcategories, vendors, and products"

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=100,
            help="Number of products to create (default: 100)",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear dummy data created by this command before seeding",
        )
        parser.add_argument(
            "--clear-all",
            action="store_true",
            help="Clear ALL products/categories/subcategories before seeding",
        )

    def handle(self, *args, **options):
        count = options["count"]
        should_clear = options["clear"]
        clear_all = options["clear_all"]

        random.seed(42)

        if clear_all:
            self._clear_all_products()
        elif should_clear:
            self._clear_dummy_data()

        categories = self._ensure_categories_and_subcategories()
        vendors = self._ensure_vendors()

        # Distribute products evenly across vendors
        products_per_vendor = count // len(vendors)
        remaining_products = count % len(vendors)

        created = 0
        product_index = 1
        for vendor_idx, vendor in enumerate(vendors):
            # Distribute remaining products to first vendors
            if vendor_idx < remaining_products:
                vendor_product_count = products_per_vendor + 1
            else:
                vendor_product_count = products_per_vendor

            for _ in range(vendor_product_count):
                category = random.choice(categories)
                subcategories = list(category.subcategories.all())
                sub_category = random.choice(
                    subcategories) if subcategories else None

                title_seed = random.choice([
                    "Nova",
                    "Pulse",
                    "Vertex",
                    "Lumen",
                    "Astra",
                    "Orbit",
                    "Solace",
                    "Flux",
                ])
                name_seed = random.choice([
                    "Smart Speaker",
                    "Wireless Headset",
                    "Travel Backpack",
                    "Fitness Tracker",
                    "Desk Lamp",
                    "Gaming Mouse",
                    "Bluetooth Keyboard",
                    "Noise Cancelling Earbuds",
                    "Coffee Grinder",
                    "Yoga Mat",
                ])
                title = f"{title_seed} {name_seed} {product_index}"
                slug = f"{slugify(title)}-{product_index}"
                product_index += 1

                price_value = Decimal(str(random.randint(25, 700))) + Decimal(
                    f"0.{random.randint(0, 99):02d}"
                )
                discount_value = Decimal(
                    str(random.choice([0, 5, 10, 15, 20, 25, 30])))
                rating_value = Decimal(
                    str(random.randint(32, 50))) / Decimal("10")

                product, was_created = Product.objects.get_or_create(
                    slug=slug,
                    defaults={
                        "category": category,
                        "sub_category": sub_category,
                        "vendor": vendor,
                        "title": title,
                        "description": (
                            f"{name_seed} built for modern shoppers. "
                            "Demo listing for multi-vendor marketplace."
                        ),
                        "price": price_value,
                        "rating": rating_value,
                        "discount": discount_value,
                        "stock": random.randint(0, 150),
                        "active": True,
                    },
                )

                if was_created:
                    created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete. Created {created} products (requested {count})."
            )
        )

    def _ensure_categories_and_subcategories(self):
        catalog = {
            "Electronics": ["Audio", "Wearables", "Accessories"],
            "Home": ["Kitchen", "Lighting", "Decor"],
            "Fashion": ["Bags", "Footwear", "Essentials"],
            "Fitness": ["Training", "Recovery", "Outdoor"],
            "Gadgets": ["Smart Home", "Office", "Mobile"],
        }
        categories = []
        for index, (title, subs) in enumerate(catalog.items(), start=1):
            slug = slugify(title)
            category, _ = Category.objects.get_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "ordering": index,
                },
            )
            categories.append(category)

            for sub_index, sub_title in enumerate(subs, start=1):
                sub_slug = slugify(f"{title}-{sub_title}")
                SubCategory.objects.get_or_create(
                    slug=sub_slug,
                    defaults={
                        "category": category,
                        "title": sub_title,
                        "ordering": sub_index,
                    },
                )
        return categories

    def _ensure_vendors(self):
        vendor_configs = [
            {
                "email": "seller12@yopmail.com",
                "username": "seller12",
                "store_name": "Seller 12 Store",
            },
            {
                "email": "seller13@yopmail.com",
                "username": "seller13",
                "store_name": "Seller 13 Store",
            },
            {
                "email": "seller14@yopmail.com",
                "username": "seller14",
                "store_name": "Seller 14 Store",
            },
        ]
        vendors = []
        for config in vendor_configs:
            user, _ = User.objects.get_or_create(
                email=config["email"],
                defaults={
                    "username": config["username"],
                    "role": User.Role.SELLER,
                    "is_verified": True,
                },
            )
            if not user.has_usable_password():
                user.set_password("Passw0rd!")
                user.save(update_fields=["password"])

            vendor, _ = Vendor.objects.update_or_create(
                user_id=user.id,
                defaults={
                    "user": user,
                    "store_name": config["store_name"],
                    "description": f"{config['store_name']} demo vendor.",
                    "is_verified": True,
                    "rating": Decimal("4.65"),
                },
            )
            vendors.append(vendor)
        return vendors

    def _clear_dummy_data(self):
        Product.objects.filter(slug__startswith="demo-").delete()
        Product.objects.filter(title__startswith="Demo ").delete()
        Vendor.objects.filter(store_name__in=[
            "Seller 12 Store", "Seller 13 Store", "Seller 14 Store"
        ]).delete()
        Vendor.objects.filter(user__email__in=[
            "seller12@yopmail.com", "seller13@yopmail.com", "seller14@yopmail.com"
        ]).delete()
        User.objects.filter(email__in=[
            "seller12@yopmail.com", "seller13@yopmail.com", "seller14@yopmail.com"
        ]).delete()

    def _clear_all_products(self):
        Product.objects.all().delete()
        SubCategory.objects.all().delete()
        Category.objects.all().delete()
        Vendor.objects.filter(store_name__in=[
            "Seller 12 Store", "Seller 13 Store", "Seller 14 Store"
        ]).delete()
        Vendor.objects.filter(user__email__in=[
            "seller12@yopmail.com", "seller13@yopmail.com", "seller14@yopmail.com"
        ]).delete()
        User.objects.filter(email__in=[
            "seller12@yopmail.com", "seller13@yopmail.com", "seller14@yopmail.com"
        ]).delete()
