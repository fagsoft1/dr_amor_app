from .base import *
try:
    with open("secretsLocal.json") as f:
        from .local import *
except:
    from .production import *
