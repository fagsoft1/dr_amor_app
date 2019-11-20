import json
from decimal import Decimal

from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    PuntoVentaSerializer,
    PuntoVentaTurnoSerializer
)
from .models import (
    PuntoVenta,
    PuntoVentaTurno
)


class PuntoVentaTurnoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = PuntoVentaTurno.objects.all()
    serializer_class = PuntoVentaTurnoSerializer

    @action(detail=False, methods=['get'])
    def abiertos(self, request) -> Response:
        qs = self.get_queryset().abiertos()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class PuntoVentaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = PuntoVenta.objects.select_related(
        'bodega',
        'cuenta_contable_caja',
        'usuario_actual'
    ).all()
    serializer_class = PuntoVentaSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def abrir_punto_venta(self, request, pk=None):
        punto_venta = self.get_object()
        base_inicial_efectivo = float(request.POST.get('base_inicial_efectivo', None))

        from .services import punto_venta_abrir
        punto_venta, punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.request.user.id,
            punto_venta_id=punto_venta.id,
            base_inicial_efectivo=base_inicial_efectivo
        )

        return Response({'result': 'El punto de venta %s se ha aperturado correctamente' % punto_venta.nombre})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
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

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def relacionar_concepto_caja_cierre(self, request, pk=None):
        from .services import (
            punto_venta_relacionar_concepto_operacion_caja_cierre,
            punto_venta_quitar_concepto_operacion_caja_cierre
        )
        punto_venta = self.get_object()
        concepto_id = self.request.POST.get('concepto_id')
        existe_concepto = punto_venta.conceptos_operaciones_caja_cierre.filter(pk=concepto_id).exists()
        if existe_concepto:
            punto_venta_quitar_concepto_operacion_caja_cierre(
                punto_venta_id=punto_venta.id,
                concepto_operacion_caja_id=concepto_id
            )
        else:
            punto_venta_relacionar_concepto_operacion_caja_cierre(
                punto_venta_id=punto_venta.id,
                concepto_operacion_caja_id=concepto_id
            )
        serializer = self.get_serializer(punto_venta)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def listar_por_colaborador(self, request) -> Response:
        colaborador_id = request.GET.get('colaborador_id')
        qs = self.get_queryset().filter(
            usuarios__tercero=colaborador_id
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def listar_por_usuario_username(self, request) -> Response:
        username = request.GET.get('username')
        qs = self.get_queryset().filter(
            usuarios__username=username
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def hacer_cierre(self, request, pk=None):
        from .services import punto_venta_cerrar
        cierre = json.loads(request.POST.get('cierre'))
        cierre_para_arqueo = cierre.pop('cierre_para_arqueo')
        denominaciones_entrega = cierre.pop('denominaciones_entrega')
        denominaciones_base = cierre.pop('denominaciones_base')
        operaciones_caja = cierre.pop('operaciones_caja')
        punto_venta, arqueo = punto_venta_cerrar(
            usuario_pv_id=self.request.user.id,
            entrega_efectivo_dict=denominaciones_entrega,
            entrega_base_dict=denominaciones_base,
            valor_tarjeta=Decimal(cierre_para_arqueo.get('valor_en_tarjetas', 0)),
            nro_vauchers=Decimal(cierre_para_arqueo.get('numero_vauchers', 0)),
            valor_dolares=Decimal(cierre_para_arqueo.get('dolares_cantidad', 0)),
            tasa_dolar=Decimal(cierre_para_arqueo.get('dolares_tasa', 0)),
            operaciones_caja_dict=operaciones_caja
        )
        return Response({'arqueo_id': arqueo.id})
