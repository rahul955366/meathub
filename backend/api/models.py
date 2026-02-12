from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)
    profile_image_url = models.URLField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')], blank=True, null=True)
    date_of_birth = models.DateTimeField(blank=True, null=True)
    preferred_butcher_id = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Address(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='addresses')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)

class VillageSource(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Butcher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='butcher_profile')
    shop_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='PENDING', choices=[('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')])
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    service_radius_km = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    is_available = models.BooleanField(default=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    opening_time = models.CharField(max_length=20, default="06:00 AM")
    closing_time = models.CharField(max_length=20, default="09:00 PM")
    village_source = models.ForeignKey(VillageSource, on_delete=models.SET_NULL, null=True, blank=True, related_name='butchers')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.shop_name

class MeatItem(models.Model):
    butcher = models.ForeignKey(Butcher, on_delete=models.CASCADE, related_name='meat_items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    category = models.CharField(max_length=100)
    image_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, default='AVAILABLE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Subscription(models.Model):
    class DeliveryOption(models.TextChoices):
        SUNDAY_ONLY = 'SUNDAY_ONLY', 'Sunday Only'
        WEDNESDAY_SUNDAY = 'WEDNESDAY_SUNDAY', 'Wednesday & Sunday'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    butcher = models.ForeignKey(Butcher, on_delete=models.CASCADE)
    meat_item = models.ForeignKey(MeatItem, on_delete=models.CASCADE)
    meat_item_name = models.CharField(max_length=100)
    quantity_kg = models.DecimalField(max_digits=5, decimal_places=2)
    period = models.CharField(max_length=20) # Weekly, Bi-weekly, Monthly
    delivery_option = models.CharField(max_length=20, choices=DeliveryOption.choices)
    primary_day_of_week = models.CharField(max_length=10, default='SUNDAY')
    secondary_day_of_week = models.CharField(max_length=10, blank=True, null=True)
    delivery_time = models.TimeField(null=True, blank=True)
    is_sunday_special = models.BooleanField(default=False) # Sunday 7-9 AM special
    active = models.BooleanField(default=True)
    next_run_date = models.DateField()
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=15)
    subscription_price = models.DecimalField(max_digits=10, decimal_places=2)
    notify_if_not_home = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paused_at = models.DateTimeField(null=True, blank=True)
    last_executed_at = models.DateTimeField(null=True, blank=True)

class GymSubscription(models.Model):
    class ProteinQuantity(models.TextChoices):
        SMALL = 'SMALL', '250g'
        MEDIUM = 'MEDIUM', '500g'
        LARGE = 'LARGE', '1kg'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gym_subscriptions')
    butcher = models.ForeignKey(Butcher, on_delete=models.CASCADE)
    meat_item = models.ForeignKey(MeatItem, on_delete=models.CASCADE)
    meat_item_name = models.CharField(max_length=100)
    daily_quantity = models.CharField(max_length=10, choices=ProteinQuantity.choices)
    delivery_time = models.TimeField(default='06:00:00')
    active = models.BooleanField(default=True)
    next_delivery_date = models.DateField()
    delivery_address = models.CharField(max_length=255)
    delivery_phone = models.CharField(max_length=15)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PetSubscription(models.Model):
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

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    butcher = models.ForeignKey(Butcher, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='PENDING')
    payment_method = models.CharField(max_length=20, default='COD', choices=[('COD', 'Cash on Delivery'), ('UPI', 'UPI'), ('CARD', 'Card')])
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    meat_item = models.ForeignKey(MeatItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_at_order = models.DecimalField(max_digits=10, decimal_places=2)

class AIChatHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    context = models.CharField(max_length=50, default='GENERAL') # PET, GYM, GENERAL
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
