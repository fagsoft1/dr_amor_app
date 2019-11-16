from rest_framework import routers
from .api_views import (
    TipoComprobanteContableEmpresaViewSet,
    TipoComprobanteContableViewSet
)

router = routers.DefaultRouter()
router.register(r'contabilidad_comprobantes_tipos', TipoComprobanteContableViewSet)
router.register(r'contabilidad_comprobantes_tipos_empresas', TipoComprobanteContableEmpresaViewSet)
