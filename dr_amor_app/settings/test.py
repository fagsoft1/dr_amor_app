print('Usando test.py settings')
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]
SECRET_KEY = '1111111111'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
