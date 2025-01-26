from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.response import Response
from rest_framework import status

  # Import the Response class

from .serializers import ProductSerializer
from .models import (
    Customer, Product, Supplier, Inventory, Payment, Order, OrderDetails
)
import json
from django.core.mail import send_mail
from django.db import transaction, IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

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
            inventory = Inventory.objects.create(stock=data['inventory_id'])
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
        

    def get(self, request, product_id=None):
        """
        Retrieve a single product (if product_id is provided) 
        or list all products (if no product_id is provided).
        """
        try:
            if product_id:
                # Retrieve a single product
                product = Product.objects.get(pk=product_id)
                serializer = ProductSerializer(product)
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)
            else:
                # Retrieve all products
                products = Product.objects.all()
                serializer = ProductSerializer(products, many=True)
                return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        

class OrderListView(View):
    def get(self, request, order_id=None):  # Track Orders
        try:
            if order_id:  # Fetch a specific order by ID
                try:
                    order = Order.objects.get(order_id=order_id)
                    order_data = {
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
                    return JsonResponse(order_data, safe=False)
                except Order.DoesNotExist:
                    return JsonResponse({"error": "Order not found"}, status=404)
            else:  # Fetch all orders
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
                return JsonResponse({"orders": order_list}, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)        

# Order Management
class OrderManagementView(View):
    
    #@method_decorator(csrf_exempt)  # Consider removing csrf_exempt in production if using DRF
    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            # Parse the request body to get order data
            data = json.loads(request.body)

            # Validate required fields
            if 'customer_id' not in data or 'products' not in data or 'amount' not in data or 'payment_method' not in data:
                return JsonResponse({"error": "Customer ID, products, amount, and payment method are required"}, status=400)

            # Validate customer
            try:
                customer = Customer.objects.get(pk=data['customer_id'])
            except Customer.DoesNotExist:
                return JsonResponse({"error": "Customer not found"}, status=404)

                # Determine the shipping address
            shipping_address = data.get('shipping_address', customer.shipping_address)

            # Create a payment entry
            payment = Payment.objects.create(
                payment_method=data['payment_method'],
                transaction_id=f"TXN_{Payment.objects.count() + 1}"
            )

            # Create the order
            order = Order.objects.create(
                customer=customer,
                order_status="Confirmed",  # Default status, can be customized
                order_amount=data['amount'],
                order_date=data.get('order_date', None),  # Optional field
                payment=payment,
                shipping_address=shipping_address
            )

            # Handle order details (products in the order)
            for item in data['products']:
                try:
                    product = Product.objects.get(pk=item['product_id'])

                    # Check if the product is in stock
                    if product.inventory.stock < item['quantity']:
                        return JsonResponse({"error": f"Insufficient stock for product {product.name}"}, status=400)

                    # Deduct the stock
                    product.inventory.stock -= item['quantity']
                    product.inventory.save()

                    # Create the order details
                    OrderDetails.objects.create(
                        order=order,
                        product=product,
                        product_quantity=item['quantity'],
                    )
                except Product.DoesNotExist:
                    return JsonResponse({"error": f"Product with ID {item['product_id']} not found"}, status=404)

            return JsonResponse({
                "message": "Order created successfully",
                "order_id": order.order_id,
                "status": order.order_status,
                "amount": order.order_amount,
                "transaction_id": payment.transaction_id
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)
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
