from rest_framework import routers
from .api_views import (
    UsuarioViewSet
)

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
