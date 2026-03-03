import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

def send_whatsapp_notification(phone, message):
    """
    Service for WhatsApp notifications using Twilio.
    """
    logger.info(f"WHATSAPP_NOTIFICATION | To: {phone} | Msg: {message}")
    
    account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
    auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
    from_number = getattr(settings, 'TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')

    if not all([account_sid, auth_token]):
        logger.warning("Twilio credentials not configured. Skipping real notification.")
        return True

    try:
        from twilio.rest import Client
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            from_=from_number,
            body=message,
            to=f'whatsapp:{phone}'
        )
        return True
    except Exception as e:
        logger.error(f"WhatsApp failed: {e}")
        return False

def check_stock_reminders():
    """
    Issue #17: Placeholder for 3-hour stock reminder logic.
    Would be called by a Celery task or Cron job in production.
    """
    from .models import Butcher
    logger.info("STOCK_REMINDER_CRON | Checking for shops requiring stock refresh...")
    # Logic: Find butchers who haven't updated stock in 3 hours
    # and send them a WhatsApp nudge.
    return True

def send_sms_notification(phone, message):
    """
    Placeholder service for SMS notifications.
    """
    logger.info(f"SMS_NOTIFICATION | To: {phone} | Msg: {message}")
    return True

def notify_order_status(order):
    """
    Sends notification when order status changes.
    """
    msg = f"Meathub Update: Order #{order.id} is now {order.get_status_display()}."
    send_whatsapp_notification(order.delivery_phone, msg)
    send_sms_notification(order.delivery_phone, msg)
