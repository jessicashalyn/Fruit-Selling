from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from products.models import Product
from orders.models import Order
from accounts.models import DeliveryPartner, User
from django.db.models import Sum

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Unauthorized'}, status=403)
            
        # Total Revenue (sum of total_amount for COMPLETED orders)
        revenue_agg = Order.objects.filter(payment_status='COMPLETED').aggregate(Sum('total_amount'))
        total_revenue = revenue_agg['total_amount__sum'] or 0
        
        # Active Orders (Not Delivered, Cancelled, Failed, Refunded)
        active_orders = Order.objects.filter(
            status__in=['PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY']
        ).count()
        
        # Total Products
        total_products = Product.objects.count()
        
        # Total Delivery Partners (Approved)
        total_partners = DeliveryPartner.objects.filter(is_approved=True).count()
        
        return Response({
            'total_revenue': total_revenue,
            'active_orders': active_orders,
            'total_products': total_products,
            'delivery_partners': total_partners
        })
