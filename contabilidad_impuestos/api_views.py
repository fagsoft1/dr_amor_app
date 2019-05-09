from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    ImpuestoGrupoSerializer,
    ImpuestoSerializer
)
from .models import (
    Impuesto,
    ImpuestoGrupo
)


class ImpuestoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Impuesto.objects.all()
    serializer_class = ImpuestoSerializer


class ImpuestoGrupoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = ImpuestoGrupo.objects.all()
    serializer_class = ImpuestoGrupoSerializer
