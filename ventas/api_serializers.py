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
    class Meta:
        model = VentaProductoDetalle
        fields = [
            'id',
            'venta',
            'producto',
            'cantidad',
            'costo_unitario',
            'costo_total',
            'precio_unitario',
            'precio_total',
        ]
