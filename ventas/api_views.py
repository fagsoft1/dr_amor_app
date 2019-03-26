from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .models import VentaProducto, VentaProductoDetalle
from rest_framework import viewsets, permissions
from .api_serializers import VentaProductoSerializer, VentaProductoDetalleSerializer


class VentaProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = VentaProducto.objects.all()
    serializer_class = VentaProductoSerializer


class VentaProductoDetalleViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = VentaProductoDetalle.objects.all()
    serializer_class = VentaProductoDetalleSerializer
