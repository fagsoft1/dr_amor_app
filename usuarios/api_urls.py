from rest_framework import routers
from .api_views import (
    UsuarioViewSet,
    LoginViewSet
)

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'authentication', LoginViewSet)
