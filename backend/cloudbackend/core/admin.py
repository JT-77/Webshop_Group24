from django.contrib import admin

from django.contrib import admin
from .models import Customer, Supplier, Product, Inventory, Payment, Order, OrderDetails

admin.site.register(Customer)
admin.site.register(Supplier)
admin.site.register(Product)
admin.site.register(Inventory)
admin.site.register(Payment)
admin.site.register(Order)
admin.site.register(OrderDetails)

