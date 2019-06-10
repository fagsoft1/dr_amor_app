from rest_framework import serializers
from .models import Producto, CategoriaProducto, CategoriaDosProducto, UnidadProducto


class CategoriaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = CategoriaProducto
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'codigo'
        ]


class CategoriaDosSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = CategoriaDosProducto
        fields = [
            'url',
            'id',
            'nombre',
            'categoria_nombre',
            'codigo',
            'categoria',
            'to_string',
        ]


class UnidadProductoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = UnidadProducto
        fields = [
            'url',
            'id',
            'nombre',
            'to_string'
        ]


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria_dos.categoria.nombre', read_only=True)
    categoria_dos_nombre = serializers.CharField(source='categoria_dos.nombre', read_only=True)
    unidad_producto_nombre = serializers.CharField(source='unidad_producto.nombre', read_only=True)
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = Producto
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'categoria_nombre',
            'categoria_dos',
            'categoria_dos_nombre',
            'unidad_producto',
            'unidad_producto_nombre',
            'empresa',
            'empresa_nombre',
            'precio_venta',
            'comision',
            'activo'
        ]
