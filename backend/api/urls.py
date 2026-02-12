from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

router = DefaultRouter()
router.register(r'butchers', ButcherViewSet)
router.register(r'items', MeatItemViewSet)
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'gym-subscriptions', GymSubscriptionViewSet, basename='gym-subscription')
router.register(r'pet-subscriptions', PetSubscriptionViewSet, basename='pet-subscription')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'profiles', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('create-order/', create_order, name='create-order'),
    path('contextual-ai/', contextual_ai, name='contextual-ai'),
    path('village-sources/', village_sources, name='village-sources'),
]
