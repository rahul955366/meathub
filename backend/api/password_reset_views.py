"""
Password reset views for MeatHub API.
"""
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Request a password reset email.
    """
    email = request.data.get('email', '').strip().lower()
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        
        subject = "Reset Your MeatHub Password"
        message = f"""Hi {user.first_name},

You requested to reset your password for your MeatHub account.

Click the link below to reset your password:
{reset_url}

This link will expire in 2 hours.

If you didn't request this, please ignore this email.

Thanks,
MeatHub Team
"""
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            logger.info(f"Password reset email sent to: {user.email}")
        except Exception as e:
            logger.error(f"Failed to send email to {user.email}: {e}")
            return Response(
                {'error': 'Unable to send reset email.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'message': 'Password reset email sent. Please check your inbox.'
        })
    
    except User.DoesNotExist:
        # Prevent email enumeration by returning success even if email not found
        logger.info(f"Password reset requested for non-existent email: {email}")
        return Response({
            'success': True,
            'message': 'If that email exists in our system, we sent reset instructions.'
        })
    except Exception as e:
        logger.error(f"Password reset error: {e}", exc_info=True)
        return Response(
            {'error': 'Unable to process request.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    """
    Confirm password reset with token and set new password.
    """
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not all([uid, token, new_password]):
        return Response(
            {'error': 'Missing required fields (uid, token, new_password)'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        if not default_token_generator.check_token(user, token):
            logger.warning(f"Invalid reset token for user: {user.email}")
            return Response(
                {'error': 'Invalid or expired reset link.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate password strength
        try:
            validate_password(new_password, user)
        except DjangoValidationError as e:
            return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not (any(c.isalpha() for c in new_password) and any(c.isdigit() for c in new_password)):
             return Response(
                {'error': 'Password must contain both letters and numbers'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        logger.info(f"Password reset completed for: {user.email}")
        
        # Confirmation email
        try:
            send_mail(
                "Your MeatHub Password Has Been Reset",
                f"Hi {user.first_name},\n\nYour password has been successfully reset.\n\nThanks,\nMeatHub Team",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception:
            pass
        
        return Response({
            'success': True,
            'message': 'Password reset successful. You can now login.'
        })
    
    except (User.DoesNotExist, ValueError, TypeError):
        logger.warning(f"Invalid reset attempt with uid: {uid}")
        return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Reset confirmation error: {e}", exc_info=True)
        return Response(
            {'error': 'Unable to reset password.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
