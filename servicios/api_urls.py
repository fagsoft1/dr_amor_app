from rest_framework import routers
from .api_views import (
    ServicioViewSet
)

router = routers.DefaultRouter()
router.register(r'servicios', ServicioViewSet)
