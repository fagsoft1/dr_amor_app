from rest_framework import routers
from .api_views import (
    VentaProductoViewSet,
    VentaProductoDetalleViewSet
)

router = routers.DefaultRouter()
router.register(r'ventas_productos', VentaProductoViewSet)
router.register(r'ventas_productos_detalles', VentaProductoDetalleViewSet)
