from .base import *
from django.core.exceptions import ImproperlyConfigured
print('Usando test.py local')
############### SECRET FILE
import json

with open("secretsLocal.json") as f:
    secrets = json.loads(f.read())


def get_secret(setting, variable, secrets=secrets):
    """ Get the environment setting or return exception """
    try:
        return secrets[setting][variable]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)


if str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_IS_LOCAL")):
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

THIRD_PART_APPS = [
    'debug_toolbar',
]

INSTALLED_APPS = INSTALLED_APPS + THIRD_PART_APPS

########## STATIC FILE CONFIGURATION
STATICFILES_DIRS = [
    os.path.normpath(os.path.join(SITE_ROOT, "static"))
]
########## END STATIC FILE CONFIGURATION

########## DEBUG TOOLBAR CONFIGURATION CONFIGURATION
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]
INTERNAL_IPS = '127.0.0.1'
########## END TOOLBAR CONFIGURATION CONFIGURATION

########## DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': get_secret("DATABASE_LOCAL", "ENGINE"),
        'NAME': get_secret("DATABASE_LOCAL", "NAME"),
        'USER': get_secret("DATABASE_LOCAL", "USER"),
        'PASSWORD': get_secret("DATABASE_LOCAL", "PASSWORD"),
        'HOST': get_secret("DATABASE_LOCAL", "HOST"),
        'PORT': get_secret("DATABASE_LOCAL", "PORT"),
        'ATOMIC_REQUESTS': True
    }
}
########## END DATABASE CONFIGURATION

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'assets/bundles/deve/',
        'STATS_FILE': os.path.join(SITE_ROOT, 'webpack-stats.json'),
    }
}

########## EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend

# 'EMAIL_IS_LOCAL'
if not str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_IS_LOCAL")):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = get_secret("EMAIL_SERVER", "EMAIL_HOST")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-host-password
EMAIL_HOST_PASSWORD = get_secret("EMAIL_SERVER", "EMAIL_HOST_PASSWORD")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-host-user
EMAIL_HOST_USER = get_secret("EMAIL_SERVER", "EMAIL_HOST_USER")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = get_secret("EMAIL_SERVER", "EMAIL_PORT")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-subject-prefix
EMAIL_SUBJECT_PREFIX = '[%s] ' % 'Dr. Amor'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-use-tls
EMAIL_USE_TLS = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_TLS"))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#server-email
SERVER_EMAIL = get_secret("EMAIL_SERVER", "SERVER_EMAIL")

EMAIL_USE_SSL = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_SSL"))

DEFAULT_FROM_EMAIL = get_secret("EMAIL_SERVER", "DEFAULT_FROM_EMAIL")

########## END EMAIL CONFIGURATION

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
        "ROUTING": "dr_amor_app.ws_routing.channel_routing",
    },
}

KEY_ENCRY = '$3ST_43sl4C0ntr4_s3n4m4_sFu3rt3$'
VECTOR_ENCRY = 'n$3rt3$4m4_ntr4_'
