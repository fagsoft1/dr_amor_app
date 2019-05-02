from rest_framework import routers
from .api_views import (
    LiquidacionCuentaViewSet
)

router = routers.DefaultRouter()
router.register(r'liquidaciones_cuentas', LiquidacionCuentaViewSet)
