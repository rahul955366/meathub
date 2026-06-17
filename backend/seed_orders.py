import os
import django
from decimal import Decimal
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Butcher, MeatItem, Order, OrderItem, Subscription
from django.utils import timezone
from datetime import timedelta

def seed():
    # Get all butchers
    butchers = Butcher.objects.all()
    if not butchers.exists():
        print("No butchers found")
        return

    # Find first standard user to assign orders to
    user = User.objects.filter(is_staff=False).first()
    if not user:
        # Create a generic test user if none
        user, created = User.objects.get_or_create(username='testuser', defaults={'email': 'test@example.com'})
        if created:
            user.set_password('password123')
            user.save()

    print("Cleaning existing orders and subscriptions...")
    Order.objects.all().delete()
    Subscription.objects.all().delete()

    print("Seeding new orders...")
    statuses = ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED', 'DELIVERED']
    # Create orders for each butcher
    for butcher in butchers:
        items = MeatItem.objects.filter(butcher=butcher)[:3]
        if not items:
            continue
            
        for i in range(5):
            order = Order.objects.create(
                user=user,
                butcher=butcher,
                total_amount=Decimal('0.00'),
                status=random.choice(statuses),
                delivery_address="123 Test Street, Hyderabad",
                delivery_phone="9876543210",
                payment_method="ONLINE",
                payment_status="COMPLETED" if i % 2 == 0 else "PENDING",
                user_lat=Decimal('17.440081'),
                user_lng=Decimal('78.348915'),
            )
            
            # Override created_at for historical data manually since auto_now_add prevents it in create
            Order.objects.filter(id=order.id).update(created_at=timezone.now() - timedelta(days=random.randint(0, 10)))

            total = Decimal('0.00')
            for item in items:
                qty = random.randint(1, 3)
                OrderItem.objects.create(
                    order=order,
                    meat_item=item,
                    quantity=qty,
                    price_at_order=item.price
                )
                total += item.price * qty
            
            order.total_amount = total
            order.save()
            print(f"Created order {order.id} for {butcher.shop_name}")

    print("Seeding subscriptions...")
    for butcher in butchers:
        item = MeatItem.objects.filter(category__iexact='CHICKEN', butcher=butcher).first()
        if item:
            sub = Subscription.objects.create(
                user=user,
                butcher=item.butcher,
                meat_item=item,
                meat_item_name=item.name,
                quantity_kg=Decimal('2.00'),
                period='WEEKLY',
                delivery_option='SUNDAY_ONLY',
                primary_day_of_week='SUNDAY',
                delivery_time='07:00:00',
                active=True,
                next_run_date=timezone.now() + timedelta(days=2),
                delivery_address="123 Test Street, Hyderabad",
                delivery_phone="9876543210",
                subscription_price=item.price * 2
            )
            print(f"Created subscription {sub.id} for {item.butcher.shop_name}")

    print("Done!")

if __name__ == '__main__':
    seed()
