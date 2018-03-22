from rest_framework import routers
from .api_views import (
    EmpresaViewSet
)

router = routers.DefaultRouter()
router.register(r'empresas', EmpresaViewSet)
