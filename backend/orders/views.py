from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem, Cart, CartItem, Coupon
from .serializers import OrderSerializer, OrderItemSerializer, CartSerializer, CartItemSerializer, CouponSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return Order.objects.all()
        elif self.request.user.role == 'DELIVERY_PARTNER':
            return Order.objects.filter(delivery_partner__user=self.request.user)
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        cart = Cart.objects.filter(user=self.request.user).first()
        if cart:
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    price=item.product.price,
                    quantity=item.quantity,
                    unit=item.product.unit
                )
            cart.items.all().delete()
            
        # Create Razorpay order if payment method is not COD
        if order.payment_method in ['CARD', 'UPI', 'NET_BANKING']:
            try:
                from django.conf import settings
                if not settings.RAZORPAY_KEY_ID or settings.RAZORPAY_KEY_ID == 'your_razorpay_key_id_here' or 'dummy' in settings.RAZORPAY_KEY_ID.lower():
                    # MOCK RAZORPAY ORDER FOR DUMMY KEYS
                    order.razorpay_order_id = f"mock_order_{order.id}"
                    order.save()
                else:
                    import razorpay
                    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                    amount = int(order.total_amount * 100) # Amount in paise
                    razorpay_order = client.order.create({
                        "amount": amount,
                        "currency": "INR",
                        "receipt": f"order_rcptid_{order.id}",
                    })
                    order.razorpay_order_id = razorpay_order['id']
                    order.save()
            except Exception as e:
                print("Error creating Razorpay order:", e)

    @action(detail=True, methods=['post'])
    def verify_payment(self, request, pk=None):
        order = self.get_object()
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        
        try:
            from django.conf import settings
            if not settings.RAZORPAY_KEY_ID or settings.RAZORPAY_KEY_ID == 'your_razorpay_key_id_here' or 'dummy' in settings.RAZORPAY_KEY_ID.lower():
                # MOCK VERIFICATION
                order.payment_status = 'COMPLETED'
                order.razorpay_payment_id = payment_id or 'mock_pay_123'
                order.razorpay_signature = signature or 'mock_signature'
                order.save()
                return Response({'status': 'Mock Payment verified successfully'})
            else:
                import razorpay
                client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                params_dict = {
                    'razorpay_order_id': order_id,
                    'razorpay_payment_id': payment_id,
                    'razorpay_signature': signature
                }
                client.utility.verify_payment_signature(params_dict)
                order.payment_status = 'COMPLETED'
                order.razorpay_payment_id = payment_id
                order.razorpay_signature = signature
                order.save()
                return Response({'status': 'Payment verified successfully'})
        except Exception as e:
            order.payment_status = 'FAILED'
            order.save()
            return Response({'error': str(e)}, status=400)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response(self.get_serializer(order).data)
        return Response({'error': 'Status not provided'}, status=400)

    @action(detail=True, methods=['patch'])
    def assign_partner(self, request, pk=None):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Unauthorized'}, status=403)
        order = self.get_object()
        partner_id = request.data.get('delivery_partner_id')
        if partner_id:
            order.delivery_partner_id = partner_id
            order.save()
            return Response(self.get_serializer(order).data)
        return Response({'error': 'Delivery partner ID not provided'}, status=400)

from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from products.models import Product

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)

        if not product.is_active:
            return Response({'error': 'Product is currently unavailable.'}, status=400)
            
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        current_quantity = cart_item.quantity if cart_item else 0
        
        if product.stock < (current_quantity + quantity):
            if product.stock == 0:
                return Response({'error': 'Out of Stock'}, status=400)
            return Response({'error': f'Only {product.stock} items are available.'}, status=400)
            
        if not cart_item:
            cart_item = CartItem.objects.create(cart=cart, product=product, quantity=quantity)
        else:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = self.get_serializer(cart, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        if quantity > 0:
            if cart_item.product.stock < quantity:
                return Response({'error': f'Only {cart_item.product.stock} items are available.'}, status=400)
            cart_item.quantity = quantity
            cart_item.save()
        else:
            cart_item.delete()
            
        serializer = self.get_serializer(cart, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item_id = request.data.get('item_id')
        
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        
        serializer = self.get_serializer(cart, context={'request': request})
        return Response(serializer.data)

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.filter(is_active=True)
    serializer_class = CouponSerializer
