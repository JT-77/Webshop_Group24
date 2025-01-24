from django.shortcuts import get_object_or_404
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
