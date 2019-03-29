from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .api_serializers import CategoriaSerializer, CategoriaDosSerializer, ProductoSerializer, UnidadProductoSerializer
from .models import CategoriaProducto, CategoriaDosProducto, Producto, UnidadProducto
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull


class CategoriaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaSerializer


class CategoriaDosViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = CategoriaDosProducto.objects.select_related(
        'categoria'
    ).all()
    serializer_class = CategoriaDosSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Producto.objects.select_related(
        'categoria_dos__categoria',
        'categoria_dos',
        'unidad_producto',
        'empresa'
    ).all()
    serializer_class = ProductoSerializer

    @list_route(methods=['get'])
    def sin_saldos_iniciales(self, request):
        qs = self.queryset.filter(
            ~Q(movimientos_inventarios__movimiento__motivo='saldo_inicial')
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # def perform_destroy(self, instance):
    #     if not instance.mis_movimientos_inventario.exists():
    #         super().perform_destroy(instance)
    #     else:
    #         content = {'error': ['No se puede eliminar, hay movimientos de este producto']}
    #         raise serializers.ValidationError(content)


class UnidadProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = UnidadProducto.objects.all()
    serializer_class = UnidadProductoSerializer
