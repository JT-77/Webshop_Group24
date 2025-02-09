from django.urls import path
from .views import *
from django.contrib import admin

urlpatterns = [
    path('admin/',admin.site.urls),
    path('products/', ProductListView.as_view(), name='product-list'),# GET All
    path('products/<int:product_id>/', ProductListView.as_view(), name='product-detail'),  # GET  for a specific product
    path('products/update/<int:product_id>/', ProductUpdateView.as_view(), name='product-detail'), #PUT
    path('products/delete/<int:product_id>/', ProductDeleteView.as_view(), name='product-detail'), #DELETE
    path('products/new/', ProductInsertView.as_view(), name='product-detail'),  # POST
    path('products/filter/', productFilterAPI.as_view(), name='product-list'),
    path('products/filterProducts/', FilteredProductListView.as_view(), name='filtered-products'),
    path('orders/', OrderListView.as_view()),  # For all orders
    path('orders/<int:order_id>/', OrderListView.as_view()),  # For a specific order
    path('orders/new/', OrderManagementView.as_view()),  # For a specific order
    path('inventory/', InventoryManagementView.as_view(), name='inventory-list'),
    path('supplier/', InventoryManagementView.as_view(), name='inventory-list'),
    path('order/update-status/', UpdateOrderStatusView.as_view(), name='update_order_status'),
    path('low-stock-check/', LowStockCheckView.as_view(), name='low-stock-check'),

]
