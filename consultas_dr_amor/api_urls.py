from rest_framework import routers
from .api_views import (
    ConsultaVentasEmpresaViewSet
)

router = routers.DefaultRouter()
router.register(r'consulta_ventas_empresas', ConsultaVentasEmpresaViewSet)
