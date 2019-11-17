from rest_framework import viewsets

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    TipoComprobanteContableSerializer,
    TipoComprobanteContableEmpresaSerializer,
    TipoComprobanteContableDetalleSerializer
)
from .models import (
    TipoComprobanteContable,
    TipoComprobanteContableEmpresa
)


class TipoComprobanteContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = TipoComprobanteContable.objects.prefetch_related('comprobantes_empresas').all()
    serializer_class = TipoComprobanteContableSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = TipoComprobanteContableDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = TipoComprobanteContableDetalleSerializer
        return super().update(request, *args, **kwargs)


class TipoComprobanteContableEmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = TipoComprobanteContableEmpresa.objects.select_related('empresa', 'tipo_comprobante').all()
    serializer_class = TipoComprobanteContableEmpresaSerializer
