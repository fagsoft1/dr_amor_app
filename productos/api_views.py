from django.db.models import Count, F, Q
from rest_framework import viewsets, serializers, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .api_serializers import CategoriaSerializer, CategoriaDosSerializer, ProductoSerializer, UnidadProductoSerializer
from .models import Categoria, CategoriaDos, Producto, UnidadProducto


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def perform_destroy(self, instance):
        if not instance.categorias_dos.exists():
            super().perform_destroy(instance)
        else:
            content = {'error': ['No se puede eliminar, hay productos con esta categoría']}
            raise serializers.ValidationError(content)


class CategoriaDosViewSet(viewsets.ModelViewSet):
    queryset = CategoriaDos.objects.select_related(
        'categoria'
    ).all()
    serializer_class = CategoriaDosSerializer

    def perform_destroy(self, instance):
        if not instance.productos.exists():
            super().perform_destroy(instance)
        else:
            content = {'error': ['No se puede eliminar, hay productos con esta categoría']}
            raise serializers.ValidationError(content)


class ProductoViewSet(viewsets.ModelViewSet):
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
    queryset = UnidadProducto.objects.all()
    serializer_class = UnidadProductoSerializer

    def perform_destroy(self, instance):
        if not instance.productos.exists():
            super().perform_destroy(instance)
        else:
            content = {'error': ['No se puede eliminar, hay productos con esta categoría']}
            raise serializers.ValidationError(content)
