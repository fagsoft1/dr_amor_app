from rest_framework import routers
from .api_views import (
    ImpuestoViewSet,
)

router = routers.DefaultRouter()
router.register(r'contabilidad_impuestos_impuesto', ImpuestoViewSet)
