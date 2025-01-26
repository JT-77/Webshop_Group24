from django.urls import path
from .views import *

urlpatterns = [

    path('products/', ProductManagementView.as_view(), name='product-list'),
    path('products/<int:product_id>/', ProductManagementView.as_view(), name='product-detail'),  # GET, PUT, DELETE
    path('orders/', OrderListView.as_view()),  # For all orders
    path('orders/<int:order_id>/', OrderListView.as_view()),  # For a specific order
    path('orders/new/', OrderManagementView.as_view()),  # For a specific order
    path('inventory/', InventoryManagementView.as_view(), name='inventory-list'),
    path('supplier/', InventoryManagementView.as_view(), name='inventory-list'),
    path('order/update-status/', UpdateOrderStatusView.as_view(), name='update_order_status'),

]
