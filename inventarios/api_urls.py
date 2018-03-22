from rest_framework import routers
from .api_views import (
    BodegaViewSet,
    MovimientoInventarioViewSet,
    MovimientoInventarioDetalleViewSet
)

router = routers.DefaultRouter()
router.register(r'bodegas', BodegaViewSet)
router.register(r'movimiento_inventario', MovimientoInventarioViewSet)
router.register(r'movimiento_inventario_detalle', MovimientoInventarioDetalleViewSet)