from django.db.models import Sum, ExpressionWrapper, DecimalField, OuterRef, Subquery
from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from datetime import datetime

from .api_serializers import (
    BodegaSerializer,
    MovimientoInventarioDetalleSerializer,
    MovimientoInventarioSerializer,
    TrasladoInventarioSerializer,
    TrasladoInventarioDetalleSerializer,
)
from .models import (
    Bodega,
    MovimientoInventario,
    MovimientoInventarioDetalle,
    TrasladoInventario,
    TrasladoInventarioDetalle,
)


class BodegaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MovimientoInventario.objects.select_related(
        'proveedor',
        'cuenta',
        'bodega'
    ).annotate(
        entra_costo=ExpressionWrapper(Sum('detalles__entra_costo'),
                                      output_field=DecimalField(max_digits=12, decimal_places=2)),
        entra_cantidad=ExpressionWrapper(Sum('detalles__entra_cantidad'),
                                         output_field=DecimalField(max_digits=12, decimal_places=2)),
        sale_cantidad=ExpressionWrapper(Sum('detalles__sale_cantidad'),
                                        output_field=DecimalField(max_digits=12, decimal_places=2)),
        sale_costo=ExpressionWrapper(Sum('detalles__sale_costo'),
                                     output_field=DecimalField(max_digits=12, decimal_places=2)),
    ).all()
    serializer_class = MovimientoInventarioSerializer

    @list_route(methods=['get'])
    def saldos_iniciales(self, request):
        qs = self.queryset.filter(motivo='saldo_inicial')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def cargar_inventario(self, request, pk=None):
        movimiento_inventario = self.get_object()
        if not movimiento_inventario.cargado:
            movimiento_inventario.cargar_inventario()
            serializer = self.get_serializer(movimiento_inventario)
            return Response(serializer.data)
        else:
            content = {'error': ['Revisar, el movimiento ya ha sido cargado']}
            raise serializers.ValidationError(content)

    def perform_create(self, serializer):
        instance = serializer.save(creado_por=self.request.user)
        if instance.motivo in 'compra':
            instance.tipo = 'E'
            instance.detalle = 'Entrada Mercancía x Compra'
        if instance.motivo == 'saldo_inicial':
            instance.tipo = 'E'
            instance.detalle = 'Saldo Inicial'
        if instance.motivo == 'ajuste_ingreso':
            instance.tipo = 'EA'
            instance.detalle = 'Ingreso Ajuste'
        if instance.motivo == 'ajuste_salida':
            instance.tipo = 'SA'
            instance.detalle = 'Salida Ajuste'
        instance.save()


class MovimientoInventarioDetalleViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MovimientoInventarioDetalle.objects.select_related(
        'movimiento',
        'movimiento__cuenta',
        'movimiento__proveedor'
    ).prefetch_related(
        'producto',
        'producto__categoria_dos',
        'producto__categoria_dos__categoria'
    ).all()
    serializer_class = MovimientoInventarioDetalleSerializer

    @list_route(methods=['get'])
    def consultar_por_tercero_cuenta_abierta(self, request):
        tercero_id = int(request.GET.get('tercero_id', None))
        qs = self.queryset.filter(
            movimiento__cuenta__propietario__tercero=tercero_id,
            movimiento__cuenta__liquidada=False,
            movimiento__cuenta__tipo=1
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def consultar_por_tercero_mesero_cuenta_abierta(self, request):
        tercero_id = int(request.GET.get('tercero_id', None))
        qs = self.queryset.filter(
            movimiento__cuenta__propietario__tercero=tercero_id,
            movimiento__cuenta__liquidada=False,
            movimiento__cuenta__tipo=2
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def por_movimiento(self, request):
        movimiento_id = int(request.GET.get('movimiento_id'))
        qs = self.queryset.filter(movimiento_id=movimiento_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def actual_por_bodega(self, request):
        bodega_id = int(request.GET.get('bodega_id'))
        qs = self.queryset.filter(movimiento__bodega_id=bodega_id, es_ultimo_saldo=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def actual_por_pdv(self, request):
        punto_venta_id = int(request.GET.get('punto_venta_id'))
        qs = self.queryset.filter(movimiento__bodega__punto_venta__id=punto_venta_id, es_ultimo_saldo=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def por_bodega_por_fecha(self, request):
        bodega_id = int(request.GET.get('bodega_id'))
        fecha_inicial = datetime.strptime(request.GET.get('fecha_inicial'), "%d/%m/%Y").date()
        fecha_final = datetime.strptime(request.GET.get('fecha_final'), "%d/%m/%Y").date()
        qs = self.queryset.filter(
            movimiento__bodega_id=bodega_id,
            movimiento__fecha__gte=fecha_inicial,
            movimiento__fecha__lte=fecha_final
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def por_bodega_por_producto(self, request):
        bodega_id = int(request.GET.get('bodega_id'))
        producto_id = int(request.GET.get('producto_id'))
        qs = self.queryset.filter(movimiento__bodega_id=bodega_id, producto_id=producto_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class TrasladoInventarioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = TrasladoInventario.objects.select_related(
        'bodega_destino',
        'bodega_origen',
        'movimiento_destino',
        'movimiento_origen',
    ).all()
    serializer_class = TrasladoInventarioSerializer

    @detail_route(methods=['post'])
    def trasladar(self, request, pk=None):
        traslado = self.get_object()
        traslado.realizar_traslado()
        serializer = self.get_serializer(traslado)
        return Response(serializer.data)


class TrasladoInventarioDetallesViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    producto_bodega_origen = MovimientoInventarioDetalle.objects.filter(
        movimiento__bodega_id=OuterRef('traslado__bodega_origen_id'),
        producto_id=OuterRef('producto_id'),
        es_ultimo_saldo=True,
    )
    producto_bodega_destino = MovimientoInventarioDetalle.objects.filter(
        movimiento__bodega_id=OuterRef('traslado__bodega_destino_id'),
        producto_id=OuterRef('producto_id'),
        es_ultimo_saldo=True,
    )
    queryset = TrasladoInventarioDetalle.objects.select_related(
        'producto',
    ).annotate(
        cantidad_origen=Subquery(producto_bodega_origen.values('saldo_cantidad')),
        cantidad_destino=Subquery(producto_bodega_destino.values('saldo_cantidad')),
    ).all()
    serializer_class = TrasladoInventarioDetalleSerializer

    @list_route(methods=['get'])
    def por_traslado(self, request):
        traslado_id = int(request.GET.get('traslado_id'))
        qs = self.queryset.filter(traslado_id=traslado_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
