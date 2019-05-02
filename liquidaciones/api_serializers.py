from rest_framework import serializers

from .models import LiquidacionCuenta


class LiquidacionCuentaSerializer(serializers.ModelSerializer):
    fecha_inicial_cuenta = serializers.DateTimeField(source='cuenta.created', read_only=True)
    usuario_cajero_username = serializers.CharField(
        source='punto_venta_turno.usuario.username',
        read_only=True
    )
    liquidacion_anterior = serializers.IntegerField(
        source='cuenta.cuenta_anterior.liquidacion.id',
        default=None,
        read_only=True
    )
    liquidacion_siguiente = serializers.IntegerField(
        source='cuenta.cuenta_siguiente.liquidacion.id',
        default=None,
        read_only=True
    )

    class Meta:
        model = LiquidacionCuenta
        fields = [
            'url',
            'id',
            'creado_por',
            'created',
            'punto_venta_turno',
            'usuario_cajero_username',
            'fecha_inicial_cuenta',
            'cuenta',
            'saldo_anterior',
            'liquidacion_anterior',
            'liquidacion_siguiente',
            'a_pagar_a_tercero',
            'a_cobrar_a_tercero',
            'tarjeta_o_transferencia',
            'pagado',
            'saldo',
        ]
