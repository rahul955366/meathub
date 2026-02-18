from rest_framework.throttling import UserRateThrottle

class LoginRateThrottle(UserRateThrottle):
    scope = 'login'
    rate = '5/minute'

class RegisterRateThrottle(UserRateThrottle):
    scope = 'register'
    rate = '3/hour'

class OrderRateThrottle(UserRateThrottle):
    scope = 'orders'
    rate = '10/minute'
