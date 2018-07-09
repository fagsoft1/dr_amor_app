from channels.binding.websockets import WebsocketBinding
from rest_framework import serializers
from .models import Producto, Categoria, CategoriaDos, UnidadProducto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = [
            'url',
            'id',
            'nombre',
            'codigo'
        ]


class CategoriaDosSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = CategoriaDos
        fields = [
            'url',
            'id',
            'nombre',
            'categoria_nombre',
            'codigo',
            'categoria',
        ]


class UnidadProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadProducto
        fields = [
            'url',
            'id',
            'nombre'
        ]


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria_dos.categoria.nombre', read_only=True)
    categoria_dos_nombre = serializers.CharField(source='categoria_dos.nombre', read_only=True)
    unidad_producto_nombre = serializers.CharField(source='unidad_producto.nombre', read_only=True)
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'url',
            'id',
            'nombre',
            'categoria_nombre',
            'categoria_dos',
            'categoria_dos_nombre',
            'unidad_producto',
            'unidad_producto_nombre',
            'empresa',
            'empresa_nombre',
            'precio_venta',
            'activo'
        ]


class ProductoBinding(WebsocketBinding):
    model = Producto
    stream = "productos"
    fields = ["id", ]

    def serialize_data(self, instance):
        serializado = ProductoSerializer(instance, context={'request': None})
        return serializado.data

    @classmethod
    def group_names(cls, *args, **kwargs):
        return ["binding.pos_servicios"]

    def has_permission(self, user, action, pk):
        return True
