from rest_framework import routers
from .api_views import (
    PermissionViewSet,
    GroupViewSet
)

router = routers.DefaultRouter()
router.register(r'permisos', PermissionViewSet)
router.register(r'grupos_permisos', GroupViewSet)
