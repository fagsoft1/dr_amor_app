from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    BancoSerializer,
    CuentaBancariaBancoSerializer
)
from .models import (
    Banco,
    CuentaBancariaBanco
)


class BancoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Banco.objects.all()
    serializer_class = BancoSerializer


class CuentaBancariaBancoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = CuentaBancariaBanco.objects.select_related('banco').all()
    serializer_class = CuentaBancariaBancoSerializer
