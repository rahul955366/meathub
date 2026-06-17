from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserProfile, Address, Butcher, MeatItem, Subscription, GymSubscription, PetSubscription, Order, OrderItem, AIChatHistory, Review, ButcherWasteCollection, PetFoodProduct
from decimal import Decimal
import re
from django.utils import timezone
from datetime import timedelta

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer to include user details in the response.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims (optional)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        is_butcher = hasattr(self.user, 'butcher_profile')
        # Add extra data to the response
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['is_butcher'] = is_butcher
        data['butcher_id'] = self.user.butcher_profile.id if is_butcher else None
        data['is_staff'] = self.user.is_staff
        return data


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the core Django User model.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


import logging

logger = logging.getLogger(__name__)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True, min_length=3, max_length=30)
    first_name = serializers.CharField(required=True, min_length=1, max_length=100)
    last_name = serializers.CharField(required=False, max_length=100, allow_blank=True)
    referral_code = serializers.CharField(required=False, max_length=20, allow_blank=True)
    role = serializers.ChoiceField(choices=['USER', 'BUTCHER'], default='USER', write_only=True)
    shop_name = serializers.CharField(required=False, max_length=255, allow_blank=True, write_only=True)
    address = serializers.CharField(required=False, max_length=255, allow_blank=True, write_only=True)
    phone = serializers.CharField(required=False, max_length=20, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'confirm_password', 'email', 'first_name', 'last_name', 'referral_code', 'role', 'shop_name', 'address', 'phone')

    def validate_username(self, value):
        value = value.strip()
        logger.debug(f"Validating username: {value}")
        
        if not value:
            raise serializers.ValidationError("Username cannot be empty")
        
        if not (3 <= len(value) <= 30):
            raise serializers.ValidationError("Username must be between 3 and 30 characters")
        
        if not re.match(r'^[a-zA-Z0-9_\.]+$', value):
            raise serializers.ValidationError("Login name can only contain letters, numbers, underscores and dots.")
        
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This login name is already taken.")
        
        return value.lower()

    def validate_email(self, value):
        value = value.strip().lower()
        
        if not value:
            raise serializers.ValidationError("Email is required")
        
        disposable_domains = {
            'tempmail.com', 'throwaway.email', '10minutemail.com',
            'guerrillamail.com', 'mailinator.com', 'trashmail.com'
        }
        
        domain = value.split('@')[1] if '@' in value else ''
        if domain in disposable_domains:
            raise serializers.ValidationError("Please use a permanent email address")
        
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        return value

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Please enter your name.")
        
        if len(value) > 200:
            raise serializers.ValidationError("Name is too long.")
        
        return value.title()

    def validate_last_name(self, value):
        return value.strip().title() if value else ''

    def validate(self, data):
        logger.debug(f"Register Validation Data: { {k: v for k, v in data.items() if 'password' not in k} }")
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        if data.get('role') == 'BUTCHER':
            if not data.get('shop_name'):
                raise serializers.ValidationError({"shop_name": "Shop name is required for butcher registration."})
            if not data.get('address'):
                raise serializers.ValidationError({"address": "Shop address is required for butcher registration."})
            if not data.get('phone'):
                raise serializers.ValidationError({"phone": "Phone number is required for butcher registration."})
        
        return data
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        role = validated_data.pop('role', 'USER')
        shop_name = validated_data.pop('shop_name', '')
        address = validated_data.pop('address', '')
        phone = validated_data.pop('phone', '')
        referral_code = validated_data.pop('referral_code', None)
        
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                password=validated_data['password'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data.get('last_name', ''),
            )
            
            # Identify referrer
            referrer = None
            if referral_code:
                try:
                    referrer = UserProfile.objects.get(referral_code=referral_code.strip().upper())
                    # Reward referrer
                    referrer.loyalty_points += 50 
                    referrer.save()
                    logger.info(f"Referral reward: {referrer.user.username} earned 50 points via {user.username}")
                except UserProfile.DoesNotExist:
                    logger.warning(f"Invalid referral code used: {referral_code}")

            UserProfile.objects.create(
                user=user,
                first_name=validated_data['first_name'],
                last_name=validated_data.get('last_name', ''),
                referred_by=referrer,
                phone=phone
            )

            if role == 'BUTCHER':
                from .models import Butcher
                Butcher.objects.create(
                    user=user,
                    shop_name=shop_name,
                    address=address,
                    phone_number=phone,
                    status='APPROVED',
                    is_available=True
                )
            
            logger.info(f"New user registered: {user.username} ({user.email}) as {role}", extra={'user_id': user.id})
            
            return user
            
        except Exception as e:
            logger.error(f"User creation failed: {str(e)}", exc_info=True)
            raise serializers.ValidationError("Unable to create account. Please try again.")


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile.
    Includes nested UserSerializer for read operations.
    """
    user = UserSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'first_name', 'last_name', 'full_name', 'phone',
            'bio', 'profile_image_url', 'gender',
            'date_of_birth', 'preferred_butcher_id',
            'referral_code', 'loyalty_points',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'referral_code', 'loyalty_points', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        """
        Comprehensive phone number validation for Indian phone numbers.
        """
        if not value:
            return value
        
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        
        # Remove country code if present
        if cleaned.startswith('+91'):
            cleaned = cleaned[3:]
        elif cleaned.startswith('91'):
            cleaned = cleaned[2:]
        
        # Validate format
        if not cleaned.isdigit() or len(cleaned) != 10:
            raise serializers.ValidationError("Invalid phone number format. Must be 10 digits.")
        
        # Check if starts with valid digit (6-9 for Indian mobile numbers)
        if cleaned[0] not in '6789':
            raise serializers.ValidationError("Phone number must start with 6, 7, 8, or 9")
        
        return cleaned
    
    def validate_date_of_birth(self, value):
        """Ensure realistic date of birth with age restrictions"""
        if not value:
            return value
        
        from datetime import timedelta
        
        today = timezone.now().date()
        
        # Must be at least 13 years old
        min_age_date = today - timedelta(days=13*365)
        # Must be less than 120 years old
        max_age_date = today - timedelta(days=120*365)
        
        if value > min_age_date:
            raise serializers.ValidationError("You must be at least 13 years old to register")
        
        if value < max_age_date:
            raise serializers.ValidationError("Invalid date of birth")
        

class ButcherSerializer(serializers.ModelSerializer):
    """
    Serializer for Butcher shops.
    """

    rating = serializers.FloatField(read_only=True, allow_null=True)
    total_orders = serializers.IntegerField(read_only=True)
    active_orders = serializers.SerializerMethodField()
    is_busy = serializers.SerializerMethodField()

    def get_active_orders(self, obj):
        # Prefer annotated value from get_queryset if available, else querying count
        if hasattr(obj, 'live_active_orders'):
            return obj.live_active_orders
        return getattr(obj, 'active_orders', 0)

    def get_is_busy(self, obj):
        # Mark as busy if actively occupied with 3 or more orders or flagged manually
        return obj.is_busy or self.get_active_orders(obj) >= 3

    class Meta:
        model = Butcher
        fields = [
            'id', 'shop_name', 'address', 'phone_number',
            'description', 'latitude', 'longitude',
            'service_radius_km', 'image_url',
            'opening_time', 'closing_time',
            'is_available', 'status', 'is_official', 'is_gym_approved',
            'hygiene_score', 'live_stream_url',
            'rating', 'total_orders', 'active_orders', 'is_busy'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'rating', 'total_orders']

    def validate_phone_number(self, value):
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        if cleaned.startswith('+91'):
            cleaned = cleaned[3:]
        if not cleaned.isdigit() or len(cleaned) != 10:
            raise serializers.ValidationError("Invalid phone number format")
        return cleaned


class MeatItemSerializer(serializers.ModelSerializer):
    """
    Serializer for inventory items.
    """
    butcher_name = serializers.SerializerMethodField()
    butcher_is_busy = serializers.SerializerMethodField()
    butcher_lat = serializers.SerializerMethodField()
    butcher_lng = serializers.SerializerMethodField()
    is_in_stock = serializers.ReadOnlyField()

    def get_butcher_name(self, obj):
        return obj.butcher.shop_name if obj.butcher else "Unknown Shop"

    def get_butcher_is_busy(self, obj):
        if not obj.butcher:
            return False
        # Fetch annotated live order count or fallback to manual DB flag
        live_orders = getattr(obj, 'butcher_live_orders', getattr(obj.butcher, 'active_orders', 0))
        return obj.butcher.is_busy or (live_orders >= 3)

    def get_butcher_lat(self, obj):
        return obj.butcher.latitude if obj.butcher else None

    def get_butcher_lng(self, obj):
        return obj.butcher.longitude if obj.butcher else None
    
    class Meta:
        model = MeatItem
        fields = [
            'id', 'butcher', 'butcher_name', 'butcher_is_busy',
            'butcher_lat', 'butcher_lng', 'name',
            'description', 'price', 'quantity',
            'category', 'image_url', 'status', 
            'is_in_stock', 'village_source', 'created_at',
            'protein_g', 'fat_g', 'calories', 
            'is_gym_approved', 'is_pet_suitable', 'product_type'
        ]
        read_only_fields = ['id', 'butcher_name', 'created_at', 'status']
    
    def validate_price(self, value):
        """Ensure price is positive and reasonable"""
        if value is None:
            raise serializers.ValidationError("Price is required")
        
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        
        if value > Decimal('10000.00'):
            raise serializers.ValidationError("Price exceeds maximum (₹10,000)")
        
        # Ensure max 2 decimal places
        if value.as_tuple().exponent < -2:
            raise serializers.ValidationError("Price can have maximum 2 decimal places")
        
        return value
    
    def validate_quantity(self, value):
        """Validate quantity is positive and reasonable"""
        if value is None:
            raise serializers.ValidationError("Quantity is required")
        
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative")
        
        if value > 10000:
            raise serializers.ValidationError(
                "Quantity exceeds maximum (10,000 kg). Please contact support for bulk inventory."
            )
        
        return value
    
    def validate(self, data):
        """Cross-field validation and auto-status management"""
        quantity = data.get('quantity')
        
        # Auto-adjust status based on quantity
        if quantity is not None:
            if quantity == 0:
                data['status'] = 'SOLD_OUT'
            elif quantity > 0 and data.get('status') == 'SOLD_OUT':
                # If adding stock to sold out item, make it available
                data['status'] = 'AVAILABLE'
        
        return data


class SubscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for recurring meat orders.
    """
    butcher_name = serializers.CharField(source='butcher.shop_name', read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'butcher', 'butcher_name',
            'meat_item', 'meat_item_name', 'quantity_kg',
            'period', 'delivery_option', 'primary_day_of_week',
            'delivery_time', 'is_sunday_special', 'active',
            'next_run_date', 'delivery_address', 'delivery_phone',
            'subscription_price', 'skip_dates', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'butcher_name', 'created_at', 'updated_at']


class GymSubscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for Fitness-focused subscriptions.
    """
    class Meta:
        model = GymSubscription
        fields = [
            'id', 'user', 'butcher', 'meat_item', 
            'meat_item_name', 'daily_quantity', 'delivery_time',
            'training_goal',
            'active', 'next_delivery_date', 'delivery_address',
            'delivery_phone', 'skip_dates', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class PetSubscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for Pet food subscriptions.
    """
    class Meta:
        model = PetSubscription
        fields = [
            'id', 'user', 'pet_type', 'meat_item',
            'product_name', 'quantity_kg', 'schedule_type',
            'active', 'next_delivery_date', 'delivery_address',
            'skip_dates', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ButcherWasteCollectionSerializer(serializers.ModelSerializer):
    butcher_name = serializers.CharField(source='butcher.shop_name', read_only=True)

    class Meta:
        model = ButcherWasteCollection
        fields = ['id', 'butcher', 'butcher_name', 'waste_type', 'quantity_kg', 'price_per_kg', 'is_available', 'created_at']
        read_only_fields = ['id', 'created_at']


class PetFoodProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetFoodProduct
        fields = ['id', 'name', 'description', 'price', 'image_url', 'ingredients', 'is_vet_approved', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order line items.
    """
    meat_item_name = serializers.CharField(source='meat_item.name', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'meat_item', 'meat_item_name', 'quantity', 'price_at_order', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for Order management.
    Includes nested order items.
    """
    items = OrderItemSerializer(many=True, read_only=True)
    butcher_name = serializers.CharField(source='butcher.shop_name', read_only=True)
    butcher_lat = serializers.DecimalField(source='butcher.latitude', max_digits=10, decimal_places=7, read_only=True)
    butcher_lng = serializers.DecimalField(source='butcher.longitude', max_digits=10, decimal_places=7, read_only=True)
    user_email = serializers.SerializerMethodField()
    butcher_is_official = serializers.BooleanField(source='butcher.is_official', read_only=True)

    def get_user_email(self, obj):
        return obj.user.email if obj.user else "Guest"

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_email', 'butcher', 'butcher_name', 'butcher_is_official',
            'butcher_lat', 'butcher_lng',
            'total_amount', 'status', 'payment_method', 'payment_status',
            'delivery_address', 'delivery_phone', 'cutting_video_url',
            'is_sunday_special', 'sunday_slot', 'status_history', 'created_at', 'updated_at', 
            'items', 'is_cancellable'
        ]
        read_only_fields = ['id', 'user', 'user_email', 'butcher_name', 'total_amount', 'created_at', 'updated_at', 'items']

    def validate_delivery_phone(self, value):
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        if not cleaned.isdigit() or len(cleaned) != 10:
            raise serializers.ValidationError("Invalid phone number")
        return cleaned


class AIChatHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for AI Chat logs.
    """
    class Meta:
        model = AIChatHistory
        fields = ['id', 'user', 'context', 'message', 'response', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for customer reviews.
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'order', 'user', 'user_name', 'butcher', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']
