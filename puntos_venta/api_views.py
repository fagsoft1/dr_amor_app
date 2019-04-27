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
