from rest_framework import routers
from .api_views import (
    PuntoVentaViewSet,
)

router = routers.DefaultRouter()
router.register(r'puntos_ventas', PuntoVentaViewSet)
