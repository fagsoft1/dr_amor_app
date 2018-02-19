from .base import *
from django.core.exceptions import ImproperlyConfigured

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


if get_secret("EMAIL_SERVER", "EMAIL_IS_LOCAL"):
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
