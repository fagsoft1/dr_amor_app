from rest_framework import routers
from .api_views import (
    CategoriaViewSet,
    CategoriaDosViewSet,
    UnidadProductoViewSet,
    ProductoViewSet
)

router = routers.DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'productos_unidades', UnidadProductoViewSet)
router.register(r'productos_categorias', CategoriaViewSet)
router.register(r'productos_categorias_dos', CategoriaDosViewSet)
