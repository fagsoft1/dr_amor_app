from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    DiarioContableSerializer
)
from .models import (
    DiarioContable
)


class DiarioContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = DiarioContable.objects.select_related(
        'cuenta_debito_defecto',
        'cuenta_credito_defecto',
        'banco',
        'cuenta_bancaria',
    ).all()
    serializer_class = DiarioContableSerializer
