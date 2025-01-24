from django.urls import path
from .views import *

urlpatterns = [

    path('products/', ProductManagementView.as_view(), name='product-list'),
    path('orders/', OrderManagementView.as_view(), name='order-list'),
    path('inventory/', InventoryManagementView.as_view(), name='inventory-list'),
]
