from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import DatoGeneralSerializer
from .models import DatoGeneral


class ConfiguracionAplicacionViewSet(viewsets.ViewSet):
    def list(self, request):
        from .services import dato_general_crear_actualizar
        datos_generales = DatoGeneral.objects.first() if DatoGeneral.objects.exists() else dato_general_crear_actualizar()
        return Response({
            "datos_generales": DatoGeneralSerializer(datos_generales, context={'request': request}).data,
        })


class DatoGeneralViewSet(ConfiguracionAplicacionViewSet, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = DatoGeneral.objects.all()
    serializer_class = DatoGeneralSerializer

    def create(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo crear no disponible'})

    def destroy(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo eliminar no disponible'})

    def list(self, request):
        return super().list(request)
