from rest_framework import routers
from .api_views import (
    CategoriaAcompananteViewSet
)

router = routers.DefaultRouter()
router.register(r'categorias_acompanante', CategoriaAcompananteViewSet)
