from django.db import models

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    phone_number = models.CharField(max_length=15)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    shipping_address = models.TextField()

    def __str__(self):
        return self.name

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    stock = models.PositiveIntegerField()
    def __str__(self):
        return f"Inventory {self.inventory_id}"

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=50)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    inventory = models.OneToOneField(Inventory, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    name = models.CharField(max_length=100)
    description = models.TextField()
    #image = models.ImageField(upload_to='products/')
    image_path=models.JSONField(default=list, null=True, blank=True) 
    image_count = models.PositiveIntegerField(default=0)  # New column for image count
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)  # Ratings (e.g., 4.5)
    reviews = models.TextField(null=True, blank=True)  # Reviews (text field)
    subcategory = models.CharField(max_length=50, null=True, blank=True)  # Subcategory (e.g., "Laptop", "Desktop", "Tablet")

    def save(self, *args, **kwargs):
        # Dynamically calculate image_count based on image_path array length
        self.image_count = len(self.image_path or [])
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"Payment {self.payment_id}"

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_status = models.CharField(max_length=50)
    order_date = models.DateTimeField(auto_now_add=True)
    order_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Order {self.order_id}"

class OrderDetails(models.Model):
    order_details_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"OrderDetails {self.order_details_id}"