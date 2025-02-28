from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .views import send_status_update_email

@receiver(post_save, sender=Order)
def order_status_changed(sender, instance, **kwargs):
    """
    Signal handler to send an email when the order status is updated.
    """
    if kwargs.get('created', False):
        # Skip if the order is being created (not updated)
        return

    try:
        # Get the previous status from the database
        previous_order = Order.objects.get(pk=instance.pk)
        previous_status = previous_order.order_status
    except Order.DoesNotExist:
        previous_status = None

    # Check if the status has changed
    if previous_status != instance.order_status:
        send_status_update_email(
            customer_name=instance.customer.name,
            customer_email=instance.customer.email,
            order_id=instance.order_id,
            previous_status=previous_status,
            new_status=instance.order_status
        )