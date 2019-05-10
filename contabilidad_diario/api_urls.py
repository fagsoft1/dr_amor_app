from rest_framework import routers
from .api_views import (
    DiarioContableViewSet
)

router = routers.DefaultRouter()
router.register(r'contabilidad_diario_diarios_contables', DiarioContableViewSet)
