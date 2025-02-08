from django import forms
from .models import Product
from django.apps import AppConfig

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['category', 'supplier', 'inventory', 'price', 'name', 'description', 'image']
