import json

from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from .api_serializers import (
    PuntoVentaSerializer
)
from .models import (
    PuntoVenta,
)
from cajas.models import (
    BaseDisponibleDenominacion,
    EfectivoEntregaDenominacion,
    ArqueoCaja,
    MovimientoDineroPDV
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

    @detail_route(methods=['post'])
    def hacer_entrega_efectivo_caja(self, request, pk=None):
        punto_venta = self.get_object()
        cierre = json.loads(request.POST.get('cierre'))
        cierre_para_arqueo = cierre.pop('cierre_para_arqueo')
        denominaciones_entrega = cierre.pop('denominaciones_entrega')
        denominaciones_base = cierre.pop('denominaciones_base')

        arqueo = ArqueoCaja.objects.create(usuario=self.request.user, **cierre_para_arqueo)
        for denominacion in denominaciones_entrega:
            EfectivoEntregaDenominacion.objects.create(arqueo_caja=arqueo, **denominacion)

        for denominacion in denominaciones_base:
            BaseDisponibleDenominacion.objects.create(arqueo_caja=arqueo, **denominacion)
        MovimientoDineroPDV.objects.filter(punto_venta_id=punto_venta).update(arqueo_caja=arqueo)

        return Response({'result': 'jiji'})
