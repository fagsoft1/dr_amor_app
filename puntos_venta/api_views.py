from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .api_serializers import (
    PuntoVentaSerializer
)
from .models import (
    PuntoVenta,
)


class PuntoVentaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = PuntoVenta.objects.select_related(
        'bodega'
    ).all()
    serializer_class = PuntoVentaSerializer

    @list_route(methods=['get'])
    def listar_por_colaborador(self, request) -> Response:
        colaborador_id = request.GET.get('colaborador_id')
        qs = self.get_queryset().filter(
            usuarios__tercero=colaborador_id
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def listar_por_usuario_username(self, request) -> Response:
        username = request.GET.get('username')
        qs = self.get_queryset().filter(
            usuarios__username=username
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
