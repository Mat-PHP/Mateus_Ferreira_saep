from django.contrib import admin
from .models import Product, StockMovement


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "quantity", "updated_at")
    search_fields = ("name", "description")


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "movement_type", "quantity", "timestamp")
    list_filter = ("movement_type",)
    search_fields = ("product__name", "note")
