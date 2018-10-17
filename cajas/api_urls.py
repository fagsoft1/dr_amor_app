from rest_framework import routers
from .api_views import (
    ArqueoCajaViewSet,
    BilleteMonedaViewSet,
    ConceptoOperacionCajaViewSet,
    OperacionCajaViewSet,
)

router = routers.DefaultRouter()
router.register(r'arqueos_cajas', ArqueoCajaViewSet)
router.register(r'billetes_monedas', BilleteMonedaViewSet)
router.register(r'conceptos_operaciones_caja', ConceptoOperacionCajaViewSet)
router.register(r'operaciones_caja', OperacionCajaViewSet)
