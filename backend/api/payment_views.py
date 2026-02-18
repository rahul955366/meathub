"""
Payment gateway views using Razorpay.
"""
import razorpay
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

# Initialize client
try:
    razorpay_client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    ) if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET else None
except Exception:
    razorpay_client = None

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    """
    Create a Razorpay payment order.
    """
    if not razorpay_client:
        return Response(
            {'error': 'Payment gateway not configured.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    amount = request.data.get('amount')
    if not amount:
        return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        amount_float = float(amount)
        if not (0 < amount_float <= 100000):
             return Response(
                {'error': 'Amount must be between 0 and 1,00,000'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Razorpay expects amount in paise
        order_data = {
            'amount': int(amount_float * 100),
            'currency': 'INR',
            'payment_capture': 1
        }
        
        razorpay_order = razorpay_client.order.create(order_data)
        
        logger.info(f"Payment order created: {razorpay_order['id']} for user {request.user.id}")
        
        return Response({
            'success': True,
            'razorpay_order_id': razorpay_order['id'],
            'amount': amount_float,
            'currency': 'INR',
            'razorpay_key': settings.RAZORPAY_KEY_ID
        })
    
    except (ValueError, TypeError):
        return Response({'error': 'Invalid amount format'}, status=status.HTTP_400_BAD_REQUEST)
    except razorpay.errors.BadRequestError as e:
        logger.error(f"Razorpay error: {e}", exc_info=True)
        return Response({'error': 'Invalid payment request'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Payment creation failed: {e}", exc_info=True)
        return Response(
            {'error': 'Unable to initiate payment.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verify Razorpay payment signature.
    """
    if not razorpay_client:
        return Response(
            {'error': 'Payment gateway not configured.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    required = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
    if not all(k in request.data for k in required):
        return Response({'error': 'Missing payment details'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        data = {k: request.data[k] for k in required}
        razorpay_client.utility.verify_payment_signature(data)
        
        logger.info(f"Payment verified: {data['razorpay_payment_id']} for user {request.user.id}")
        
        return Response({
            'success': True,
            'payment_id': data['razorpay_payment_id'],
            'message': 'Payment verified successfully'
        })
        
    except razorpay.errors.SignatureVerificationError:
        logger.warning(
            f"Signature verification failed for user {request.user.id}"
        )
        return Response(
            {'error': 'Invalid payment signature.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Verification error: {e}", exc_info=True)
        return Response(
            {'error': 'Unable to verify payment.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_status(request, payment_id):
    if not razorpay_client:
         return Response(
            {'error': 'Payment gateway not configured.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    try:
        payment = razorpay_client.payment.fetch(payment_id)
        return Response({
            'success': True,
            'payment_id': payment['id'],
            'amount': payment['amount'] / 100,
            'status': payment['status'],
            'method': payment.get('method'),
            'created_at': payment['created_at']
        })
    except razorpay.errors.BadRequestError:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error fetching status: {e}", exc_info=True)
        return Response(
            {'error': 'Unable to fetch payment status'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
