from django.db.models import Q
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

from .models import Tercero
from rest_framework import viewsets, permissions

from .api_serializers import AcompananteSerializer, ColaboradorSerializer, ProveedorSerializer, TerceroSerializer
from .mixins import TerceroViewSetMixin


class TerceroViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.select_related('usuario', 'categoria_modelo').all()
    serializer_class = TerceroSerializer

    @list_route(methods=['get'])
    def listar_presentes(self, request) -> Response:
        qs = self.get_queryset().filter(
            Q(presente=True) &
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def listar_ausentes(self, request) -> Response:
        qs = self.get_queryset().filter(
            Q(presente=False) & Q(usuario__is_active=True) & (Q(es_acompanante=True) | Q(es_colaborador=True))
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class AcompananteViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.select_related('usuario', 'categoria_modelo').filter(es_acompanante=True).all()
    serializer_class = AcompananteSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo', 'alias_modelo']


class ColaboradorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.select_related('usuario').filter(es_colaborador=True).all()
    serializer_class = ColaboradorSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo']

    @detail_route(methods=['post'])
    def adicionar_punto_venta(self, request, pk=None):
        colaborador = self.get_object()
        punto_venta_id = self.request.POST.get('punto_venta_id')
        if hasattr(colaborador, 'usuario'):
            usuario = colaborador.usuario
            if not usuario.mis_puntos_venta.filter(id=punto_venta_id).exists():
                usuario.mis_puntos_venta.add(punto_venta_id)
        return Response({'result': 'se ha adicionado correctamente el punto de venta'})

    @detail_route(methods=['post'])
    def quitar_punto_venta(self, request, pk=None):
        colaborador = self.get_object()
        punto_venta_id = self.request.POST.get('punto_venta_id')
        if hasattr(colaborador, 'usuario'):
            usuario = colaborador.usuario
            if usuario.mis_puntos_venta.filter(id=punto_venta_id).exists():
                usuario.mis_puntos_venta.remove(punto_venta_id)
        return Response({'result': 'se ha retirado correctamente el punto de venta'})


class ProveedorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.filter(es_proveedor=True).all()
    serializer_class = ProveedorSerializer
    search_fields = ['=nro_identificacion', 'nombre']
