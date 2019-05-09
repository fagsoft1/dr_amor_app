from rest_framework import routers
from .api_views import (
    ImpuestoGrupoViewSet,
    ImpuestoViewSet,
)

router = routers.DefaultRouter()
router.register(r'contabilidad_impuestos_impuesto', ImpuestoViewSet)
router.register(r'contabilidad_impuestos_impuesto_grupo', ImpuestoGrupoViewSet)
