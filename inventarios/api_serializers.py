from rest_framework import serializers

from .models import Bodega, MovimientoInventario, MovimientoInventarioDetalle


class BodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bodega
        fields = [
            'url',
            'id',
            'nombre',
            'es_principal',
        ]


class MovimientoInventarioDetalleSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = MovimientoInventarioDetalle
        fields = [
            'url',
            'id',
            'movimiento',
            'producto',
            'producto_nombre',
            'costo_unitario',
            'entra_cantidad',
            'entra_costo',
            'sale_cantidad',
            'sale_costo',
            'saldo_cantidad',
            'saldo_costo',
        ]


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    detalles = MovimientoInventarioDetalleSerializer(many=True, read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            'url',
            'id',
            'fecha',
            'proveedor',
            'proveedor_nombre',
            'bodega',
            'bodega_nombre',
            'detalle',
            'detalles',
            'tipo',
            'motivo',
        ]
