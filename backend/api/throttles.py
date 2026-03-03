from rest_framework.throttling import UserRateThrottle

class LoginRateThrottle(UserRateThrottle):
    scope = 'login'
    rate = '30/minute'

class RegisterRateThrottle(UserRateThrottle):
    scope = 'register'
    rate = '100/day'

class OrderRateThrottle(UserRateThrottle):
    scope = 'orders'
    rate = '10/minute'
