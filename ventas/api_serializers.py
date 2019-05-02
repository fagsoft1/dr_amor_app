from rest_framework import serializers
from .models import VentaProducto, VentaProductoDetalle


class VentaProductoSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = VentaProducto
        fields = [
            'id',
            'user',
            'punto_venta_turno',
            'cuenta'
        ]


class VentaProductoDetalleSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(read_only=True, source='producto.nombre')
    cuenta = serializers.PrimaryKeyRelatedField(read_only=True, source='venta.cuenta')
    cuenta_liquidada = serializers.NullBooleanField(read_only=True, source='venta.cuenta.liquidada')
    cuenta_tipo = serializers.IntegerField(source='venta.cuenta.tipo', read_only=True, allow_null=True)
    cuenta_usuario = serializers.PrimaryKeyRelatedField(
        source='venta.cuenta.propietario',
        read_only=True,
        allow_null=True
    )
    usuario_cajero_username = serializers.CharField(
        source='venta.punto_venta_turno.usuario.username',
        read_only=True
    )

    class Meta:
        model = VentaProductoDetalle
        fields = [
            'id',
            'producto_nombre',
            'venta',
            'cuenta',
            'cuenta_liquidada',
            'cuenta_tipo',
            'cuenta_usuario',
            'cuenta_comision',
            'usuario_cajero_username',
            'comision',
            'producto',
            'cantidad',
            'costo_unitario',
            'costo_total',
            'precio_unitario',
            'precio_total',
        ]


class VentaProductoConDetalleSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    productos = VentaProductoDetalleSerializer(many=True)

    class Meta:
        model = VentaProducto
        fields = [
            'id',
            'user',
            'created',
            'punto_venta_turno',
            'cuenta',
            'productos'
        ]
