from rest_framework import routers
from .api_views import (
    ArqueoCajaViewSet,
    BilleteMonedaViewSet
)

router = routers.DefaultRouter()
router.register(r'arqueos_cajas', ArqueoCajaViewSet)
router.register(r'billetes_monedas', BilleteMonedaViewSet)
