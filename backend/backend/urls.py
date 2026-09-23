"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts.views import UserViewSet, CustomerProfileViewSet, AddressViewSet, DeliveryPartnerViewSet
from accounts.auth_views import SendOTPView, VerifyOTPView, AdminLoginView
from accounts.admin_views import AdminDashboardView
from products.views import CategoryViewSet, ProductViewSet
from orders.views import OrderViewSet, CartViewSet, CouponViewSet
from delivery.views import DeliveryZoneViewSet

router = DefaultRouter()
# Accounts
router.register(r'users', UserViewSet)
router.register(r'profiles', CustomerProfileViewSet)
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'delivery-partners', DeliveryPartnerViewSet)

# Products
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

# Orders
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'coupons', CouponViewSet)

# Delivery
router.register(r'delivery-zones', DeliveryZoneViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('api/auth/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('api/auth/admin-login/', AdminLoginView.as_view(), name='admin_login'),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
]
