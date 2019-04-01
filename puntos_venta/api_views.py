import json

from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    PuntoVentaSerializer
)
from .models import (
    PuntoVenta,
)


class PuntoVentaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = PuntoVenta.objects.select_related(
        'bodega',
        'usuario_actual'
    ).all()
    serializer_class = PuntoVentaSerializer

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def efectuar_venta_producto(self, request, pk=None):
        punto_venta = self.get_object()
        from ventas.services import venta_producto_efectuar_venta
        from terceros.models import Tercero
        pedidos = json.loads(request.POST.get('pedido', None))
        tipo_venta = int(request.POST.get('tipo_venta', None))
        qr_codigo = request.POST.get('qr_codigo')
        tercero_id = request.POST.get('tercero_id', None)
        pago_efectivo = request.POST.get('pago_efectivo', 0)
        tercero = None
        if tercero_id:
            tercero = Tercero.objects.get(pk=tercero_id)
        venta_producto_efectuar_venta(
            punto_venta_id=punto_venta.id,
            usuario_pdv_id=self.request.user.id,
            tipo_venta=tipo_venta,
            pedidos=pedidos,
            cliente_usuario_id=tercero.usuario_id if tercero_id else None,
            cliente_qr_codigo=qr_codigo,
            pago_efectivo=pago_efectivo
        )
        mensaje = 'La venta se ha efectuado'
        return Response({'result': mensaje})

    @list_route(methods=['get'])
    def listar_por_colaborador(self, request) -> Response:
        colaborador_id = request.GET.get('colaborador_id')
        qs = self.get_queryset().filter(
            usuarios__tercero=colaborador_id
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'], permission_classes=[permissions.AllowAny])
    def listar_por_usuario_username(self, request) -> Response:
        username = request.GET.get('username')
        qs = self.get_queryset().filter(
            usuarios__username=username
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # @detail_route(methods=['post'])
    # def hacer_entrega_efectivo_caja(self, request, pk=None):
    #     # TODO: Hacer funcion
    #     punto_venta = self.get_object()
    #     cierre = json.loads(request.POST.get('cierre'))
    #     cierre_para_arqueo = cierre.pop('cierre_para_arqueo')
    #     denominaciones_entrega = cierre.pop('denominaciones_entrega')
    #     denominaciones_base = cierre.pop('denominaciones_base')
    #
    #     arqueo = ArqueoCaja.objects.create(usuario=self.request.user, **cierre_para_arqueo)
    #     total_base = 0
    #     for denominacion in denominaciones_entrega:
    #         if int(denominacion.get('cantidad')) > 0:
    #             EfectivoEntregaDenominacion.objects.create(arqueo_caja=arqueo, **denominacion)
    #
    #     for denominacion in denominaciones_base:
    #         cantidad = int(denominacion.get('cantidad'))
    #         valor = int(denominacion.get('valor'))
    #         if cantidad > 0:
    #             total_base += cantidad * valor
    #             BaseDisponibleDenominacion.objects.create(arqueo_caja=arqueo, **denominacion)
    #
    #     # TODO: Hacer lo correspondiente al registro en el nuevo TransaccionCaja
    #     # MovimientoDineroPDV.objects.filter(
    #     #     punto_venta_id=punto_venta,
    #     #     arqueo_caja__isnull=True
    #     # ).update(
    #     #     arqueo_caja=arqueo)
    #     #
    #     # TODO: Hacer lo correspondiente al registro en el nuevo TransaccionCaja
    #     # MovimientoDineroPDV.objects.create(
    #     #     punto_venta=punto_venta,
    #     #     tipo='I',
    #     #     tipo_dos='BASE_INI',
    #     #     valor_efectivo=total_base,
    #     #     creado_por=self.request.user,
    #     #     concepto='Ingreso de base generada por el arqueo %s' % arqueo.id
    #     # )
    #     punto_venta.abierto = False
    #     punto_venta.usuario_actual = None
    #     punto_venta.save()
    #
    #     return Response({'arqueo_id': arqueo.id})
