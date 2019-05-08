from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    CuentaContableSerializer
)
from .models import (
    CuentaContable
)


class CuentaContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = CuentaContable.objects.select_related(
        'cuenta_padre'
    ).all()
    serializer_class = CuentaContableSerializer
