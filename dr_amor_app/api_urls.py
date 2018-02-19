from .api_routers import DefaultRouter
from permisos.api_urls import router as permisos_router
from usuarios.api_urls import router as usuarios_router

router = DefaultRouter()
router.extend(permisos_router)
router.extend(usuarios_router)
