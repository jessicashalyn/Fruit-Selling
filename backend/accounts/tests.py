from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import User

class AuthApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_send_otp(self):
        url = reverse('send_otp')
        payload = {'mobile_number': '9876543210'}
        res = self.client.post(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['message'], 'OTP sent successfully')

    def test_verify_otp(self):
        # Create user first
        User.objects.create_user(mobile_number='9876543210', password='password')
        
        url = reverse('verify_otp')
        payload = {'mobile_number': '9876543210', 'otp': '123456'}
        res = self.client.post(url, payload)
        
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)

    def test_verify_invalid_otp(self):
        url = reverse('verify_otp')
        payload = {'mobile_number': '9876543210', 'otp': '999999'}
        res = self.client.post(url, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
