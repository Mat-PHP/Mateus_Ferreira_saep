from django.db.models import F
from rest_framework import serializers
from .models import Product, StockMovement


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "description", "price", "quantity", "created_at", "updated_at"]


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = StockMovement
        fields = ["id", "product", "product_name", "movement_type", "quantity", "note", "timestamp"]

    def create(self, validated_data):
        movement = super().create(validated_data)
        product = movement.product
        if movement.movement_type == StockMovement.MOVEMENT_IN:
            product.quantity = F("quantity") + movement.quantity
        else:
            product.quantity = F("quantity") - movement.quantity
        product.save()
        product.refresh_from_db()
        return movement
