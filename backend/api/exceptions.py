from rest_framework.views import exception_handler
from rest_framework.exceptions import (
    Throttled, ValidationError, PermissionDenied, 
    NotAuthenticated, AuthenticationFailed, APIException
)
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, DjangoPermissionDenied):
            return Response(
                {'error': 'You do not have permission to perform this action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Log unhandled exceptions
        logger.error(f"Unhandled exception in {context['view'].__class__.__name__}: {exc}", exc_info=True)
        return None  # Let Django handle 500

    if response is not None:
        payload = {
            'status_code': response.status_code,
            'error': 'An error occurred',
            'details': response.data
        }

        if isinstance(exc, Throttled):
            payload['error'] = 'Too Many Requests'
            payload['message'] = f'Request limit exceeded. Retry in {int(exc.wait)}s.'
            payload['retry_after'] = int(exc.wait)
        
        elif isinstance(exc, ValidationError):
            payload['error'] = 'Validation Error'
            payload['message'] = 'The data provided is invalid.'
            payload['details'] = response.data

        elif isinstance(exc, (PermissionDenied, DjangoPermissionDenied)):
            payload['error'] = 'Permission Denied'
            payload['message'] = 'You do not have permission to perform this action.'

        elif isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
            payload['error'] = 'Authentication Failed'
            payload['message'] = 'Authentication credentials were not provided or are invalid.'

        elif isinstance(exc, Http404):
            payload['error'] = 'Not Found'
            payload['message'] = 'The requested resource was not found.'

        elif isinstance(exc, APIException):
            payload['error'] = getattr(exc, 'default_detail', 'API Error')
            if hasattr(exc, 'detail'):
                 payload['message'] = exc.detail

        response.data = payload

    return response
