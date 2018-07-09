from rest_framework import routers
from .api_views import (
    CategoriaAcompananteViewSet,
    FraccionTiempoViewSet,
    CategoriaFraccionTiempoViewSet
)

router = routers.DefaultRouter()
router.register(r'categorias_acompanante', CategoriaAcompananteViewSet)
router.register(r'fracciones_tiempo_acompanante', FraccionTiempoViewSet)
router.register(r'categorias_fracciones_tiempo_acompanante', CategoriaFraccionTiempoViewSet)
