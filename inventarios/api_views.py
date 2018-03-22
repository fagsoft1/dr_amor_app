from rest_framework import viewsets

from .api_serializers import BodegaSerializer, MovimientoInventarioDetalleSerializer, MovimientoInventarioSerializer
from .models import Bodega, MovimientoInventario, MovimientoInventarioDetalle


class BodegaViewSet(viewsets.ModelViewSet):
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventario.objects.select_related(
        'proveedor',
        'bodega'
    ).prefetch_related(
        'detalles'
    ).all()
    serializer_class = MovimientoInventarioSerializer

    def perform_create(self, serializer):
        instance = serializer.save(creado_por=self.request.user)
        if instance.motivo in 'compra':
            instance.tipo = 'E'
            instance.detalle = 'Entrada Mercancía x Compra'
        if instance.motivo == 'saldo_inicial':
            instance.tipo = 'E'
            instance.detalle = 'Saldo Inicial'
        instance.save()
    # def perform_update(self, serializer):
    #     instance = serializer.save()
    #     send_email_confirmation(user=self.request.user, modified=instance)


class MovimientoInventarioDetalleViewSet(viewsets.ModelViewSet):
    queryset = MovimientoInventarioDetalle.objects.prefetch_related('producto').all()
    serializer_class = MovimientoInventarioDetalleSerializer
