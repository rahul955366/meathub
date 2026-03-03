from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Subscription, GymSubscription, PetSubscription, Order, OrderItem, Butcher
from dateutil.relativedelta import relativedelta
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Automatically processes active subscriptions and creates recurring orders'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        logger.info(f"Starting subscription processing for {today}")
        
        # 1. Process General Subscriptions
        general_subs = Subscription.objects.filter(active=True, next_run_date__lte=today)
        for sub in general_subs:
            try:
                today_str = today.isoformat()
                skip_dates = getattr(sub, 'skip_dates', [])
                
                if today_str in skip_dates:
                    logger.info(f"Skipping general sub {sub.id} - {today_str} is in skip list")
                else:
                    self.create_order_from_sub(sub, 'general')
                
                # Update next run date (Always update so it doesn't get stuck)
                if 'WEEKLY' in sub.period.upper():
                    sub.next_run_date += relativedelta(weeks=1)
                elif 'MONTHLY' in sub.period.upper():
                    sub.next_run_date += relativedelta(months=1)
                else:
                    sub.next_run_date += relativedelta(days=7) # Default weekly
                
                sub.last_executed_at = timezone.now()
                sub.save()
                logger.info(f"Processed general sub {sub.id} update for user {sub.user.username}")
            except Exception as e:
                logger.error(f"Failed to process sub {sub.id}: {str(e)}")

        # 2. Process Gym Subscriptions (Daily 6 AM Vision)
        gym_subs = GymSubscription.objects.filter(active=True, next_delivery_date__lte=today)
        for sub in gym_subs:
            try:
                today_str = today.isoformat()
                skip_dates = getattr(sub, 'skip_dates', [])
                
                if today_str in skip_dates:
                    logger.info(f"Skipping gym sub {sub.id} - {today_str} in skip list")
                else:
                    self.create_order_from_sub(sub, 'gym')
                
                sub.next_delivery_date += relativedelta(days=1)
                sub.save()
                logger.info(f"Processed gym sub {sub.id} update for user {sub.user.username}")
            except Exception as e:
                logger.error(f"Failed to process gym sub {sub.id}: {str(e)}")

        # 3. Process Pet Subscriptions
        pet_subs = PetSubscription.objects.filter(active=True, next_delivery_date__lte=today)
        for sub in pet_subs:
            try:
                today_str = today.isoformat()
                skip_dates = getattr(sub, 'skip_dates', [])
                
                if today_str in skip_dates:
                    logger.info(f"Skipping pet sub {sub.id} - {today_str} in skip list")
                else:
                    self.create_order_from_sub(sub, 'pet')
                
                if sub.schedule_type == 'DAILY':
                    sub.next_delivery_date += relativedelta(days=1)
                elif sub.schedule_type == 'WEEKLY':
                    sub.next_delivery_date += relativedelta(weeks=1)
                else:
                    sub.next_delivery_date += relativedelta(months=1)
                sub.save()
                logger.info(f"Processed pet sub {sub.id} update for user {sub.user.username}")
            except Exception as e:
                logger.error(f"Failed to process pet sub {sub.id}: {str(e)}")

    def create_order_from_sub(self, sub, sub_type):
        """Helper to create an Order and OrderItem from a subscription."""
        
        # Determine butcher
        butcher = getattr(sub, 'butcher', None)
        if not butcher or (sub_type in ['gym', 'pet']):
            # For Gym/Pet, prioritize flagship if missing or as per vision
            flagship = Butcher.objects.filter(is_official=True).first()
            if flagship:
                butcher = flagship
        
        if not butcher:
             raise Exception("No suitable butcher found for order fulfillment")

        # Determine price and details
        total_amount = getattr(sub, 'subscription_price', Decimal('0.00'))
        # If Gym/Pet sub doesn't have a fixed execution price, we might need a default or use meat item price
        if total_amount == 0 and sub.meat_item:
            qty = getattr(sub, 'quantity_kg', 1)
            # Handle Gym string quantity if needed, but for now simple fallback
            if isinstance(qty, str): 
                qty = Decimal('0.5') # Fallback for "500g"
            total_amount = sub.meat_item.price * Decimal(str(qty))

        is_sunday = False
        if sub_type == 'general' and getattr(sub, 'delivery_option', '') == 'SUNDAY_ONLY':
            is_sunday = True

        order = Order.objects.create(
            user=sub.user,
            butcher=butcher,
            total_amount=total_amount,
            status='CONFIRMED', # Subscriptions are auto-confirmed
            payment_method='COD', # Defaulting to COD for now as per user snippet
            payment_status='PENDING',
            delivery_address=sub.delivery_address,
            delivery_phone=getattr(sub, 'delivery_phone', '0000000000'),
            is_sunday_special=is_sunday
        )

        if sub.meat_item:
            OrderItem.objects.create(
                order=order,
                meat_item=sub.meat_item,
                quantity=1, # One "cycle" or "serving"
                price_at_order=total_amount
            )
        
        return order
