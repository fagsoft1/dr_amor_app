from django.db.models import OuterRef, Subquery
from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from datetime import datetime

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from inventarios.services import (
    movimiento_inventario_aplicar_movimiento
)
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
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer

    @detail_route(methods=['post'])
    def upload_foto_documento(self, request, pk=None):  # pragma: no cover
        movimiento = self.get_object()
        archivo = self.request.FILES['archivo']
        movimiento.documentos.create(imagen_documento=archivo)
        serializer = self.get_serializer(movimiento)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def delete_foto_documento(self, request, pk=None):  # pragma: no cover
        movimiento = self.get_object()
        documento_id = int(request.POST.get('documento_id', None))
        movimiento.documentos.get(id=documento_id).delete()
        serializer = self.get_serializer(movimiento)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def saldos_iniciales(self, request):
        qs = MovimientoInventario.saldos_iniciales.all()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def cargar_inventario(self, request, pk=None):
        movimiento_inventario = self.get_object()
        movimiento_inventario = movimiento_inventario_aplicar_movimiento(movimiento_inventario.id)
        serializer = self.get_serializer(movimiento_inventario)
        return Response(serializer.data)


class MovimientoInventarioDetalleViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = MovimientoInventarioDetalle.objects.select_related(
        'movimiento',
        'movimiento__proveedor'
    ).prefetch_related(
        'producto',
        'producto__categoria_dos',
        'producto__categoria_dos__categoria'
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
    permission_classes = [DjangoModelPermissionsFull]
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
        user = self.request.user
        from .services import traslado_inventario_realizar_traslado
        traslado = traslado_inventario_realizar_traslado(traslado_inventario_id=traslado.id, usuario_id=user.id)
        serializer = self.get_serializer(traslado)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def cambiar_estado(self, request, pk=None):
        # TODO: Hacer test
        traslado = self.get_object()
        if not traslado.trasladado:
            nuevo_estado = int(request.POST.get('nuevo_estado'))
            traslado.estado = nuevo_estado
            traslado.save()
            serializer = self.get_serializer(traslado)
            return Response(serializer.data)
        else:
            raise serializers.ValidationError(
                {'_error': 'El inventario ya se encuentra trasladado, no se puede cambiar estado'})

    @list_route(methods=['get'])
    def pendiente_verificacion_por_bodega_destino(self, request):
        # TODO: Hacer test
        bodega_id = int(request.GET.get('bodega_id'))
        qs = self.queryset.filter(bodega_destino=bodega_id, estado=2, trasladado=False)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class TrasladoInventarioDetallesViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    # TODO: Hacer queryset manager
    # TODO: Hacer test queryset
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
