from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.response import Response
from rest_framework import status
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMessage
from django.contrib.auth.decorators import user_passes_test
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.db.models import Q, F

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
class ProductListView(View):
 
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
        

class productFilterAPI(View):
    def get(self, request, *args, **kwargs):
        """API to fetch and filter products based on various parameters."""
        
        # Get query parameters
        search_query = request.GET.get('search', '')
        selected_sort_by = request.GET.get('selectedSortBy', '')
        include_out_of_stock = request.GET.get('includeOutOfStock', 'false').lower() == 'true'
        category = request.GET.getlist('category', [])  # Can have multiple values
        customer_ratings = request.GET.get('customerRatings', None)
        min_price = request.GET.get('min_price', None)
        max_price = request.GET.get('max_price', None)

        # Get all products
        products = Product.objects.all()

        # Apply search filter (product name or description)
        if search_query:
            products = products.filter(Q(subcategory__icontains=search_query) | Q(description__icontains=search_query))

        # Apply category filter
        if category:
            products = products.filter(category__in=category)

        # Apply price range filter
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)

        # Apply customer rating filter
        if customer_ratings:
            products = products.filter(rating__gte=float(customer_ratings))

        # Exclude out-of-stock items if includeOutOfStock is False
        if not include_out_of_stock:
            products = products.filter(inventory__stock__gt=0)

        # Sorting logic
        if selected_sort_by == "Price: Low to High":
            products = products.order_by(F("price").asc(nulls_last=True))
        elif selected_sort_by == "Price: High to Low":
            products = products.order_by(F("price").desc(nulls_last=True))

        sorted_products = list(products)

        print("Final Sorted Products:", sorted_products)

        print("SQL Query:", str(products.query))
        serializer = ProductSerializer(products, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

class ProductUpdateView(View):
    def put(self, request, product_id):
        try:
            # Parse the request body
            data = json.loads(request.body)

            # Validate the product
            try:
                product = Product.objects.get(pk=product_id)
            except Product.DoesNotExist:
                return JsonResponse({"error": f"Product with ID {product_id} not found"}, status=404)

            # Update fields if they are present in the request
            if 'name' in data:
                product.name = data['name']
            if 'category' in data:
                product.category = data['category']
            if 'price' in data:
                product.price = data['price']
            if 'description' in data:
                product.description = data['description']
            if 'image_path' in data:
                product.image_path = data['image_path']
                # Automatically update image count
                product.image_count = len(data['image_path'])

            # Handle inventory updates if included
            if 'stock' in data:
                if not hasattr(product, 'inventory'):
                    # Create new inventory if it doesn't exist
                    product.inventory = Inventory.objects.create(stock=data['stock'])
                else:
                    product.inventory.stock = data['stock']
                product.inventory.save()

            if 'rating' in data:
                product.ratings = data['rating']
            if 'reviews' in data:
                product.reviews = data['reviews'] if isinstance(data['reviews'], list) else []
            # Save the product
            product.save()

            return JsonResponse({"message": "Product updated successfully"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


class FilteredProductListView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)

            # Extract filters from request body
            selected_sort_by = data.get("selectedSortBy", None)
            include_out_of_stock = data.get("includeOutOfStock", True)  # Default: Show all products
            categories = data.get("category", [])
            customer_ratings = data.get("customerRatings", None)
            price_range = data.get("price_range", None)
            search_query = data.get("search", "").strip()

            # Start with all products
            products = Product.objects.all()

            # Apply Category Filter
            if categories:
                products = products.filter(category__in=categories)
                print(products)
            # Apply Stock Filter
            if not include_out_of_stock:
                products = products.filter(inventory__stock__gt=0)  # Exclude out-of-stock products
                print(products)
            # Apply Customer Ratings (Assuming ratings exist in Product model)
            if customer_ratings:
                products = products.filter(rating__gte=int(customer_ratings))  # Rating >= given value
                print(products)
            # Apply Price Range Filter
            if price_range and len(price_range) == 2:
                min_price, max_price = price_range
                products = products.filter(price__gte=min_price, price__lte=max_price)
                print(products)
            # Apply Search Filter
            if search_query:
                products = products.filter(
                    Q(name__icontains=search_query) | Q(description__icontains=search_query) | Q(subcategory__icontains=search_query) | Q(category__icontains=search_query)
                )
                print(products)
            # Apply Sorting
            if selected_sort_by:
                if selected_sort_by == "Price: Low to High":
                    products = products.order_by("price")
                elif selected_sort_by == "Price: High to Low":
                    products = products.order_by("-price")
                elif selected_sort_by == "Newest First":
                    products = products.order_by("-id")  # Assuming newest products have higher IDs
                elif selected_sort_by == "Rating: High to Low":
                    products = products.order_by("-rating") 
            # Serialize Response
            product_list = [
                {
                    "product_id": product.product_id,
                    "name": product.name,
                    "price": product.price,
                    "category": product.category,
                    "stock": product.inventory.stock if product.inventory else 0,
                    "rating": getattr(product, "rating", "N/A"),  # Assuming rating field exists
                    "image": product.image_path[0] if product.image_path else None
                }
                for product in products
            ]

            return JsonResponse({"products": product_list}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)



class ProductInsertView(View):
    def post(self, request):
        """
        Handles adding a new product to the database.
        Expects a JSON payload with product details.
        """
        try:
            # Parse the request body
            data = json.loads(request.body)

            # Validate required fields
            required_fields = ['name', 'category', 'supplier_id', 'price', 'description']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            # Check if the supplier exists
            try:
                supplier = Supplier.objects.get(pk=data['supplier_id'])
            except Supplier.DoesNotExist:
                return JsonResponse({"error": f"Supplier with ID {data['supplier_id']} not found"}, status=404)

            # Handle inventory: create one if not provided or does not exist
            if 'inventory_id' in data:
                try:
                    inventory = Inventory.objects.get(pk=data['inventory_id'])
                except Inventory.DoesNotExist:
                    return JsonResponse({"error": f"Inventory with ID {data['inventory_id']} not found"}, status=404)
            else:
                # Create a new inventory record with the provided stock or default to 0
                stock = data.get('stock', 0)
                inventory = Inventory.objects.create(stock=stock)

            # Create the product
            product = Product.objects.create(
                name=data['name'],
                category=data['category'],
                supplier=supplier,
                inventory=inventory,
                price=data['price'],
                description=data['description'],
                image_path=data.get('image_path', [])  # Optional field
            
            )

            return JsonResponse({
                "message": "Product created successfully",
                "product_id": product.product_id,
                "product_name": product.name,
                "image_count": product.image_count  
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        

@method_decorator(csrf_exempt, name='dispatch')
class ProductDeleteView(View):
    def delete(self, request, product_id):
        try:
            # Retrieve the product instance
            product = get_object_or_404(Product, pk=product_id)

            # Delete associated inventory
            if product.inventory:
                product.inventory.delete()

            # Delete the product
            product.delete()

            return JsonResponse({"message": "Product deleted successfully"}, status=200)

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

    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            data = json.loads(request.body)

            # Validate required fields
            if 'customer_id' not in data or 'products' not in data or 'amount' not in data or 'payment_method' not in data:
                return JsonResponse({"error": "Customer ID, products, amount, and payment method are required"}, status=400)

            # Validate customer
            try:
                customer = Customer.objects.get(pk=data['customer_id'])
            except Customer.DoesNotExist:
                return JsonResponse({"error": "Customer not found"}, status=404)

            shipping_address = data.get('shipping_address', customer.shipping_address)

            # Begin a database transaction
            with transaction.atomic():
                # Create a payment entry
                payment = Payment.objects.create(
                    payment_method=data['payment_method'],
                    transaction_id=f"TXN_{Payment.objects.count() + 1}"
                )

                # Create the order
                order = Order.objects.create(
                    customer=customer,
                    order_status="Confirmed",
                    order_amount=data['amount'],
                    order_date=data.get('order_date', None),
                    payment=payment,
                    shipping_address=shipping_address,
                    email_id=data['email_id'],
                    customer_name=data['customer_name']
                )
                
               

                purchased_products = []
                # Handle order details (products in the order)
                for item in data['products']:
                    try:
                        
                        # Ensure product selection happens inside the transaction
                        product = Product.objects.select_for_update().get(pk=item['product_id'])

                        print(f"Before update: {product.name} stock = {product.inventory.stock}")

                        # Check stock availability
                        if product.inventory.stock < item['quantity']:
                            return JsonResponse({"error": f"Insufficient stock for product {product.name}"}, status=400)

                        # Deduct stock
                        product.inventory.stock -= item['quantity']
                        product.inventory.save(update_fields=['stock'])

                        print(f"After update: {product.name} stock = {product.inventory.stock}")

                        # Send low stock alert if necessary
                        if product.inventory.stock < 5:
                            sendLowStockEmail(product)
                         
                            
                        # Create order details
                        OrderDetails.objects.create(
                            order=order,
                            product=product,
                            product_quantity=item['quantity'],
                        )
                        # Add product details to email data
                        purchased_products.append({
                            "name": product.name,
                            "quantity": item['quantity'],
                            "price": product.price
                        })


                    except Product.DoesNotExist:
                        return JsonResponse({"error": f"Product with ID {item['product_id']} not found"}, status=404)
                
                send_order_confirmation_email(
                        customer_name=order.customer_name,
                        customer_email=order.email_id,  # Fetching from order table
                        order_amount=order.order_amount,
                        products=purchased_products
                    
                )
                return JsonResponse({
                    "message": "Order created successfully",
                    "order_id": order.order_id,
                    "status": order.order_status,
                    "amount": order.order_amount,
                    "transaction_id": payment.transaction_id,
                    "email_id": order.email_id,
                    "customer_name": order.customer_name
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


def send_order_confirmation_email(customer_name, customer_email, order_amount,products):
    """Sends an order confirmation email to the customer."""
    
    subject = "Order Confirmation - Your Order is Confirmed!"
    
    # Render HTML email template
    html_content = render_to_string("emails/order_confirmed.html", {
        "customer_name": customer_name,
        "order_amount": order_amount,
        "customer_email": customer_email,
        "products": products
    })
    
    # Create plain text version of the email
    plain_message = strip_tags(html_content)
    
    sender_email = 'webshop.alerts3011@gmail.com'  # Change this to your sender email
    recipient_list = [customer_email]
    
    # Create and send the email
    email = EmailMessage(subject, plain_message, sender_email, recipient_list)
    email.content_subtype = "html"  # Send as HTML
    email.body = html_content
    email.send()



class UpdateOrderStatusView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            # Parse the JSON data from the request
            data = json.loads(request.body)
            order_id = data.get('order_id')
            new_status = data.get('order_status')
            email_id = data.get('email_id')

            if not order_id or not new_status:
                return JsonResponse({"error": "Order ID and order_status are required"}, status=400)

            # Retrieve the order object
            order = get_object_or_404(Order, pk=order_id)

            # Update the order status
            previous_status = order.order_status
            order.order_status = new_status
            order.save()

            # Call the helper function to send an email
            send_status_update_email(
                customer_name=order.customer.name,
                customer_email=order.email_id,
                order_id=order_id,
                previous_status=previous_status,
                new_status=new_status
            )

            return JsonResponse({"message": "Order status updated and email sent"})
        except Order.DoesNotExist:
            return JsonResponse({"error": "Order not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)




def send_status_update_email(customer_name, customer_email, order_id, previous_status, new_status):
    if new_status == "Confirmed":
        subject = "Your Order is Confirmed!"
        html_content = render_to_string("emails/order_confirmed.html", {
            "customer_name": customer_name,
            "order_id": order_id
        })
    elif new_status == "Shipped":
        subject = "Your Order is Shipped!"
        html_content = render_to_string("emails/order_shipped.html", {
            "customer_name": customer_name,
            "order_id": order_id
        })

    elif new_status == "Cancelled":
        subject = "Your Order is Cancelled"
        html_content = render_to_string("emails/order_cancelled.html", {
            "customer_name": customer_name,
            "order_id": order_id
        })

    elif new_status == "Delivered":
        subject = "Your Order is Delivered!"
        html_content = render_to_string("emails/order_delivered.html", {
            "customer_name": customer_name,
            "order_id": order_id
        })
    else:
        return  # Skip sending emails for other statuses.

    # Create plain text version by stripping HTML tags
    plain_message = strip_tags(html_content)
    sender_email = 'webshop.alerts3011@gmail.com'  # Replace with your actual sender email
    recipient_list = [customer_email]

    # Send email with both plain text and HTML versions
    email = EmailMessage(subject, plain_message, sender_email, recipient_list)
    email.content_subtype = "html"  # Send as HTML
    email.body = html_content
    email.send()



def sendLowStockEmail(product):  
    print(f"Sending email for {product.name} - Stock: {product.inventory.stock}")  # Debugging log

    supplier = product.supplier
    subject = f"Low Stock Alert for Product: {product.name}"
    message = (
        f"Dear {supplier.name},\n\n"
        f"The stock for your product '{product.name}' is low.\n"
        f"Current Stock: {product.inventory.stock}\n\n"
        "Please restock to avoid potential shortages.\n"
        "Thank you."
    )

    send_mail(
        subject,
        message,
        'webshop.alerts3011@gmail.com',  
        [supplier.email],
        fail_silently=False  # This will raise errors if email fails
    )
    print(f"Email sent to {supplier.email}")  # Debugging log

@method_decorator(user_passes_test(lambda u: u.is_superuser), name='dispatch')
class LowStockCheckView(View):
    def get(self, request):
        try:
            # Fetch products with low stock
            low_stock_products = Product.objects.filter(inventory__stock__lt=5)

            if not low_stock_products.exists():
                return JsonResponse({"message": "All products have sufficient stock."})

            # Email each supplier
            for product in low_stock_products:
                supplier = product.supplier
                subject = f"Low Stock Alert for Product: {product.name}"
                message = (
                    f"Dear {supplier.name},\n\n"
                    f"The stock for your product '{product.name}' is low.\n"
                    f"Current Stock: {product.inventory.stock}\n\n"
                    "Please restock to avoid potential shortages.\n"
                    "Thank you."
                )
                send_mail(
                    subject,
                    message,
                    'webshop.alerts3011@gmail.com',  # Replace with your sender email
                    [supplier.email]
                )

            return JsonResponse({
                "message": "Low stock check completed. Emails sent to suppliers.",
                "low_stock_products": [
                    {"product_name": p.name, "stock": p.inventory.stock, "supplier": p.supplier.name}
                    for p in low_stock_products
                ]
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
