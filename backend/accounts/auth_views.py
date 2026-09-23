from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import secrets
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
import requests
from .models import User, OTPVerification

def send_sms_otp(phone_number, otp):
    if settings.OTP_SMS_MODE == 'development':
        print(f"\n{'='*40}\n[MOCK SMS] OTP for {phone_number} is {otp}\n{'='*40}\n")
        return True
    
    url = "https://api.msg91.com/api/v5/otp"
    querystring = {
        "template_id": settings.SMS_PROVIDER_TEMPLATE_ID,
        "mobile": phone_number.replace("+", ""),
        "authkey": settings.SMS_PROVIDER_API_KEY,
        "otp": otp,
    }
    try:
        response = requests.get(url, params=querystring)
        return response.status_code == 200
    except Exception as e:
        print(f"SMS Sending failed: {e}")
        return False

class SendOTPView(APIView):
    permission_classes = []

    def post(self, request):
        mobile_number = request.data.get('phone') or request.data.get('mobile_number')
        if not mobile_number:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate 6 digit OTP
        otp = str(secrets.randbelow(900000) + 100000)
        otp_hash = make_password(otp)
        
        # Invalidate previous OTPs for this number
        OTPVerification.objects.filter(phone_number=mobile_number, is_verified=False).update(is_verified=True)
        
        # Save new OTP
        expires_at = timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
        OTPVerification.objects.create(
            phone_number=mobile_number,
            otp_hash=otp_hash,
            expires_at=expires_at
        )
        
        # Send OTP
        success = send_sms_otp(mobile_number, otp)
        
        if success:
            response_data = {'message': 'OTP sent successfully'}
            if settings.OTP_SMS_MODE == 'development':
                response_data['mock_otp'] = otp
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to send OTP. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    permission_classes = []

    def post(self, request):
        mobile_number = request.data.get('phone') or request.data.get('mobile_number')
        otp = request.data.get('otp')
        
        if not mobile_number or not otp:
            return Response({'error': 'Phone number and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        otp_record = OTPVerification.objects.filter(phone_number=mobile_number, is_verified=False).order_by('-created_at').first()
        
        if not otp_record:
            return Response({'error': 'No active OTP found. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if otp_record.expires_at < timezone.now():
            return Response({'error': 'OTP has expired. Please request a new OTP.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if otp_record.attempts >= settings.OTP_MAX_ATTEMPTS:
            return Response({'error': 'Too many verification attempts. Please request a new OTP.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not check_password(otp, otp_record.otp_hash):
            otp_record.attempts += 1
            otp_record.save()
            return Response({'error': 'Invalid OTP. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # OTP is valid
        otp_record.is_verified = True
        otp_record.save()
        
        # Get or create user
        user, created = User.objects.get_or_create(mobile_number=mobile_number)
        if created:
            user.role = 'CUSTOMER'
            user.save()
            
        if user.role == 'ADMIN':
            return Response({'error': 'Admin users must use email/password login.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_new_user': created,
            'role': user.role,
            'user': {
                'id': user.id,
                'phone': user.mobile_number,
                'role': user.role
            }
        }, status=status.HTTP_200_OK)

class AdminLoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email, role='ADMIN')
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'role': user.role,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'role': user.role
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
