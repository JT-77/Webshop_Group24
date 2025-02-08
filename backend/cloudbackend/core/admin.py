from django.contrib import admin
from .views import send_status_update_email
from django.contrib import admin
from .models import Customer, Supplier, Product, Inventory, Payment, Order, OrderDetails

class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'order_status', 'order_amount', 'order_date')
    list_editable = ('order_status',)  # Allow editing the status directly in the list view
    search_fields = ('order_id', 'customer__name')
    list_filter = ('order_status',)

    def save_model(self, request, obj, form, change):
        """
        Override the save_model method to detect changes to the order_status field.
        """
        if change:  # Check if the object is being updated (not created)
            previous_order = Order.objects.get(pk=obj.pk)
            previous_status = previous_order.order_status

            # Call the superclass method to save the object
            super().save_model(request, obj, form, change)

            # Check if the order_status has changed
            if previous_status != obj.order_status:
                send_status_update_email(
                    customer_name=obj.customer.name,
                    customer_email=obj.customer.email,
                    order_id=obj.order_id,
                    previous_status=previous_status,
                    new_status=obj.order_status
                )
        else:
            # Call the superclass method to save the object
            super().save_model(request, obj, form, change)

admin.site.register(Customer)
admin.site.register(Supplier)
admin.site.register(Product)
admin.site.register(Inventory)
admin.site.register(Payment)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderDetails)

