from rest_framework import serializers
from .models import Customer, Product, Order, OrderDetails, Inventory, Supplier, Payment

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    stock = serializers.ReadOnlyField(source='inventory.stock')

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        # Return an empty list if reviews is None
        return obj.reviews if obj.reviews is not None else []    

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.name')
    products = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_products(self, obj):
        order_details = OrderDetails.objects.filter(order=obj)
        return [
            {
                "product_name": detail.product.name,
                "quantity": detail.product_quantity,
            }
            for detail in order_details
        ]

class OrderDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetails
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
