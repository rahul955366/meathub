from django.contrib.auth.models import User
from django.db import transaction, IntegrityError, OperationalError
from django.conf import settings
from django.utils import timezone
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.request import Request
from rest_framework_simplejwt.views import TokenObtainPairView
from typing import List, Dict, Any, Optional

import logging
from decimal import Decimal, InvalidOperation
from functools import wraps
from math import radians, cos, sin, asin, sqrt

from .models import (
    Butcher, MeatItem, Subscription, GymSubscription, PetSubscription,
    UserProfile, Order, OrderItem, AIChatHistory, VillageSource, Review,
    ButcherWasteCollection, PetFoodProduct
)
from .serializers import (
    RegisterSerializer, ButcherSerializer, MeatItemSerializer,
    SubscriptionSerializer, GymSubscriptionSerializer, PetSubscriptionSerializer,
    UserProfileSerializer, OrderSerializer, MyTokenObtainPairSerializer, ReviewSerializer,
    ButcherWasteCollectionSerializer, PetFoodProductSerializer
)
from .throttles import LoginRateThrottle, RegisterRateThrottle, OrderRateThrottle

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Override JWT login view to use our custom serializer.
    Includes user metadata in the payload.
    """
    serializer_class = MyTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]

logger = logging.getLogger(__name__)

def handle_api_errors(func):
    """
    Decorator to standardize API error handling.
    Captures specific exceptions and returns appropriate HTTP responses.
    """
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        try:
            return func(request, *args, **kwargs)
        except ValueError as e:
            logger.warning(f"{func.__name__} - ValueError: {str(e)}", extra={'user_id': getattr(request.user, 'id', None)})
            return Response({'error': 'Invalid input format', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except TypeError as e:
            logger.warning(f"{func.__name__} - TypeError: {str(e)}", extra={'user_id': getattr(request.user, 'id', None)})
            return Response({'error': 'Invalid data type'}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            logger.warning(f"{func.__name__} - KeyError: {str(e)}", extra={'user_id': getattr(request.user, 'id', None)})
            return Response({'error': f'Missing required field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            logger.error(f"{func.__name__} - IntegrityError: {str(e)}", exc_info=True)
            return Response({'error': 'Data integrity error. Please check your input.'}, status=status.HTTP_400_BAD_REQUEST)
        except OperationalError as e:
            logger.critical(f"{func.__name__} - OperationalError: {str(e)}", exc_info=True)
            return Response({'error': 'Service temporarily unavailable.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            logger.critical(f"{func.__name__} - Unexpected error: {str(e)}", exc_info=True)
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return wrapper


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@handle_api_errors
def me(request):
    """
    Returns the current authenticated user's details and role information.
    Used for frontend role-based routing.
    """
    is_butcher = hasattr(request.user, 'butcher_profile')
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'is_butcher': is_butcher,
        'butcher_id': request.user.butcher_profile.id if is_butcher else None,
        'email': request.user.email,
        'is_staff': request.user.is_staff
    })

# Configure Gemini AI (Disabled as per user preference)
# if settings.GEMINI_API_KEY:
#     import google.generativeai as genai
#     genai.configure(api_key=settings.GEMINI_API_KEY)




class RegisterView(generics.CreateAPIView):
    """
    Endpoint for new user registration.
    Publicly accessible.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    throttle_classes = [RegisterRateThrottle]


from django.db.models import Avg, Count

class ButcherViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing Butcher shops.
    Read-only for unauthenticated users, public access allowed.
    Optimized with live ratings and order counts.
    """
    serializer_class = ButcherSerializer
    permission_classes = [AllowAny]
    queryset = Butcher.objects.none()

    def get_queryset(self):
        return Butcher.objects.select_related('user', 'village_source') \
                               .annotate(
                                   rating=Avg('reviews__rating'),
                                   total_orders=Count('orders', distinct=True)
                               ) \
                               .filter(status='APPROVED')

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reset_stock(self, request, pk=None):
        """
        Special Day 3 Feature: Resets all meat items to AVAILABLE for the morning.
        """
        butcher = self.get_object()
        # Verify ownership: Butcher can only reset their own shop
        if request.user != butcher.user and not request.user.is_staff:
            return Response({"error": "Unauthorized. You do not own this shop."}, status=status.HTTP_403_FORBIDDEN)
        
        from .models import MeatItem
        MeatItem.objects.filter(butcher=butcher).update(status='AVAILABLE')
        
        logger.info(f"MORNING_RESET | Butcher: {butcher.shop_name} | By: {request.user.email}")
        return Response({"message": f"Successfully reset stock for {butcher.shop_name} for the morning."})


class MeatItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for meat inventory items.
    Supports ?mine=true for butcher-specific inventory.
    """
    serializer_class = MeatItemSerializer
    permission_classes = [AllowAny]
    queryset = MeatItem.objects.none()

    def get_queryset(self):
        if self.request.query_params.get('mine') == 'true':
            if self.request.user.is_authenticated and hasattr(self.request.user, 'butcher_profile'):
                return MeatItem.objects.filter(
                    butcher=self.request.user.butcher_profile,
                    status='AVAILABLE'
                ).select_related('butcher')
        return MeatItem.objects.select_related('butcher').filter(status='AVAILABLE')


class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    Manage standard meat delivery subscriptions.
    Restricted to authenticated owner.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user) \
                                   .select_related('butcher', 'meat_item')

    def perform_create(self, serializer):
        item = serializer.validated_data['meat_item']
        qty = Decimal(str(serializer.validated_data['quantity_kg']))
        price = item.price * qty
        
        serializer.save(
            user=self.request.user,
            meat_item_name=item.name,
            subscription_price=price,
            delivery_address=serializer.validated_data.get('delivery_address') or getattr(self.request.user.profile, 'bio', 'No Address Provided'),
            delivery_phone=serializer.validated_data.get('delivery_phone') or getattr(self.request.user.profile, 'phone', '0000000000')
        )


class GymSubscriptionViewSet(viewsets.ModelViewSet):
    """
    Manage fitness-focused protein subscriptions.
    Restricted to authenticated owner.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = GymSubscriptionSerializer

    def get_queryset(self):
        return GymSubscription.objects.filter(user=self.request.user) \
                                      .select_related('butcher', 'meat_item')

    def perform_create(self, serializer):
        item = serializer.validated_data['meat_item']
        serializer.save(
            user=self.request.user,
            meat_item_name=item.name,
            delivery_address=serializer.validated_data.get('delivery_address') or getattr(self.request.user.profile, 'bio', 'No Address Provided'),
            delivery_phone=serializer.validated_data.get('delivery_phone') or getattr(self.request.user.profile, 'phone', '0000000000')
        )


class PetSubscriptionViewSet(viewsets.ModelViewSet):
    """
    Manage pet food subscriptions.
    Restricted to authenticated owner.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PetSubscriptionSerializer

    def get_queryset(self):
        return PetSubscription.objects.filter(user=self.request.user) \
                                      .select_related('meat_item')

    def perform_create(self, serializer):
        item = serializer.validated_data.get('meat_item')
        product_name = serializer.validated_data.get('product_name')
        if item and not product_name:
            product_name = item.name
            
        serializer.save(
            user=self.request.user,
            product_name=product_name or "Premium Selection",
            delivery_address=serializer.validated_data.get('delivery_address') or getattr(self.request.user.profile, 'bio', 'No Address Provided')
        )


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    Manage user profile details.
    Restricted to authenticated owner.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def redeem_points(self, request):
        """
        Redeem loyalty points for a benefit (e.g., Free Delivery voucher).
        Cost: 100 points.
        """
        profile = self.get_queryset().get(user=request.user)
        points_to_redeem = 100
        
        if profile.loyalty_points < points_to_redeem:
            return Response({
                'error': f'Insufficient points. You need {points_to_redeem} points to redeem a benefit.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        profile.loyalty_points -= points_to_redeem
        profile.save()
        
        # In a real app, this would generate a Cupon or flag the order
        logger.info(f"User {request.user.username} redeemed {points_to_redeem} points.")
        
        return Response({
            'success': True,
            'message': 'Benefit redeemed! Your next delivery is on us.',
            'new_balance': profile.loyalty_points
        })

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user).select_related('user')


class OrderViewSet(viewsets.ModelViewSet):
    """
    View and manage user orders.
    Orders are ordered by creation date (newest first).
    """
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        base_qs = Order.objects.select_related('butcher', 'user') \
                               .prefetch_related('items__meat_item') \
                               .order_by('-created_at')
        
        if user.is_staff or user.is_superuser:
            return base_qs
            
        if hasattr(user, 'butcher_profile'):
            return base_qs.filter(butcher=user.butcher_profile)
        
        return base_qs.filter(user=user)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    Customer reviews for shops and orders.
    """
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        butcher_id = self.request.query_params.get('butcher_id')
        if butcher_id:
            return Review.objects.filter(butcher_id=butcher_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny]) # Changed from IsAuthenticated to allow Guest Checkout
@throttle_classes([OrderRateThrottle])
@handle_api_errors
def create_order(request: Request) -> Response:
    """
    Custom endpoint to handle complex order creation logic.
    Validates stock, availability, and creates Order & OrderItems atomically.
    
    Payload:
    {
        "butcher_id": int,
        "items": [{"meat_item_id": int, "quantity": int, "price": str}],
        "delivery_address": str,
        "delivery_phone": str,
        "payment_method": str,  # "COD" or "ONLINE"
        "payment_id": str  # Required if payment_method is "ONLINE"
    }
    """
    data: Dict[str, Any] = request.data
    butcher_id: Optional[int] = data.get('butcher_id')
    items_data: List[Dict[str, Any]] = data.get('items', [])
    is_sunday_special = data.get('is_sunday_special', False)

    # 0. Saturday 12 PM Cutoff Logic
    now = timezone.localtime()
    if is_sunday_special:
        # Weekday: 0=Mon, 5=Sat, 6=Sun
        if now.weekday() == 5 and now.hour >= 12:
            return Response({
                'error': 'Sunday special delivery cutoff was 12 PM Saturday. Orders are now closed for tomorrow.'
            }, status=status.HTTP_400_BAD_REQUEST)
        if now.weekday() == 6:
             return Response({
                'error': 'Sunday special orders must be placed by Saturday 12 PM.'
            }, status=status.HTTP_400_BAD_REQUEST)

    # Handle Guest User
    order_user = request.user if request.user.is_authenticated else None

    if not butcher_id:
        return Response({'error': 'butcher_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not items_data or not isinstance(items_data, list):
        return Response({'error': 'Items must be a non-empty list.'}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Validate Butcher Availability
    try:
        butcher = Butcher.objects.get(id=butcher_id, status='APPROVED', is_available=True)
        
        # 1.1 Daily Quota Check (Issue #14)
        today_orders = Order.objects.filter(butcher=butcher, created_at__date=timezone.now().date()).count()
        if today_orders >= butcher.daily_order_quota:
            return Response({
                'error': f'Butcher "{butcher.shop_name}" has reached their daily artisanal order limit ({butcher.daily_order_quota}). Please try another partner or check back tomorrow.'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Butcher.DoesNotExist:
        return Response({'error': 'Butcher not found or currently unavailable.'}, status=status.HTTP_404_NOT_FOUND)

    # 2. Validate Items & Calculate Total
    validated_items: List[Dict[str, Any]] = []
    total_amount = Decimal('0.00')

    for item_data in items_data:
        meat_item_id = item_data.get('meat_item_id')
        quantity = item_data.get('quantity')
        price_input = item_data.get('price')

        if not all([meat_item_id, quantity, price_input]):
             return Response({'error': 'meat_item_id, quantity and price are required for each item.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
            price = Decimal(str(price_input))
            if quantity <= 0 or price <= 0:
                 return Response({'error': 'Quantity and price must be positive.'}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, InvalidOperation):
             return Response({'error': 'Invalid quantity or price format.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure item belongs to the butcher and is available
            meat_item = MeatItem.objects.get(id=meat_item_id, butcher=butcher, status='AVAILABLE')
            
            # Use database price to prevent tampering (optional strict check)
            if abs(meat_item.price - price) > Decimal('0.5'):
                return Response({'error': f'Price mismatch for {meat_item.name}'}, status=status.HTTP_400_BAD_REQUEST)

        except MeatItem.DoesNotExist:
             return Response({'error': f'Item ID {meat_item_id} is not available from this butcher.'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_amount += price * quantity
        validated_items.append({
            'meat_item': meat_item,
            'quantity': quantity,
            'price': price
        })

    # 3. Validate Payment for Online Orders
    payment_method = data.get('payment_method', 'COD').upper()
    payment_id = data.get('payment_id', '').strip()
    payment_status = 'PENDING'
    initial_order_status = 'PENDING'
    
    # Update PAYMENT_CHOICES to include ONLINE
    valid_payment_methods = ['COD', 'ONLINE', 'UPI', 'CARD']
    if payment_method not in valid_payment_methods:
        return Response(
            {'error': f'Invalid payment method. Must be one of: {", ".join(valid_payment_methods)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if payment_method in ['ONLINE', 'UPI', 'CARD']:
        if not payment_id:
            return Response(
                {'error': 'payment_id is required for online payments'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # For online payments, assume payment already verified by frontend
        payment_status = 'COMPLETED'
        initial_order_status = 'CONFIRMED'  # Online payments go straight to confirmed
    
    # 4. Create Order Atomically
    try:
        with transaction.atomic():
            order = Order.objects.create(
                user=order_user,
                butcher=butcher,
                total_amount=total_amount,
                status=initial_order_status,
                payment_method=payment_method,
                payment_id=payment_id if payment_id else None,
                payment_status=payment_status,
                delivery_address=data.get('delivery_address', ''),
                delivery_phone=data.get('delivery_phone', ''),
            )

            for item in validated_items:
                meat_item = item['meat_item']
                quantity = item['quantity']
                
                # Atomic stock deduction
                if meat_item.quantity < quantity:
                    raise Exception(f"Insufficient stock for {meat_item.name}")
                
                meat_item.quantity -= quantity
                if meat_item.quantity == 0:
                    meat_item.status = 'SOLD_OUT'
                meat_item.save()

                OrderItem.objects.create(
                    order=order,
                    meat_item=meat_item,
                    quantity=quantity,
                    price_at_order=item['price'],
                )
    except Exception as e:
        logger.error(f"Order Creation Transaction Failed: {str(e)}", exc_info=True)
        return Response({'error': 'Transaction failed. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        'order_id': order.id,
        'status': order.status,
        'total_amount': str(order.total_amount),
        'is_official': butcher.is_official,
        'message': 'Order placed successfully!'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@handle_api_errors
def contextual_ai(request: Request) -> Response:
    """
    AI Assistant endpoint for contextual advice.
    Routes queries to 'Pet', 'Gym', or 'General' contexts using Gemini.
    """
    try:
        context = request.data.get('context', 'GENERAL')
        user_message = request.data.get('message', '').strip()
        
        if not user_message:
            return Response({'error': 'Message required'}, status=status.HTTP_400_BAD_REQUEST)

        # Prompt Engineering
        system_prompts = {
            'PET': (
                "You are an expert veterinary nutritionist at MeatHub. "
                "Advise on safe, healthy meat options for pets (dogs/cats). "
                "MeatHub provides raw, species-appropriate ancestral diets. "
                "Prioritize natural, zero-waste cuts like chicken frames or organ meats available from our local Hyderabad butchers."
            ),
            'GYM': (
                "You are a sports nutritionist at MeatHub. "
                "Advise on high-protein meat sources for muscle building and recovery. "
                "Suggest lean cuts like chicken breast, turkey, or lean mutton. "
                "MeatHub ensures transparency via cutting videos provided by our artisanal butchers."
            ),
            'GENERAL': (
                "You are MeatHub's culinary expert and guide to the Village Guild. "
                "Help customers choose the best cuts from our Hyderabad-based butchers. "
                "Explain textures, suggest cooking methods, and emphasize our transparency and local sourcing. "
                "Be helpful, professional, and encouraging."
            )
        }
        
        system_prompt = system_prompts.get(context, system_prompts['GENERAL'])

        if not settings.GEMINI_API_KEY:
             # Dev fallback
             logger.warning("GEMINI_API_KEY not set. Returning simulated response.")
             ai_response = f"[Simulated AI] ({context}) {user_message}"
        else:
            model = genai.GenerativeModel('gemini-1.5-flash')
            full_prompt = f"{system_prompt}\n\nUser Question: {user_message}"
            response = model.generate_content(full_prompt)
            ai_response = response.text.strip()

        # Log interaction
        AIChatHistory.objects.create(
            user=request.user,
            context=context,
            message=user_message,
            response=ai_response
        )

        return Response({'success': True, 'context': context, 'response': ai_response})

    except Exception as e:
        logger.error(f"AI Service Error: {str(e)}", exc_info=True)
        return Response({'error': 'AI service temporarily unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


def haversine(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    """Calculate the great circle distance between two points on the earth."""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return c * 6371

@api_view(['GET'])
@permission_classes([AllowAny])
@handle_api_errors
def nearby_butchers(request: Request) -> Response:
    """
    Returns a list of butchers within a specified radius (default 5km).
    Query params: lat, lng, radius (optional)
    """
    try:
        user_lat = float(request.query_params.get('lat', 17.4944))
        user_lng = float(request.query_params.get('lng', 78.3908))
        radius = float(request.query_params.get('radius', 5))
        category = request.query_params.get('category', '').upper()
    except (ValueError, TypeError):
        return Response({'error': 'Invalid latitude, longitude, or radius.'}, status=status.HTTP_400_BAD_REQUEST)

    all_butchers = Butcher.objects.filter(status='APPROVED', is_available=True, latitude__isnull=False, longitude__isnull=False)
    
    if category:
        all_butchers = all_butchers.filter(meat_items__category__iexact=category).distinct()
    
    today = timezone.now().date()
    
    nearby = []
    for butcher in all_butchers:
        dist = haversine(user_lng, user_lat, float(butcher.longitude), float(butcher.latitude))
        if dist <= radius:
            # 1.1 Calculate Load Factor (Issue #15)
            # Higher load = lower priority
            today_orders = Order.objects.filter(butcher=butcher, created_at__date=today).count()
            load_factor = today_orders / butcher.daily_order_quota if butcher.daily_order_quota > 0 else 1.0

            # Real avg rating from reviews
            avg_rating_data = butcher.reviews.aggregate(avg=Avg('rating'))
            avg_rating = avg_rating_data['avg']

            # Active (in-progress) orders for busy indicator
            active_order_count = Order.objects.filter(
                butcher=butcher,
                status__in=['CONFIRMED', 'PROCESSING']
            ).count()
            
            nearby.append({
                'id': butcher.id,
                'shop_name': butcher.shop_name,
                'distance_km': round(dist, 2),
                'latitude': float(butcher.latitude),
                'longitude': float(butcher.longitude),
                'address': butcher.address,
                'image_url': butcher.image_url,
                'rating': str(round(avg_rating, 1)) if avg_rating else None,
                'delivery_time': 20 if butcher.is_official else 35,
                'is_official': butcher.is_official,
                'hygiene_score': butcher.hygiene_score,
                'load_factor': load_factor,
                'active_orders': active_order_count,
                'is_busy': active_order_count >= 5,
            })

    # Sort: is_official first (True > False), then by load_factor (lower first), then by distance
    nearby.sort(key=lambda x: (not x['is_official'], x['load_factor'], x['distance_km']))
    
    return Response(nearby)

@api_view(['GET'])
@permission_classes([AllowAny])
@handle_api_errors
def official_items(request: Request) -> Response:
    """Returns items from MeatHub Official Flagship store."""
    items = MeatItem.objects.filter(butcher__is_official=True, status='AVAILABLE')
    data = []
    for item in items:
        data.append({
            'id': item.id,
            'name': item.name,
            'price': str(item.price),
            'category': item.category,
            'image_url': item.image_url,
            'butcher_name': item.butcher.shop_name,
            'butcher_id': item.butcher.id,
            'live_stream_url': item.butcher.live_stream_url if item.butcher.is_official else None
        })
    return Response(data)

@api_view(['GET'])
@handle_api_errors
def village_sources(request: Request) -> Response:
    """
    List all registered village sources for transparency.
    """
    sources = VillageSource.objects.all()
    data = [{'id': s.id, 'name': s.name, 'location': s.location} for s in sources]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_order_video(request: Request, order_id: int) -> Response:
    """
    Uploads a cutting proof video URL for a specific order.
    Butcher must own the order, or user must be staff.
    USP: Video Verification.
    """
    from django.shortcuts import get_object_or_404
    order = get_object_or_404(Order, id=order_id)

    # Authorization: must be the butcher who owns this order, or staff
    user = request.user
    is_owner = hasattr(user, 'butcher_profile') and order.butcher == user.butcher_profile
    if not is_owner and not user.is_staff:
        return Response({'error': 'You do not have permission to upload video for this order.'}, status=status.HTTP_403_FORBIDDEN)

    video_url = request.data.get('video_url')
    
    if not video_url:
        return Response({'error': 'video_url is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    order.cutting_video_url = video_url
    order.save()
    
    return Response({'success': True, 'message': 'Video uploaded successfully.', 'video_url': video_url})


class ButcherWasteCollectionViewSet(viewsets.ModelViewSet):
    queryset = ButcherWasteCollection.objects.all()
    serializer_class = ButcherWasteCollectionSerializer

    def get_permissions(self):
        """Public read of available waste cuts; write/modify requires authentication."""
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        butcher_id = self.request.query_params.get('butcher_id')
        if butcher_id:
            return self.queryset.filter(butcher_id=butcher_id, is_available=True)
        return self.queryset.filter(is_available=True)


class PetFoodProductViewSet(viewsets.ModelViewSet):
    queryset = PetFoodProduct.objects.all()
    serializer_class = PetFoodProductSerializer
    permission_classes = [AllowAny]
