from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .models import (
    Customer, Product, Supplier, Inventory, Payment, Order, OrderDetails
)
import json
from django.core.mail import send_mail
from django.db import transaction, IntegrityError
from django.core.exceptions import ObjectDoesNotExist

# Helper function to get cart from session
def get_cart(session):
    return session.get('cart', {})

# Helper function to save cart to session
def save_cart(session, cart):
    session['cart'] = cart
    session.modified = True

# Product Management
class ProductManagementView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):  # Create Product
        try:
            data = json.loads(request.body)
            supplier = get_object_or_404(Supplier, pk=data['supplier_id'])
            inventory = Inventory.objects.create(stock=data['stock'])
            product = Product.objects.create(
                name=data['name'],
                price=data['price'],
                description=data['description'],
                category=data['category'],
                supplier=supplier,
                inventory=inventory,
            )
            return JsonResponse({"message": "Product created", "product_id": product.product_id})
        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def get(self, request):  # Read Products
        try:
            products = Product.objects.all()
            product_list = [
                {
                    "id": product.product_id,
                    "name": product.name,
                    "price": float(product.price),
                    "description": product.description,
                    "category": product.category,
                    "supplier": product.supplier.name,
                    "stock": product.inventory.stock,
                }
                for product in products
            ]
            return JsonResponse({"products": product_list})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @method_decorator(csrf_exempt)
    def put(self, request):  # Update Product
        try:
            data = json.loads(request.body)
            product = get_object_or_404(Product, pk=data['product_id'])
            product.name = data['name']
            product.price = data['price']
            product.description = data['description']
            product.category = data['category']
            product.supplier = get_object_or_404(Supplier, pk=data['supplier_id'])
            product.inventory.stock = data['stock']
            product.inventory.save()
            product.save()
            return JsonResponse({"message": "Product updated"})
        except ObjectDoesNotExist as e:
            return JsonResponse({"error": str(e)}, status=404)
        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @method_decorator(csrf_exempt)
    def delete(self, request):  # Delete Product
        try:
            data = json.loads(request.body)
            product = get_object_or_404(Product, pk=data['product_id'])
            product.inventory.delete()
            product.delete()
            return JsonResponse({"message": "Product deleted"})
        except ObjectDoesNotExist as e:
            return JsonResponse({"error": str(e)}, status=404)
        except KeyError:
            return JsonResponse({"error": "Product ID is required"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Order Management
class OrderManagementView(View):
    def get(self, request):  # Track Orders
        try:
            orders = Order.objects.all()
            order_list = [
                {
                    "order_id": order.order_id,
                    "customer": order.customer.name,
                    "status": order.order_status,
                    "amount": float(order.order_amount),
                    "date": order.order_date,
                    "products": [
                        {
                            "name": detail.product.name,
                            "quantity": detail.product_quantity,
                        }
                        for detail in OrderDetails.objects.filter(order=order)
                    ],
                }
                for order in orders
            ]
            return JsonResponse({"orders": order_list})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @method_decorator(csrf_exempt)
    def post(self, request):  # Process Orders
        try:
            data = json.loads(request.body)
            order = get_object_or_404(Order, pk=data['order_id'])
            order.order_status = data['status']
            order.save()
            return JsonResponse({"message": "Order status updated", "status": order.order_status})
        except ObjectDoesNotExist as e:
            return JsonResponse({"error": str(e)}, status=404)
        except KeyError:
            return JsonResponse({"error": "Order ID and status are required"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Cart Management
class CartView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):  # Add to Cart
        try:
            session = request.session
            cart = get_cart(session)
            data = json.loads(request.body)
            product_id = data['product_id']
            quantity = data.get('quantity', 1)
            cart[product_id] = cart.get(product_id, 0) + quantity
            save_cart(session, cart)
            return JsonResponse({"message": "Product added to cart", "cart": cart})
        except KeyError:
            return JsonResponse({"error": "Product ID is required"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def get(self, request):  # View Cart
        try:
            cart = get_cart(request.session)
            return JsonResponse({"cart": cart})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Order Placement
class OrderPlacementView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            session = request.session
            cart = get_cart(session)
            if not cart:
                return JsonResponse({"error": "Cart is empty"}, status=400)
            customer_id = request.POST.get('customer_id')
            if not customer_id:
                return JsonResponse({"error": "Customer ID is required"}, status=400)

            customer = get_object_or_404(Customer, pk=customer_id)
            total_amount = 0
            with transaction.atomic():
                order = Order.objects.create(customer=customer, order_status="Pending", shipping_address=customer.shipping_address)
                for product_id, quantity in cart.items():
                    product = get_object_or_404(Product, pk=product_id)
                    if product.inventory.stock < quantity:
                        raise ValueError(f"Insufficient stock for product: {product.name}")
                    total_amount += product.price * quantity
                    OrderDetails.objects.create(order=order, product=product, product_quantity=quantity)
                    # Deduct from inventory
                    product.inventory.stock -= quantity
                    product.inventory.save()
                order.order_amount = total_amount
                order.save()
            save_cart(session, {})  # Clear the cart
            return JsonResponse({"message": "Order placed", "order_id": order.order_id})
        except ObjectDoesNotExist as e:
            return JsonResponse({"error": str(e)}, status=404)
        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Payment Processing (Mock-up)
class PaymentProcessingView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            data = json.loads(request.body)
            if 'payment_method' not in data:
                return JsonResponse({"error": "Payment method is required"}, status=400)
            payment = Payment.objects.create(
                payment_method=data['payment_method'],
                transaction_id=f"MOCK_TXN_{Payment.objects.count() + 1}"
            )
            return JsonResponse({"message": "Payment processed", "transaction_id": payment.transaction_id})
        except KeyError:
            return JsonResponse({"error": "Payment method is required"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Inventory Management
class InventoryManagementView(View):
    def get(self, request):  # View Inventory
        try:
            inventory_items = Inventory.objects.all()
            inventory_list = [
                {
                    "id": item.inventory_id,
                    "stock": item.stock,
                }
                for item in inventory_items
            ]
            return JsonResponse({"inventory": inventory_list})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @method_decorator(csrf_exempt)
    def post(self, request):  # Notify Low Stock
        try:
            inventory_items = Inventory.objects.filter(stock__lt=10)
            low_stock_list = [
                {
                    "id": item.inventory_id,
                    "stock": item.stock,
                }
                for item in inventory_items
            ]
            return JsonResponse({"low_stock_items": low_stock_list})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# Email Notifications
class EmailNotificationView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        data = json.loads(request.body)
        subject = data['subject']
        message = data['message']
        recipient_list = data['recipients']
        send_mail(
            subject,
            message,
            'no-reply@ecommerce.com',  # Replace with actual sender email
            recipient_list
        )
        return JsonResponse({"message": "Emails sent successfully"})
