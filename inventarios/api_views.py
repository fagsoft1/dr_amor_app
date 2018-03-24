from django.db.models import Sum, ExpressionWrapper, DecimalField, OuterRef, Subquery
from rest_framework import viewsets
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

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
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventario.objects.select_related(
        'proveedor',
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
        movimiento_inventario.cargar_inventario()
        serializer = self.get_serializer(movimiento_inventario)
        return Response(serializer.data)

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
    queryset = MovimientoInventarioDetalle.objects.select_related(
        'movimiento',
        'movimiento__proveedor'
    ).prefetch_related(
        'producto'
    ).all()
    serializer_class = MovimientoInventarioDetalleSerializer

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
    def por_bodega_por_producto(self, request):
        bodega_id = int(request.GET.get('bodega_id'))
        producto_id = int(request.GET.get('producto_id'))
        qs = self.queryset.filter(movimiento__bodega_id=bodega_id, producto_id=producto_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class TrasladoInventarioViewSet(viewsets.ModelViewSet):
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
