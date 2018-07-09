from rest_framework import routers
from .api_views import (
    ServicioViewSet,
    VentaServicioViewSet
)

router = routers.DefaultRouter()
router.register(r'servicios', ServicioViewSet)
router.register(r'ventas_servicios', VentaServicioViewSet)
