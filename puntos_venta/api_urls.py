from rest_framework import routers
from .api_views import (
    PuntoVentaViewSet,
    PuntoVentaTurnoViewSet
)

router = routers.DefaultRouter()
router.register(r'puntos_ventas', PuntoVentaViewSet)
router.register(r'puntos_ventas_turnos', PuntoVentaTurnoViewSet)
