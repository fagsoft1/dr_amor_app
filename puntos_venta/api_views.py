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
        'bodega',
        'usuario_actual'
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
        total_base = 0
        for denominacion in denominaciones_entrega:
            if int(denominacion.get('cantidad')) > 0:
                EfectivoEntregaDenominacion.objects.create(arqueo_caja=arqueo, **denominacion)

        for denominacion in denominaciones_base:
            cantidad = int(denominacion.get('cantidad'))
            valor = int(denominacion.get('valor'))
            if cantidad > 0:
                total_base += cantidad * valor
                BaseDisponibleDenominacion.objects.create(arqueo_caja=arqueo, **denominacion)

        MovimientoDineroPDV.objects.filter(
            punto_venta_id=punto_venta,
            arqueo_caja__isnull=True
        ).update(
            arqueo_caja=arqueo)
        MovimientoDineroPDV.objects.create(
            punto_venta=punto_venta,
            tipo='I',
            tipo_dos='BASE_INI',
            valor_efectivo=total_base,
            creado_por=self.request.user,
            concepto='Ingreso de base generada por el arqueo %s' % arqueo.id
        )
        punto_venta.abierto = False
        punto_venta.usuario_actual = None
        punto_venta.save()

        return Response({'arqueo_id': arqueo.id})
