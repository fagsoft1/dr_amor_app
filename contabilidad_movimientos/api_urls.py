from rest_framework import routers
from .api_views import (
    AsientoContableViewSet,
    ApunteContableViewSet,
)

router = routers.DefaultRouter()
router.register(r'contabilidad_movimientos_asientos_contables', AsientoContableViewSet)
router.register(r'contabilidad_movimientos_apuntes_contables', ApunteContableViewSet)
