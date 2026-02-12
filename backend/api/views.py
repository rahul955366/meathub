from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from .serializers import *


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class ButcherViewSet(viewsets.ModelViewSet):
    queryset = Butcher.objects.all()
    serializer_class = ButcherSerializer
    permission_classes = [AllowAny]


class MeatItemViewSet(viewsets.ModelViewSet):
    queryset = MeatItem.objects.all()
    serializer_class = MeatItemSerializer
    permission_classes = [AllowAny]


class SubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GymSubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GymSubscriptionSerializer

    def get_queryset(self):
        return GymSubscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PetSubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PetSubscriptionSerializer

    def get_queryset(self):
        return PetSubscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Create an order from the frontend cart payload.
    Expects: { butcher_id, delivery_address, delivery_phone, payment_method, items: [{meat_item_id, quantity, price}] }
    """
    data = request.data
    butcher_id = data.get('butcher_id')
    items_data = data.get('items', [])

    if not butcher_id or not items_data:
        return Response({'error': 'butcher_id and items are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        butcher = Butcher.objects.get(id=butcher_id)
    except Butcher.DoesNotExist:
        return Response({'error': 'Butcher not found.'}, status=status.HTTP_404_NOT_FOUND)

    total = sum(float(item.get('price', 0)) * int(item.get('quantity', 1)) for item in items_data)

    order = Order.objects.create(
        user=request.user,
        butcher=butcher,
        total_amount=total,
        payment_method=data.get('payment_method', 'COD'),
        delivery_address=data.get('delivery_address', ''),
        delivery_phone=data.get('delivery_phone', ''),
    )

    for item_data in items_data:
        try:
            meat_item = MeatItem.objects.get(id=item_data['meat_item_id'])
            OrderItem.objects.create(
                order=order,
                meat_item=meat_item,
                quantity=item_data.get('quantity', 1),
                price_at_order=item_data.get('price', 0),
            )
        except MeatItem.DoesNotExist:
            continue

    return Response({
        'order_id': order.id,
        'status': order.status,
        'total_amount': str(order.total_amount),
        'message': 'Order placed successfully!'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def contextual_ai(request):
    """
    Page-specific AI (Pet AI vs Gym AI vs General AI)
    """
    context = request.data.get('context', 'GENERAL')
    user_message = request.data.get('message', '')

    ai_response = ""
    if context == 'PET':
        ai_response = f"As your MeatHub Pet Assistant, I recommend our zero-waste chicken frames for your dog. Your message: {user_message}"
    elif context == 'GYM':
        ai_response = f"For your 250g daily protein goal, I suggest lean mutton cubes sourced from the local village. Your message: {user_message}"
    else:
        ai_response = f"Welcome to MeatHub! How can I help you find the best artisanal cuts today? Your message: {user_message}"

    AIChatHistory.objects.create(
        user=request.user,
        context=context,
        message=user_message,
        response=ai_response
    )

    return Response({
        'context': context,
        'response': ai_response
    })


@api_view(['GET'])
def village_sources(request):
    sources = VillageSource.objects.all()
    return Response([{'id': s.id, 'name': s.name, 'location': s.location} for s in sources])
