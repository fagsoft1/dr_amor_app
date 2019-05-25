from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull, EsColaboradorPermission
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

    @list_route(methods=['get'], permission_classes=[EsColaboradorPermission])
    def cuentas_detalles(self, request):
        qs = self.queryset.filter(
            tipo='D'
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'], permission_classes=[EsColaboradorPermission])
    def cuentas_titulo(self, request):
        qs = self.queryset.filter(
            tipo='T'
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
