from rest_framework import routers
from .api_views import (
    CuentaContableViewSet
)

router = routers.DefaultRouter()
router.register(r'contabilidad_cuentas_contables', CuentaContableViewSet)
