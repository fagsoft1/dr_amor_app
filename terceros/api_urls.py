from rest_framework import routers
from .api_views import (
    ColaboradorViewSet,
    AcompananteViewSet,
    ProveedorViewSet,
    TerceroViewSet
)

router = routers.DefaultRouter()
router.register(r'terceros', TerceroViewSet)
router.register(r'acompanantes', AcompananteViewSet)
router.register(r'colaboradores', ColaboradorViewSet)
router.register(r'proveedores', ProveedorViewSet)
