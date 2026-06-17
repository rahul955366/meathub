"""
Order management views for butchers and admins.
"""
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, Butcher
import logging

logger = logging.getLogger(__name__)

STATUS_TRANSITIONS = {
    'PENDING': {'CONFIRMED', 'CANCELLED'},
    'CONFIRMED': {'PROCESSING', 'CANCELLED'},
    'PROCESSING': {'SHIPPED', 'CANCELLED'},
    'SHIPPED': {'DELIVERED', 'CANCELLED'},
    'DELIVERED': set(),
    'CANCELLED': set()
}

def _has_permission(user, order):
    if user.is_staff or user.is_superuser:
        return True
    try:
        butcher = Butcher.objects.get(user=user)
        return order.butcher_id == butcher.id
    except Butcher.DoesNotExist:
        return False

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.select_related('butcher', 'user').get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if not _has_permission(request.user, order):
        return Response(
            {'error': 'Permission denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    new_status = request.data.get('status', '').upper()
    if not new_status:
        return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    valid_statuses = {choice[0] for choice in Order.STATUS_CHOICES}
    if new_status not in valid_statuses:
        return Response(
            {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    current_status = order.status
    if new_status == current_status:
        return Response({'message': f'Order is already {current_status}'})
    
    allowed = STATUS_TRANSITIONS.get(current_status, set())
    if new_status not in allowed:
        return Response(
            {'error': f'Invalid transition from {current_status} to {new_status}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Update logic
    old_status = order.status
    order.status = new_status
    order.status_updated_at = timezone.now()
    
    if new_status == 'CANCELLED':
        reason = request.data.get('cancelled_reason', '').strip()
        # Make reason optional with a sensible fallback
        order.cancelled_reason = reason if reason else 'Cancelled by shop'
        if order.payment_method != 'COD':
            order.payment_status = 'REFUNDED'
    
    elif new_status == 'DELIVERED':
        order.delivered_at = timezone.now()
        
    order.save()
    
    # Send notifications
    try:
        from .notifications import notify_order_status
        notify_order_status(order)
    except Exception as e:
        logger.error(f"Notification failed for order #{order.id}: {e}")

    logger.info(f"Order #{order.id} status: {old_status} -> {new_status} by {request.user.id}")
    
    return Response({
        'success': True,
        'order_id': order.id,
        'old_status': old_status,
        'new_status': new_status,
        'status_updated_at': order.status_updated_at.isoformat(),
        'delivered_at': order.delivered_at.isoformat() if order.delivered_at else None,
        'message': f'Order updated to {new_status}'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_history(request, order_id):
    try:
        order = Order.objects.select_related('butcher', 'user').prefetch_related('items__meat_item').get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Permission check: Admin, Butcher(owner), or User(owner)
    is_owner = order.user_id is not None and order.user_id == request.user.id
    if not (is_owner or _has_permission(request.user, order)):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    items_data = [{
        'meat_item': item.meat_item.name,
        'quantity': item.quantity,
        'price_at_order': str(item.price_at_order),
        'subtotal': str(item.subtotal)
    } for item in order.items.all()]
    
    return Response({
        'order_id': order.id,
        'user': {
            'id': order.user.id if order.user else None,
            'username': order.user.username if order.user else 'Guest',
            'email': order.user.email if order.user else ''
        },
        'butcher': {
            'id': order.butcher.id,
            'shop_name': order.butcher.shop_name
        },
        'total_amount': str(order.total_amount),
        'status': order.status,
        'payment_method': order.payment_method,
        'payment_status': order.payment_status,
        'payment_id': order.payment_id,
        'delivery_address': order.delivery_address,
        'delivery_phone': order.delivery_phone,
        'items': items_data,
        'created_at': order.created_at.isoformat(),
        'status_updated_at': order.status_updated_at.isoformat() if order.status_updated_at else None,
        'delivered_at': order.delivered_at.isoformat() if order.delivered_at else None,
        'cancelled_reason': order.cancelled_reason,
        'is_cancellable': order.is_cancellable
    })
