from rest_framework.decorators  import action
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull, EsInternoPermission
from .models import VentaProducto, VentaProductoDetalle
from rest_framework import viewsets, permissions
from .api_serializers import VentaProductoSerializer, VentaProductoDetalleSerializer


class VentaProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = VentaProducto.objects.all()
    serializer_class = VentaProductoSerializer


class VentaProductoDetalleViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = VentaProductoDetalle.objects.select_related(
        'venta',
        'venta__cuenta'
    ).all()
    serializer_class = VentaProductoDetalleSerializer

    @action(detail=False, methods=['get'], permission_classes=[EsInternoPermission])
    def consultar_por_tercero_cuenta_abierta(self, request):
        tercero_id = request.GET.get('tercero_id', None)
        qs = self.queryset.filter(
            venta__cuenta__propietario__tercero=tercero_id,
            venta__cuenta__liquidada=False,
            venta__cuenta__tipo=1
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
