from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    ApunteContableSerializer,
    AsientoContableSerializer
)
from .models import (
    ApunteContable,
    AsientoContable
)


class AsientoContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = AsientoContable.objects.select_related(
        'diario_contable',
        'empresa'
    ).all()
    serializer_class = AsientoContableSerializer


class ApunteContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = ApunteContable.objects.select_related(
        'cuenta_contable',
        'asiento_contable'
    ).all()
    serializer_class = ApunteContableSerializer
