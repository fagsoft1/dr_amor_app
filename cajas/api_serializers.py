from channels.binding.websockets import WebsocketBinding
from rest_framework import serializers

from .models import BilleteMoneda, ArqueoCaja


class BilleteMonedaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BilleteMoneda
        fields = (
            'id',
            'tipo',
            'valor',
            'activo',
        )


class ArqueoCajaSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    punto_venta_nombre = serializers.CharField(source='punto_venta.nombre', read_only=True)
    tercero_nombre = serializers.CharField(source='usuario.tercero.full_name_proxy', read_only=True)
    valor_entrega_base_dia_siguiente = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_entrega_efectivo = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_entrega_dolares = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_entrega_total = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_egresos_efectivo = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_ingreso_efectivo = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_ingreso_tarjeta = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_total = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    cuadre = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)

    class Meta:
        model = ArqueoCaja
        fields = (
            'id',
            'usuario',
            'usuario_username',
            'tercero_nombre',
            'created',
            'punto_venta',
            'punto_venta_nombre',
            'dolares',
            'dolares_tasa',
            'nro_voucher',
            'valor_entrega_total',
            'valor_entrega_base_dia_siguiente',
            'valor_tarjeta',
            'valor_entrega_efectivo',
            'valor_entrega_dolares',
            'valor_mo_egresos_efectivo',
            'valor_mo_ingreso_efectivo',
            'valor_mo_ingreso_tarjeta',
            'valor_mo_total',
            'cuadre',
        )
