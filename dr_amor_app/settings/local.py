from .base import *
from django.core.exceptions import ImproperlyConfigured

print('Running Local')
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
    'silk',
]

INSTALLED_APPS = INSTALLED_APPS + THIRD_PART_APPS
MIDDLEWARE += [
    'silk.middleware.SilkyMiddleware',
]

STATICFILES_DIRS = [
    os.path.normpath(os.path.join(SITE_ROOT, "static"))
]

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

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'assets/bundles/deve/',
        'STATS_FILE': os.path.join(SITE_ROOT, 'webpack-stats.json'),
    }
}

if not str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_IS_LOCAL")):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = get_secret("EMAIL_SERVER", "EMAIL_HOST")

EMAIL_HOST_PASSWORD = get_secret("EMAIL_SERVER", "EMAIL_HOST_PASSWORD")

EMAIL_HOST_USER = get_secret("EMAIL_SERVER", "EMAIL_HOST_USER")

EMAIL_PORT = get_secret("EMAIL_SERVER", "EMAIL_PORT")

EMAIL_SUBJECT_PREFIX = '[%s] ' % 'Dr. Amor'

EMAIL_USE_TLS = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_TLS"))

SERVER_EMAIL = get_secret("EMAIL_SERVER", "SERVER_EMAIL")

EMAIL_USE_SSL = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_SSL"))

DEFAULT_FROM_EMAIL = get_secret("EMAIL_SERVER", "DEFAULT_FROM_EMAIL")

CHANNEL_LAYERS = {
    "default": {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        }
    },
}

KEY_ENCRY = '$3ST_43sl4C0ntr4_s3n4m4_sFu3rt3$'
VECTOR_ENCRY = 'n$3rt3$4m4_ntr4_'
