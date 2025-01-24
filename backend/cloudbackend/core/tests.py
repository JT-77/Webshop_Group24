from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

class ProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_products(self):
        response = self.client.get(reverse('product-list'))  # Replace with your actual URL name
        self.assertEqual(response.status_code, 200)

    def test_create_product(self):
        data = {
            "name": "Test Product",
            "price": 19.99,
            "description": "This is a test product.",
            "category": "Electronics",
            "supplier_id": 1,
            "stock": 50
        }
        response = self.client.post(reverse('product-create'), data, format='json')  # Replace URL name
        self.assertEqual(response.status_code, 201)
