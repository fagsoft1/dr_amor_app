from rest_framework import serializers

from .models import Bodega, MovimientoInventario, MovimientoInventarioDetalle, TrasladoInventario, \
    TrasladoInventarioDetalle


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
    movimiento_detalle = serializers.CharField(source='movimiento.detalle', read_only=True)
    movimiento_proveedor_nombre = serializers.CharField(source='movimiento.proveedor.nombre', read_only=True)

    class Meta:
        model = MovimientoInventarioDetalle
        fields = [
            'url',
            'id',
            'modified',
            'movimiento',
            'movimiento_detalle',
            'movimiento_proveedor_nombre',
            'producto',
            'producto_nombre',
            'costo_unitario',
            'entra_cantidad',
            'entra_costo',
            'sale_cantidad',
            'sale_costo',
            'saldo_cantidad',
            'saldo_costo',
            'es_ultimo_saldo',
        ]


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    entra_costo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    entra_cantidad = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    sale_cantidad = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    sale_costo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

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
            'tipo',
            'motivo',
            'cargado',
            'entra_costo',
            'entra_cantidad',
            'sale_costo',
            'sale_cantidad',
            'observacion',
        ]


class TrasladoInventarioSerializer(serializers.ModelSerializer):
    bodega_origen_nombre = serializers.CharField(source='bodega_origen.nombre', read_only=True)
    bodega_destino_nombre = serializers.CharField(source='bodega_destino.nombre', read_only=True)

    class Meta:
        model = TrasladoInventario
        fields = [
            'url',
            'id',
            'bodega_origen',
            'bodega_origen_nombre',
            'bodega_destino',
            'bodega_destino_nombre',
            'movimiento_origen',
            'movimiento_destino',
            'trasladado',
        ]
        extra_kwargs = {
            'movimiento_origen': {'read_only': True},
            'movimiento_destino': {'read_only': True},

        }


class TrasladoInventarioDetalleSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    cantidad_origen = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_destino = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = TrasladoInventarioDetalle
        fields = [
            'url',
            'id',
            'traslado',
            'producto',
            'producto_nombre',
            'cantidad',
            'cantidad_realmente_trasladada',
            'cantidad_origen',
            'cantidad_destino',
        ]
