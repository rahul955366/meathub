from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Address, Butcher, MeatItem, Subscription, GymSubscription, PetSubscription, Order, OrderItem, AIChatHistory


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        UserProfile.objects.create(user=user, first_name=user.first_name, last_name=user.last_name)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'


class ButcherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Butcher
        fields = '__all__'


class MeatItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeatItem
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'


class GymSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymSubscription
        fields = '__all__'


class PetSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetSubscription
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    meat_item_name = serializers.CharField(source='meat_item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'meat_item', 'meat_item_name', 'quantity', 'price_at_order']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    butcher_name = serializers.CharField(source='butcher.shop_name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'butcher', 'butcher_name', 'total_amount', 'status',
                  'payment_method', 'delivery_address', 'delivery_phone',
                  'created_at', 'updated_at', 'items']


class AIChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChatHistory
        fields = '__all__'
