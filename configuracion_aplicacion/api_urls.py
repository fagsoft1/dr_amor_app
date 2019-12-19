from rest_framework import routers
from .api_views import DatoGeneralViewSet, ConfiguracionAplicacionViewSet, ServerInformationViewSet

router = routers.DefaultRouter()
router.register(r'configuracion_aplicacion', ConfiguracionAplicacionViewSet, basename='configuracion')
router.register(r'configuracion_aplicacion_datos_generales', DatoGeneralViewSet)
router.register(r'configuracion_aplicacion_server_information', ServerInformationViewSet, basename='server_information')
