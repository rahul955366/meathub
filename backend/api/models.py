from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.core.exceptions import ValidationError
from decimal import Decimal

# Shared Validators
phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

class UserProfile(models.Model):
    """
    Extended user profile for MeatHub customers.
    Stores personal details and preferences.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='profile',
        help_text="Linked Django User account"
    )
    first_name = models.CharField(max_length=100, help_text="User's first name")
    last_name = models.CharField(max_length=100, blank=True, null=True, help_text="User's last name")
    phone = models.CharField(
        validators=[phone_regex], 
        max_length=17, 
        blank=True, 
        null=True,
        help_text="Contact number for order updates"
    )
    bio = models.TextField(max_length=500, blank=True, null=True, help_text="Short bio or notes")
    profile_image_url = models.URLField(max_length=255, blank=True, null=True, help_text="Link to profile picture")
    gender = models.CharField(
        max_length=10, 
        choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')], 
        blank=True, 
        null=True
    )
    date_of_birth = models.DateField(blank=True, null=True, help_text="For age verification and birthday offers")
    preferred_butcher_id = models.IntegerField(
        blank=True, 
        null=True,
        help_text="ID of the user's favorite butcher"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['phone'], name='idx_phone'),
        ]
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.first_name} {self.last_name or ''} ({self.user.username})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name or ''}".strip()


class Address(models.Model):
    """
    Delivery addresses for users.
    """
    user_profile = models.ForeignKey(
        UserProfile, 
        on_delete=models.CASCADE, 
        related_name='addresses'
    )
    street = models.CharField(max_length=255, help_text="Street address, house number")
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10, help_text="Postal code")
    is_default = models.BooleanField(default=False, help_text="Is this the default delivery address?")

    class Meta:
        verbose_name = 'Address'
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return f"{self.street}, {self.city}"
        
    def save(self, *args, **kwargs):
        """Ensure only one default address per user"""
        if self.is_default:
            Address.objects.filter(user_profile=self.user_profile).update(is_default=False)
        super().save(*args, **kwargs)


class VillageSource(models.Model):
    """
    Source tracking for village-sourced meat (Traceability).
    """
    name = models.CharField(max_length=100, help_text="Name of the village or farm source")
    location = models.CharField(max_length=255, help_text="Geographic location")
    description = models.TextField(blank=True, null=True, help_text="Details about farming practices")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Village Source'
        verbose_name_plural = 'Village Sources'

    def __str__(self):
        return self.name


class Butcher(models.Model):
    """
    Butcher shop profile.
    Connects a user account to a verified butcher shop.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'), 
        ('APPROVED', 'Approved'), 
        ('REJECTED', 'Rejected')
    ]

    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='butcher_profile',
        help_text="User account managing this shop"
    )
    shop_name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(validators=[phone_regex], max_length=17)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='PENDING', choices=STATUS_CHOICES, db_index=True)
    
    # Geolocation for searching nearby butchers
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    service_radius_km = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=5.0,
        help_text="Delivery radius in kilometers"
    )
    
    is_available = models.BooleanField(default=True, help_text="Is the shop currently accepting orders?")
    is_official = models.BooleanField(default=False, help_text="Is this the MeatHub Official Flagship store?")
    image_url = models.URLField(max_length=500, blank=True, null=True)
    opening_time = models.CharField(max_length=20, default="06:00 AM")
    closing_time = models.CharField(max_length=20, default="09:00 PM")
    
    village_source = models.ForeignKey(
        VillageSource, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='butchers',
        help_text="Primary source of meat (if applicable)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['latitude', 'longitude'], name='idx_geo'),
            models.Index(fields=['is_available', 'status'], name='idx_available_status'),
            models.Index(fields=['status', 'created_at'], name='idx_status_created_butcher'),
        ]
        verbose_name = 'Butcher'
        verbose_name_plural = 'Butchers'

    def __str__(self):
        return self.shop_name


class MeatItem(models.Model):
    """
    Inventory items sold by butchers.
    """
    STATUS_CHOICES = [('AVAILABLE', 'Available'), ('SOLD_OUT', 'Sold Out'), ('HIDDEN', 'Hidden')]

    butcher = models.ForeignKey(
        Butcher, 
        on_delete=models.CASCADE, 
        related_name='meat_items',
        help_text="Butcher shop selling this item"
    )
    village_source = models.ForeignKey(
        'VillageSource', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='meat_items',
        help_text="Traceability: where was this meat sourced?"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Price per unit in INR"
    )
    quantity = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text="Available stock quantity"
    )
    category = models.CharField(max_length=100, db_index=True)
    image_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, default='AVAILABLE', choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['butcher', 'status'], name='idx_butcher_status'),
            models.Index(fields=['category', 'status'], name='idx_category_status'),
            models.Index(fields=['butcher', 'price'], name='idx_butcher_price'),
        ]
        constraints = [
            models.CheckConstraint(check=models.Q(price__gte=0), name='positive_price'),
            models.CheckConstraint(check=models.Q(quantity__gte=0), name='positive_quantity')
        ]
        verbose_name = 'Meat Item'
        verbose_name_plural = 'Meat Items'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.butcher.shop_name})"

    @property
    def is_in_stock(self):
        return self.quantity > 0 and self.status == 'AVAILABLE'


class Subscription(models.Model):
    """
    Regular meat delivery subscriptions.
    """
    class DeliveryOption(models.TextChoices):
        SUNDAY_ONLY = 'SUNDAY_ONLY', 'Sunday Only'
        WEDNESDAY_SUNDAY = 'WEDNESDAY_SUNDAY', 'Wednesday & Sunday'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    butcher = models.ForeignKey(Butcher, on_delete=models.CASCADE)
    meat_item = models.ForeignKey(MeatItem, on_delete=models.CASCADE)
    meat_item_name = models.CharField(max_length=100, help_text="Snapshot of item name at subscription time")
    quantity_kg = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.1'))]
    )
    period = models.CharField(max_length=20, help_text="e.g. Weekly, Bi-weekly")
    delivery_option = models.CharField(max_length=20, choices=DeliveryOption.choices)
    primary_day_of_week = models.CharField(max_length=10, default='SUNDAY')
    secondary_day_of_week = models.CharField(max_length=10, blank=True, null=True)
    delivery_time = models.TimeField(null=True, blank=True)
    is_sunday_special = models.BooleanField(default=False, help_text="Sunday 7-9 AM special slot")
    
    active = models.BooleanField(default=True, help_text="Is subscription currently running?")
    next_run_date = models.DateField(db_index=True)
    
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=15)
    subscription_price = models.DecimalField(max_digits=10, decimal_places=2)
    notify_if_not_home = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paused_at = models.DateTimeField(null=True, blank=True)
    last_executed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'active'], name='idx_user_active_sub'),
            models.Index(fields=['next_run_date', 'active'], name='idx_next_run_active'),
            models.Index(fields=['butcher', 'active'], name='idx_butcher_active'),
        ]
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        ordering = ['-next_run_date']

    def __str__(self):
        return f"{self.user.username} - {self.meat_item_name} ({self.period})"
        

class GymSubscription(models.Model):
    """
    Specialized subscription for fitness enthusiasts.
    """
    class ProteinQuantity(models.TextChoices):
        SMALL = 'SMALL', '250g'
        MEDIUM = 'MEDIUM', '500g'
        LARGE = 'LARGE', '1kg'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gym_subscriptions')
    butcher = models.ForeignKey(Butcher, on_delete=models.CASCADE)
    meat_item = models.ForeignKey(MeatItem, on_delete=models.CASCADE)
    meat_item_name = models.CharField(max_length=100)
    daily_quantity = models.CharField(max_length=50, help_text="e.g. 2 servings, 500g, etc.")
    delivery_time = models.TimeField(default='06:00:00')
    active = models.BooleanField(default=True)
    next_delivery_date = models.DateField()
    delivery_address = models.CharField(max_length=255)
    delivery_phone = models.CharField(max_length=15)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Gym Subscription'
        verbose_name_plural = 'Gym Subscriptions'


class PetSubscription(models.Model):
    """
    Specialized subscription for pet owners.
    """
    class PetType(models.TextChoices):
        DOG = 'DOG', 'Dog'
        CAT = 'CAT', 'Cat'

    class ScheduleType(models.TextChoices):
        DAILY = 'DAILY', 'Daily'
        WEEKLY = 'WEEKLY', 'Weekly'
        MONTHLY = 'MONTHLY', 'Monthly'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pet_subscriptions')
    pet_type = models.CharField(max_length=10, choices=PetType.choices)
    meat_item = models.ForeignKey('MeatItem', on_delete=models.CASCADE, null=True, blank=True)
    product_name = models.CharField(max_length=100)
    quantity_kg = models.DecimalField(max_digits=5, decimal_places=2)
    schedule_type = models.CharField(max_length=10, choices=ScheduleType.choices)
    active = models.BooleanField(default=True)
    next_delivery_date = models.DateField()
    delivery_address = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Pet Subscription'
        verbose_name_plural = 'Pet Subscriptions'


class Order(models.Model):
    """
    Customer order tracking purchases and delivery status.
    Orders go through states: PENDING -> CONFIRMED -> PROCESSING -> DELIVERED.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled')
    ]
    
    PAYMENT_CHOICES = [
        ('COD', 'Cash on Delivery'),
        ('ONLINE', 'Online Payment'),
        ('UPI', 'UPI'), 
        ('CARD', 'Card')
    ]

    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,  # Changed from PROTECT to allow guest orders
        null=True,
        blank=True,
        related_name='orders',
        help_text="Customer who placed the order (null for guests)"
    )
    butcher = models.ForeignKey(
        Butcher, 
        on_delete=models.PROTECT, 
        related_name='orders',
        help_text="Butcher fulfilling the order"
    )
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Total order value in INR"
    )
    status = models.CharField(
        max_length=20, 
        default='PENDING', 
        choices=STATUS_CHOICES,
        db_index=True
    )
    payment_method = models.CharField(max_length=20, default='COD', choices=PAYMENT_CHOICES)
    
    # Payment tracking fields
    payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Razorpay payment ID for online payments"
    )
    payment_status = models.CharField(
        max_length=20,
        default='PENDING',
        choices=[
            ('PENDING', 'Pending'),
            ('COMPLETED', 'Completed'),
            ('FAILED', 'Failed'),
            ('REFUNDED', 'Refunded')
        ],
        help_text="Payment completion status"
    )
    cutting_video_url = models.URLField(
        blank=True, 
        null=True, 
        max_length=500, 
        help_text="Link to the cutting proof video (USP)"
    )
    
    # Order status tracking
    status_updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Last time status was updated"
    )
    cancelled_reason = models.TextField(
        blank=True,
        null=True,
        help_text="Reason for cancellation if applicable"
    )
    delivered_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Timestamp when order was delivered"
    )
    
    delivery_address = models.TextField(help_text="Full delivery address")
    delivery_phone = models.CharField(max_length=15, validators=[phone_regex])
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', '-created_at'], name='idx_user_created'),
            models.Index(fields=['status', '-created_at'], name='idx_status_created'),
            models.Index(fields=['butcher', '-created_at'], name='idx_butcher_created'),
            models.Index(fields=['payment_method', 'status'], name='idx_payment_status'),
        ]
        constraints = [
            models.CheckConstraint(check=models.Q(total_amount__gte=0), name='positive_total')
        ]
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        
    def __str__(self):
        return f"Order #{self.id} - {self.user.username} - {self.get_status_display()}"
        
    def clean(self):
        """Validate order logic"""
        if self.total_amount <= 0:
            raise ValidationError("Order total must be positive")
            
    @property
    def is_cancellable(self):
        """Check if order can be cancelled by user"""
        return self.status in ['PENDING', 'CONFIRMED']


class OrderItem(models.Model):
    """
    Individual items within an order.
    Snapshot of product price at time of purchase.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    meat_item = models.ForeignKey(MeatItem, on_delete=models.PROTECT)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price_at_order = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Price per unit at the time of order"
    )
    
    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.quantity}x {self.meat_item.name} (Order #{self.order.id})"
        
    @property
    def subtotal(self):
        return self.price_at_order * self.quantity


class AIChatHistory(models.Model):
    """
    Log of user interactions with the AI assistant.
    """
    CONTEXT_CHOICES = [('PET', 'Pet Nutrition'), ('GYM', 'Gym/Fitness'), ('GENERAL', 'General Shopping')]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    context = models.CharField(max_length=50, default='GENERAL', choices=CONTEXT_CHOICES) 
    message = models.TextField(help_text="User's question")
    response = models.TextField(help_text="AI's response")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'AI Chat History'
        verbose_name_plural = 'AI Chat Histories'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user.username} - {self.context} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
