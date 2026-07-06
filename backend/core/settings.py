import os
from pathlib import Path
import environ

env = environ.Env(
    DEBUG=(bool, False)
)

BASE_DIR = Path(__file__).resolve().parent.parent

# Read .env file
env_file = BASE_DIR / '.env'
if env_file.exists():
    environ.Env.read_env(str(env_file))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# Validate SECRET_KEY
if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY must be set in environment variables. "
        "Generate one with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'"
    )

if len(SECRET_KEY) < 50:
    raise ValueError("SECRET_KEY must be at least 50 characters long for security")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=False)

if DEBUG:
    ALLOWED_HOSTS = ['*']
    CORS_ALLOW_ALL_ORIGINS = True
else:
    ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])
    if not ALLOWED_HOSTS:
        raise ValueError("ALLOWED_HOSTS must be set in production")
    
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[])
    if not CORS_ALLOWED_ORIGINS:
        raise ValueError("CORS_ALLOWED_ORIGINS must be set in production")

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'whitenoise.runserver_nostatic',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_ratelimit',
    'api',
    'django_crontab',
]

CRONJOBS = [
    ('0 6 * * *', 'django.core.management.call_command', ['process_subscriptions'])
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 500,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '1000/day',
        'user': '5000/day',
        'login': '30/minute', 
        'register': '100/day',
    },
    'EXCEPTION_HANDLER': 'api.exceptions.custom_exception_handler'
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database
DATABASES = {
    'default': env.db('DATABASE_URL', default='postgres://meathub_user:meathub_password@db:5432/meathub')
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICSFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Google Gemini API Key
GEMINI_API_KEY = env('GEMINI_API_KEY', default='')

if not GEMINI_API_KEY and not DEBUG:
    raise ValueError("GEMINI_API_KEY must be set in production")

# Silence ratelimit checks for development/single-instance
SILENCED_SYSTEM_CHECKS = ['django_ratelimit.E003', 'django_ratelimit.W001']

# Email Configuration (for password reset)
EMAIL_BACKEND = env('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='noreply@meathub.com')

# Password reset token expiry (2 hours = 7200 seconds)
PASSWORD_RESET_TIMEOUT = 7200

# Frontend URL for password reset links
FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:3000')

# Razorpay Configuration (for payment gateway)
RAZORPAY_KEY_ID = env('RAZORPAY_KEY_ID', default='')
RAZORPAY_KEY_SECRET = env('RAZORPAY_KEY_SECRET', default='')

if not DEBUG and not (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET):
    import warnings
    warnings.warn("Razorpay credentials not set. Online payments will not work in production.")

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG' if DEBUG else 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'api': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': True,
        },
    },
}
