from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from .models import Product, Inventory
from .forms import ProductForm

def home(request):
    return HttpResponse("Welcome to the Webshop!")

# Product CRUD operations

def product_list(request):
    products = Product.objects.all()
    return render(request, 'product_list.html', {'products': products})

def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save()
            # Update inventory when a product is created
            Inventory.objects.create(product=product, stock=0)
            return redirect('product_list')
    else:
        form = ProductForm()
    return render(request, 'product_form.html', {'form': form})

def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('product_list')
    else:
        form = ProductForm(instance=product)
    return render(request, 'product_form.html', {'form': form})

def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        # Delete product and its inventory entry
        Inventory.objects.filter(product=product).delete()
        product.delete()
        return redirect('product_list')
    return render(request, 'product_confirm_delete.html', {'product': product})