from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    BancoSerializer,
    BancoDetalleSerializer,
    CuentaBancariaBancoSerializer,
)
from .models import (
    Banco,
    CuentaBancariaBanco
)


class BancoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Banco.objects.all()
    serializer_class = BancoSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = BancoDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = BancoDetalleSerializer
        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.serializer_class = BancoDetalleSerializer
        return super().create(request, *args, **kwargs)


class CuentaBancariaBancoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = CuentaBancariaBanco.objects.select_related('banco').all()
    serializer_class = CuentaBancariaBancoSerializer
