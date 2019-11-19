from rest_framework import routers
from .api_views import DatoGeneralViewSet, ConfiguracionAplicacionViewSet

router = routers.DefaultRouter()
router.register(r'configuracion_aplicacion', ConfiguracionAplicacionViewSet, basename='configuracion')
router.register(r'configuracion_aplicacion_datos_generales', DatoGeneralViewSet)
