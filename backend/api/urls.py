from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    ButcherViewSet, MeatItemViewSet, SubscriptionViewSet,
    GymSubscriptionViewSet, PetSubscriptionViewSet, OrderViewSet,
    UserProfileViewSet, RegisterView, create_order, contextual_ai,
    village_sources, MyTokenObtainPairView, nearby_butchers, official_items,
    upload_order_video, ReviewViewSet, ButcherWasteCollectionViewSet,
    PetFoodProductViewSet, me, redeem_loyalty_points
)
from .password_reset_views import request_password_reset, confirm_password_reset
from .payment_views import create_payment_order, verify_payment, get_payment_status
from .order_management_views import update_order_status, get_order_history

router = DefaultRouter()
router.register(r'butchers', ButcherViewSet, basename='butcher')
router.register(r'items', MeatItemViewSet, basename='meat-item')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'gym-subscriptions', GymSubscriptionViewSet, basename='gym-subscription')
router.register(r'pet-subscriptions', PetSubscriptionViewSet, basename='pet-subscription')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'waste-collection', ButcherWasteCollectionViewSet, basename='waste-collection')
router.register(r'pet-food-products', PetFoodProductViewSet, basename='pet-food-product')

urlpatterns = [
    path('butchers/nearby/', nearby_butchers, name='nearby-butchers'),
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/me/', me, name='auth_me'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/password-reset/request/', request_password_reset, name='password_reset_request'),
    path('auth/password-reset/confirm/', confirm_password_reset, name='password_reset_confirm'),
    path('payment/create-order/', create_payment_order, name='payment_create_order'),
    path('payment/verify/', verify_payment, name='payment_verify'),
    path('payment/status/<str:payment_id>/', get_payment_status, name='payment_status'),
    path('orders/<int:order_id>/update-status/', update_order_status, name='order_update_status'),
    path('orders/<int:order_id>/upload-video/', upload_order_video, name='upload_video'),
    path('orders/<int:order_id>/history/', get_order_history, name='order_history'),
    path('create-order/', create_order, name='create-order'),
    path('official-items/', official_items, name='official-items'),
    path('contextual-ai/', contextual_ai, name='contextual-ai'),
    path('village-sources/', village_sources, name='village-sources'),
    path('auth/redeem-points/', redeem_loyalty_points, name='redeem_points'),
]
