import json

from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from django.utils import timezone

from inventarios.services import movimiento_inventario_aplicar_movimiento
from terceros.models import Tercero
from .api_serializers import (
    PuntoVentaSerializer
)
from .models import (
    PuntoVenta,
)
from cajas.models import (
    BaseDisponibleDenominacion,
    EfectivoEntregaDenominacion,
    ArqueoCaja
)
from inventarios.models import (
    MovimientoInventario
)


class PuntoVentaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = PuntoVenta.objects.select_related(
        'bodega',
        'usuario_actual'
    ).all()
    serializer_class = PuntoVentaSerializer

    @detail_route(methods=['post'])
    def efectuar_venta(self, request, pk=None):
        # TODO: Hacer funcion
        punto_venta = self.get_object()
        tipo_venta = int(
            request.POST.get('tipo_venta'))  # 1 venta efectivo, 2 venta mesero, 3 venta chica o colaborador
        pedido = json.loads(request.POST.get('pedido'))
        user = self.request.user
        nuevo_movimiento_inventario = MovimientoInventario(
            creado_por=user,
            fecha=timezone.now(),
            tipo='S',
            bodega=punto_venta.bodega,
            sesion_trabajo_pv=user.tercero.sesion_trabajo_pv_abierta
        )

        if tipo_venta == 3 or tipo_venta == 2:
            qr_codigo = request.POST.get('qr_codigo')
            usuario_id = request.POST.get('usuario_id')
            tercero = Tercero.objects.get(id=usuario_id, qr_acceso=qr_codigo)

            if tercero:
                if tipo_venta == 3:
                    nuevo_movimiento_inventario.cuenta = tercero.cuenta_abierta
                    if tercero.es_colaborador:
                        nuevo_movimiento_inventario.motivo = 'venta_tienda_colaborador'
                    if tercero.es_acompanante:
                        nuevo_movimiento_inventario.motivo = 'venta_tienda_acompanante'
                    nuevo_movimiento_inventario.detalle = 'Venta de pdv %s a %s' % (
                        punto_venta.nombre,
                        tercero.full_name_proxy
                    )
                    nuevo_movimiento_inventario.save()

                if tipo_venta == 2:
                    if tercero.usuario.has_perm('terceros.can_be_waiter'):
                        nuevo_movimiento_inventario.cuenta = tercero.cuenta_abierta_mesero
                        nuevo_movimiento_inventario.motivo = 'venta_tienda_mesero'
                        nuevo_movimiento_inventario.detalle = 'Venta de pdv %s a mesero %s' % (
                            punto_venta.nombre,
                            tercero.full_name_proxy
                        )
                        nuevo_movimiento_inventario.save()
                    else:
                        content = {'_error': 'Este usuario no es mesero'}
                        raise serializers.ValidationError(content)

        if nuevo_movimiento_inventario.id:
            for item in pedido:
                producto_id = item.pop('id')
                producto_precio_total = item.pop('precio_total')
                producto_cantidad = item.pop('cantidad')
                # item_bodega_anterior = MovimientoInventarioDetalle.objects.filter(
                #     movimiento__bodega=punto_venta.bodega,
                #     es_ultimo_saldo=True,
                #     producto_id=producto_id
                # )
                nuevo_movimiento_inventario.detalles.create(
                    sale_cantidad=producto_cantidad,
                    producto_id=producto_id,
                    precio_venta_total=-producto_precio_total
                )

                nuevo_movimiento_inventario = movimiento_inventario_aplicar_movimiento(nuevo_movimiento_inventario.id)

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
        # TODO: Hacer funcion
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

        # TODO: Hacer lo correspondiente al registro en el nuevo TransaccionCaja
        # MovimientoDineroPDV.objects.filter(
        #     punto_venta_id=punto_venta,
        #     arqueo_caja__isnull=True
        # ).update(
        #     arqueo_caja=arqueo)
        #
        # TODO: Hacer lo correspondiente al registro en el nuevo TransaccionCaja
        # MovimientoDineroPDV.objects.create(
        #     punto_venta=punto_venta,
        #     tipo='I',
        #     tipo_dos='BASE_INI',
        #     valor_efectivo=total_base,
        #     creado_por=self.request.user,
        #     concepto='Ingreso de base generada por el arqueo %s' % arqueo.id
        # )
        punto_venta.abierto = False
        punto_venta.usuario_actual = None
        punto_venta.save()

        return Response({'arqueo_id': arqueo.id})
