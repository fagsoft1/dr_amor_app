from rest_framework import viewsets, permissions
from rest_framework.decorators  import action
from rest_framework.response import Response

from .models import CategoriaAcompanante, FraccionTiempo, CategoriaFraccionTiempo
from .api_serializers import (
    CategoriaAcompananteSerializer,
    FraccionTiempoSerializer,
    CategoriaFraccionTiempoSerializer
)


class CategoriaAcompananteViewSet(viewsets.ModelViewSet):
    queryset = CategoriaAcompanante.objects.all()
    serializer_class = CategoriaAcompananteSerializer
    permission_classes = [permissions.IsAuthenticated]


class FraccionTiempoViewSet(viewsets.ModelViewSet):
    queryset = FraccionTiempo.objects.all()
    serializer_class = FraccionTiempoSerializer
    permission_classes = [permissions.IsAuthenticated]


class CategoriaFraccionTiempoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaFraccionTiempo.objects.all()
    serializer_class = CategoriaFraccionTiempoSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def listar_x_categoria(self, request) -> Response:
        categoria_id = request.GET.get('categoria_id')
        qs = self.get_queryset().filter(
            categoria_id=categoria_id
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
