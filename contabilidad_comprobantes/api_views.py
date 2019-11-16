from rest_framework import viewsets

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    TipoComprobanteContableSerializer,
    TipoComprobanteContableEmpresaSerializer
)
from .models import (
    TipoComprobanteContable,
    TipoComprobanteContableEmpresa
)


class TipoComprobanteContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = TipoComprobanteContable.objects.prefetch_related('comprobantes_empresas').all()
    serializer_class = TipoComprobanteContableSerializer


class TipoComprobanteContableEmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = TipoComprobanteContableEmpresa.objects.select_related('empresa', 'tipo_comprobante').all()
    serializer_class = TipoComprobanteContableEmpresaSerializer
