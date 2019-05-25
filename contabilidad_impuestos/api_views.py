from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    ImpuestoSerializer
)
from .models import (
    Impuesto
)


class ImpuestoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Impuesto.objects.select_related(
        'cuenta_impuesto',
        'cuenta_impuesto_notas_credito',
    ).all()
    serializer_class = ImpuestoSerializer

# Carrera 47 A 13-86 Santo Domingo


# 08
# VCR417
